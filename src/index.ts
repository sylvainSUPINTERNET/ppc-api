'use strict';

require('dotenv').config();

import {OauthProvider} from "./config/oauthConfig";


import {config, getResourcePath} from './config/config';
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');


import app from './server/Application';
import authRouter from "./router/auth/auth";

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



app.get('/test', (req,res,next) => {
    console.log("COOKIES ? " , req.cookies);
    res.status(200).json({
        "message":"salut"
    })
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


        if ( process.env.ACTIVE_PROFIL === "prod") {
            // for secure need HTTPs
            res.cookie("zg-access-token", accessToken, { httpOnly: true, secure:false, maxAge: 3600}); // path to be accessible on every pages
            res.cookie("zg-access-token-provider", "google", { httpOnly: true, secure:false, maxAge: 3600}); // path to be accessible on every pages

        }

        if ( process.env.ACTIVE_PROFIL === "dev" ) {
            res.cookie("zg-access-token", accessToken, { httpOnly: true, secure:false, maxAge: 3600}); // path to be accessible on every pages
            res.cookie("zg-access-token-provider", "google", { httpOnly: true, secure:false, maxAge: 3600}); // path to be accessible on every pages
        }

        
        res.redirect( process.env.OAUTH_REDIRECT_SUCCESS_CLIENT)


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
    // TODO db connection ici
})