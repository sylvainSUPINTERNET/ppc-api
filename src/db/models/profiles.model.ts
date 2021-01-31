'use strict';

import {sequelize} from "../../db/DbConnection";
import {Sequelize} from "sequelize";
import {Users} from "./users.model";

const { DataTypes } = require('sequelize');

export const Profiles = sequelize.define('profiles', {
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    uuid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sexe: {
        type: DataTypes.STRING,
        allowNull: false
    },
    relationKind: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hobbies: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}, {
    // Other model options go here
    timestamps: true
});


