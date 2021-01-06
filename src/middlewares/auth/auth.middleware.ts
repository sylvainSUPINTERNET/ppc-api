'use strict';

import { Users } from '../../db/models/users.model';
import {Request, Response, NextFunction} from 'express';
import { Roles } from '../../db/models/roles.model';
import { Permissions } from '../../db/models/permissions.model';
const jwt = require('jsonwebtoken');

// USELESS ?
export const authMiddleware = {

    isAuthenticated : async (req:Request, res:Response, next: NextFunction) => {
        let authHeader = req.headers.authorization;
        if ( !authHeader ) {
            res.status(403).json({
                "message": "Not authenticated"
            });
        } else {
            try {
                let token = authHeader.split(" ")[1];
                let decoded = jwt.verify(token,  process.env.JWT_CLIENT_TOKEN_SECRET);
                req.decodedToken = decoded;
                next();
              } catch(err) {
                res.status(403).json({
                    message: err
                })
              }
        }

    },
    isAuthorized: (permissioArray) => {
        return async (req:Request, res:Response, next: NextFunction) => {
            const { name, given_name, family_name, email, locale } = req.decodedToken;

            const user = await Users.findOne({
                where:  {
                    fullName: name,
                    lastName: family_name,
                    firstName: given_name,
                    email: email,
                    locale: locale
                },
                include: [
                    {
                        model: Roles,
                        as: "role"
                    }
                ]
            });
      
            if ( user  === null ) {
                res.status(403).json({
                    "message": "Not authenticated successfully"
                })
            } else {
                const { id } = user.role;

                const permissions = await Permissions.findAll({
                    where:  {
                        roleId: id
                    }
                });
                if ( permissions === null ) {
                    res.status(401).json({
                        message: "Unauthorized permission"
                    })
                } else {
                    console.log(permissioArray);
                    let isAllowed = permissions.filter(pf => {
                        return permissioArray.indexOf(pf.name) >= 0
                    }).length > 0 ? true: false;

           
                    if ( isAllowed === true ) {
                        next()
                    } else {
                        res.status(401).json({
                            "message": "Permission not allow you to access this resource."
                        })
                    }

                }
            }
                    
        }
    }
}

