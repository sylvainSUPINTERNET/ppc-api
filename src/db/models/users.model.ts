'use strict';

import {sequelize} from "../../db/DbConnection";
import {Sequelize} from "sequelize";
import {Profiles} from "./profiles.model";

const { DataTypes } = require('sequelize');

export const Users = sequelize.define('users', {
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    uuid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pictureLink: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    locale: { // e.g 'fr' (for Google profile scope OAUTH2)
        type: DataTypes.STRING,
        allowNull: true
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
        },
    provider: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    // Other model options go here
    timestamps: true
});


