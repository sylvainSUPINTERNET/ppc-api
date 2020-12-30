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
const corsOptions = {
    origin: "*",//'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(cookieParser());

/**
 * HTTP logger
 */
const morgan = require('morgan');
app.use(morgan('combined'));



/**
 * Resources
 */
app.use(getResourcePath('auth'), authRouter);


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
    console.log("access token : " + accessToken)
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


    res.status(200)
        .json({
            "email":respUserInfo["email"],
            "picture": respUserInfo["picture"],
            "message": `Connected with ${respUserInfo["email"]}`
        })
});



/**
 * Startup
 */
app.listen(config.PORT, async () => {
    // TODO db connection ici
})