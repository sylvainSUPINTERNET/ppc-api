'use strict';

import {sequelize} from "../../db/DbConnection";
import { Roles } from "./roles.model";
const { DataTypes } = require('sequelize');

export const Permissions = sequelize.define('permissions', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    // Other model options go here
    timestamps: true
});


Permissions.hasMany(Roles, { as: "roles"});
