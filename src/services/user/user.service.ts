'use strict';

import {Users} from "../../db/models/users.model";
import {NextFunction,Response,Request} from "express";

export const userService = {
    getUserByEmailWithToken: async (req:Request, res:Response, next: NextFunction) => {
        console.log(req.headers);
        const {authorization} = req.headers;
        if ( authorization.split(" ")[1] ) {

            let user = await Users.findOne({
                where:  {
                    email: req.query.email
                },
            });
        } else {
            res.status(403).json({
                message:"token not given"
            })
        }


    }
}