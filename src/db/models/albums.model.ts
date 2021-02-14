'use strict';

import {sequelize} from "../../db/DbConnection";
import {Sequelize} from "sequelize";
import {Users} from "./users.model";
import {Roles} from "./roles.model";
import {Profiles} from "./profiles.model";

const { DataTypes } = require('sequelize');

export const Albums = sequelize.define('albums', {
    uuid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    displayName: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    // Other model options go here
    timestamps: true
});

Albums.belongsTo(Users);

