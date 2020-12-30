'use strict';

import * as express from "express";
import * as bodyParser from "body-parser";

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
    }

    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
}

const app = new App().app;


export default app;
