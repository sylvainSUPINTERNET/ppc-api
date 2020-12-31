'use strict';

import {Request, Response, NextFunction} from 'express';

export const accessManager = {
    register : (req:Request, res:Response, next: NextFunction) => {
        res.status(200).json({
            "message": "register"
        })
    }
}

