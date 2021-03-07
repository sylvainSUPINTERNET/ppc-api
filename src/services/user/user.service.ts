'use strict';

import {Users} from "../../db/models/users.model";
import {NextFunction,Response,Request} from "express";
const jwt = require('jsonwebtoken');

export const userService = {
    getUsers: async (req:Request, res:Response, next: NextFunction) => {
        const {authorization} = req.headers;

        let users = await Users.findAll();
        if ( users ) {
            res.status(200).json(users);
        } else {
            res.status(400).json({
                "message":"Error is occured while getting user list"
            })
        }
    },
    getUserByEmailWithToken: async (req:Request, res:Response, next: NextFunction) => {
        console.log(req.headers);
        const {authorization} = req.headers;
        if ( authorization.split(" ")[1] ) {

            let decoded = jwt.verify(authorization.split(" ")[1],  process.env.JWT_CLIENT_TOKEN_SECRET);

            if ( decoded ) {
                let user = await Users.findOne({
                    where:  {
                        email: decoded.email
                    },
                });
                res.status(200).json({
                    data: user,
                    message:" User detail"
                })
            } else {
                res.status(403).json({
                    message:"token not given"
                })
            }
        } else {
            res.status(403).json({
                message:"token not given"
            })
        }


    }
}