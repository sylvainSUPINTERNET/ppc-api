'use strict';

import {sequelize} from "../../db/DbConnection";
import { Users } from "./users.model";
import { Permissions } from "./permissions.model";

const { DataTypes } = require('sequelize');

export const Roles = sequelize.define('roles', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    // Other model options go here
    timestamps: true
});





Roles.hasMany(Permissions, { as: "permissions"});
Roles.hasMany(Users, { as: "users"});