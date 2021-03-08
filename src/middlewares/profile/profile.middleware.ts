'use strict';
import { v4 as uuidv4 } from 'uuid';
import { profileService } from "../../services/profile/profile.service";

import {Request, Response, NextFunction} from 'express';
import IProfile from "../../dto/IProfile";
import {Albums} from "../../db/models/albums.model";
import {Profiles} from "../../db/models/profiles.model";

export const profileMiddleware = {
    create : async (req:Request, res:Response, next: NextFunction) => {
        console.log("PROFILE CREATION");
        console.log(req.body);
        let newProfileData: IProfile = {
            cityName: req.body.city,
            countryName: req.body.country,
            username: req.body.username,
            uuid: uuidv4(),
            gender: req.body.gender,
            relationKind: req.body.relationKind,
            hobbiesListAsString: req.body.hobbies, // array is stringify
            active: true
        }
        let newProfile = await profileService.createProfile(newProfileData);

        res.status(200).json({
            "profile": newProfile,
            "message":"Profile added with success"
        })
    }
}

