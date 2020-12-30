'use strict';

import {config, getResourcePath} from './config/config';
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


import app from './server/Application';
import authRouter from "./router/auth/auth";

const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:3000',
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



/**
 * Startup
 */
app.listen(config.PORT, async () => {
    // TODO db connection ici
})