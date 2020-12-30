'use strict';

// Doc implementation : https://www.grafikart.fr/tutoriels/oauth2-php-google-1171

// Google :
// https://developers.google.com/identity/protocols/oauth2
// Google doc https://developers.google.com/identity/protocols/oauth2/openid-connect#discovery


export const OauthProvider = {
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        secretId: process.env.GOOGLE_CLIENT_SECRET,
        openIdConfiguration: process.env.GOOGLE_OPENID_CONFIGURATION_URL
    }
}
