'use strict';

import { profileService } from "../../services/profile/profile.service";

import {Request, Response, NextFunction} from 'express';

export const profileMiddleware = {
    create : async (req:Request, res:Response, next: NextFunction) => {
        // TODO here call the service
        let test = await profileService.createProfile();

        res.status(200).json({
            "profile": test
        })
    }
}

