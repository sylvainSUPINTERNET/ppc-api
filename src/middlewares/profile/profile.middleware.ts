'use strict';
import { v4 as uuidv4 } from 'uuid';
import { profileService } from "../../services/profile/profile.service";

import {Request, Response, NextFunction} from 'express';
import IProfile from "../../dto/IProfile";
import {Albums} from "../../db/models/albums.model";
import {Profiles} from "../../db/models/profiles.model";
import {Users} from "../../db/models/users.model";

export const profileMiddleware = {
    create : async (req:Request, res:Response, next: NextFunction) => {

        const {id} = req.decodedToken;
        let userToAttach = await Users.findByPk(id)

        let newProfileData: IProfile = {
            cityName: req.body.city,
            countryName: req.body.country,
            username: req.body.username,
            uuid: uuidv4(),
            gender: req.body.gender,
            relationKind: req.body.relationKind,
            hobbiesListAsString: req.body.hobbies, // array is stringify
            active: true,
            userId: userToAttach.dataValues.id
        }

        let newProfile = await profileService.createProfile(newProfileData);

        res.status(200).json({
            "profile": newProfile,
            "message":"Profile added with success"
        })
    },
    getProfiles : async (req:Request, res:Response, next: NextFunction) => {
        res.status(200).json({
            "profiles": await Profiles.findAll({
                include: [{
                    model: Users
                    //where: { userId: Sequelize.col('user.id') }
                }]
            }),
        })
    }
}

