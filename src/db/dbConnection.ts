'use strict';

import {dbConfig} from "../config/config";

const { Sequelize } = require('sequelize');

class DbConnection {
    Sequelize;

    constructor() {
        this.Sequelize = new Sequelize(dbConfig.DB_NAME, dbConfig.USER, dbConfig.PASSWORD, {
            host: dbConfig.HOST,
            dialect: dbConfig.DIALECT,
            //logging: (...msg) => console.log(msg)
        })

    }
}

export const sequelize = new DbConnection().Sequelize
