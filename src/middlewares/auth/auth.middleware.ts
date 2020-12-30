'use strict';

import {Request, Response, NextFunction} from 'express';


export const authMiddleware = {
    register : (req:Request, res:Response, next: NextFunction) => {
        res.status(200).json({
            "message": "register"
        })
    },
    login: (req:Request, res:Response, next:NextFunction) => {
        res.status(200).json({
            "message": "login"
        })
    }
}

