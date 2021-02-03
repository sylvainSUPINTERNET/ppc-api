'use strict';

import profileRouter from "./router/profile/profile";

require('dotenv').config();

import {OauthProvider} from "./config/oauthConfig";
import {sequelize} from "./db/DbConnection";
import models from "./db/models/index";


import {config, dbConfig, getResourcePath} from './config/config';
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');


import app from './server/Application';
import authRouter from "./router/auth/auth";
import { Users } from "./db/models/users.model";
import {permissions} from "./config/permissions";
import { Roles } from "./db/models/roles.model";
import { Permissions } from "./db/models/permissions.model";
import { authMiddleware } from "./middlewares/auth/auth.middleware";

const jwt = require('jsonwebtoken');
import { v4 as uuidv4 } from 'uuid';
import userRouter from "./router/user/user.router";


const cors = require('cors');

app.use(cors({
    origin: process.env.CORS_ORIGIN_CLIENT_COOKIE_HTTPONLY,
    credentials: true
    }));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());


/**
 * HTTP logger
 */
const morgan = require('morgan');
app.use(morgan('combined'));



/**
 * Resources
 */
/*
app.use(getResourcePath('auth'), authRouter);
*/
app.use(getResourcePath('profiles'), profileRouter);
app.use(getResourcePath('users'), userRouter);


app.get('/test', authMiddleware.isAuthenticated, authMiddleware.isAuthorized(["PROFIL_READ"], true), (req,res,next) => {
    res.status(200).json({
        "message":"salut"
    })
})

app.get('/api/v1/token/verify', (req,res,next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];

        try {
            let decoded = jwt.verify(token,  process.env.JWT_CLIENT_TOKEN_SECRET);
            res.status(200).json({
                "data": decoded
            })
        } catch (e) {
            res.status(403).json({
                "data": e
            })
        }

    } else {
        res.status(403).json({
            "data": "No allowed"
        });
    }

})


// oauth redirect - redirect_uri Oauth2
// access_type 2 :
// - Token Online a courte durée , qui sert uniquement au moment d'un appel
// - OU Offline qui permet de faire des API bcp plus tard dans le temps
// ! beware, code can be used only one time to generate an access token!
app.get('/connect/google', async (req,res,next) => {
    // openID endpoints infos (discovery)
    const openIdDiscovery = await fetch(OauthProvider.google.openIdConfiguration); // discoveryJSON
    const endpoints = await openIdDiscovery.json(); // endpoints from discovery

    // Retrieve access_token
    let optionsToken = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body:new URLSearchParams(`code=${req.query.code}&grant_type=authorization_code&client_id=${process.env.GOOGLE_CLIENT_ID}&client_secret=${process.env.GOOGLE_CLIENT_SECRET}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}`)
    }


    const tokenInfo = await fetch(endpoints["token_endpoint"], optionsToken);
    const tokenResponse = await tokenInfo.json();
    let accessToken =  tokenResponse["access_token"]

    // online avilable with client online in URL not offline
    //let refreshToken = tokenResponse["refresh_token"] // use if in case of offline, if u need token once again
    console.log("access token : " + accessToken)
    //console.log("refresh token" + refreshToken)
    console.log("scope : " + tokenResponse["scope"])


    // Get user Data 
    let optionUserInfo = {
        method: "GET", 
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    }
    const userInfo = await fetch(endpoints["userinfo_endpoint"], optionUserInfo);
    const respUserInfo = await userInfo.json();
    

    console.log(respUserInfo);
    console.log("USER EMAIL : " + respUserInfo["email"]);
    console.log("USER PICTURE " + respUserInfo["picture"])

    const user = await Users.findOne({
        where:  {
            fullName: respUserInfo["name"],
            lastName: respUserInfo["family_name"],
            firstName: respUserInfo["given_name"],
            email: respUserInfo["email"],
            locale: respUserInfo["locale"],
            provider: 'google'
        },
    });
    console.log("USER FOUND : ", user);

    if ( user === null ) {
        try {
            const role = await Roles.findOne({
                where:  {
                    name: "ROLE_USER"
                },
            });

            const newUser = Users.build({             
                fullName: respUserInfo["name"],
                pictureLink: respUserInfo["picture"],
                lastName: respUserInfo["family_name"],
                firstName: respUserInfo["given_name"],
                email: respUserInfo["email"],
                locale: 'fr',
                active: true, 
                roleId: role.dataValues.id,
                uuid: uuidv4(),
                provider: 'google'});
            const respSave = await newUser.save();
        } catch ( e ) {
            console.log("ERR save new user : ", e);
        }

    } else {
        console.log("User already exist. Skip creation")
    }

    


    // Save user in DB + init session 
    // TODO : https://www.grafikart.fr/tutoriels/oauth2-php-google-1171 26:24

    // TODO => insert User in DB IF not exist only
    // Create session with that user 
    // Redirect to the client URL with the user ID (client side handle it to connect user)


    // Create user 
    // Returns data in cookie for auto completion (client)
    // Account is consider as disable, until the user associate username to it
    // When its done => user account is definitly created.


    // https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=<accesstoken> // retrieve info
    // Ce qu'on peut faire c'est regarder le scope de l'utilisateur pour se baser là dessus concernant les "roles" => limtié mais suffisant


    // TODO :
    // 0 - Send access token (from cookie read only with react) => fetch same origin ?
    // 1 - Middleware : Analysis token with the provider tokeninfo path (ex for google) https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=<accesstoken>
    // 2 - 


    /*
        if ( process.env.ACTIVE_PROFIL === "prod") {
            // for secure need HTTPs
            res.cookie("zg-access-token", accessToken, { httpOnly: true, secure:false, maxAge: 3600}); // path to be accessible on every pages
            res.cookie("zg-access-token-provider", "google", { httpOnly: true, secure:false, maxAge: 3600}); // path to be accessible on every pages

        }

        if ( process.env.ACTIVE_PROFIL === "dev" ) {
            res.cookie("zg-access-token", accessToken, { httpOnly: true, secure:false, maxAge: 3600}); // path to be accessible on every pages
            res.cookie("zg-access-token-provider", "google", { httpOnly: true, secure:false, maxAge: 3600}); // path to be accessible on every pages
        }
        */

        // TODO : 
        // render with access token + JWT token (for role) as encrypted data in url
        // TODO create user with respUserInfo
        // Attribute right role (attached to role permissions)
        // generate JWT with claims for info (send to client)



        /// TODO 
        // - create table user pour info OAUTH2 => one user has many roles
        // - create table role => has many permissions (table permission todo)
        // - If user for OAUTH2 infos not exist, create him else do nothing


        let tokenClient = jwt.sign(respUserInfo, process.env.JWT_CLIENT_TOKEN_SECRET, {
            expiresIn: '24h'
        });
        res.redirect(process.env.OAUTH_REDIRECT_SUCCESS_CLIENT + "/auth/redirect?tok="+tokenClient)

        // If user is logged, by default relation to role USER 
        // but can change his role ? (do not required JWT in this case)


          /*
    res.status(200)
        .json({
            "email":respUserInfo["email"],
            "picture": respUserInfo["picture"],
            "message": `Connected with ${respUserInfo["email"]}`
        })*/


        /*
        Response when token is expired 
        {
        error: "invalid_token",
        error_description: "Invalid Value"
        }
        */


});



/**
 * Startup
 */
app.listen(config.PORT, async () => {
    try {
        await sequelize.authenticate();

        console.log('database connection has been established successfully.');

        // Sync models : 
        
        if ( process.env.ACTIVE_PROFIL === "dev" ) {
            models.map( async model => {
                await model.sync({ alter: true });
            });

            let roles = Object.keys(permissions);

            roles.map ( async role => {
                const roleExist = await Roles.findOne({
                    where:  {
                        name: role
                    },
                });
                if ( roleExist === null ) {
                    let newRole = Roles.build({
                        name: role
                    });
                    const newRoleData = await newRole.save();

                    // Insert linked permissions to the role
                    
                    permissions[role].map( async linkedPerm => {
                        const permExist = await Permissions.findOne({
                            where:  {
                                name: linkedPerm
                            },
                        });

                        
                        if ( permExist === null ) {
                            let newPerm = Permissions.build({
                                name: linkedPerm,
                                roleId: newRoleData.dataValues.id
                            });
                            await newPerm.save();
                        }
                    })


                }

            })




        } else {
            // todo sync model without alter 
        }

    } catch  ( e )  {
        console.log("DB connection failed : " + e)
    }
})