'use strict';
import { v4 as uuidv4 } from 'uuid';
import { profileService } from "../../services/profile/profile.service";

import {Request, Response, NextFunction} from 'express';
import IProfile from "../../dto/IProfile";

export const profileMiddleware = {
    create : async (req:Request, res:Response, next: NextFunction) => {
        // TODO here call the service

        let newProfileMock: IProfile = {
            cityName: "Paris",
            countryName: "France",
            username: "Patrick",
            uuid: uuidv4(),
            gender: 'h',
            relationKind: 'friendly',
            hobbiesListAsString: 'promenade,course,pêche',
            active: true
        }
        let test = await profileService.createProfile(newProfileMock);

        res.status(200).json({
            "profile": test,
            "message":" W I P "
        })
    }
}

