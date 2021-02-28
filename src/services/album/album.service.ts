'use strict';

import {NextFunction, Request, Response} from "express";
import {Users} from "../../db/models/users.model";
import {Albums} from "../../db/models/albums.model";
import { v4 as uuidv4 } from 'uuid';
import {Op} from "sequelize";

export const albumsService = {
    createAlbum : async (req:Request, res:Response, next: NextFunction) => {
        const {displayName} = req.body;

        const {decodedToken} = req;
        const {id} = decodedToken;

        const user = await Users.findByPk(id);

        const existingAlbumSameName = await Albums.findAll({
            where: {
                displayName: {
                    [Op.like]: `%${displayName}%`
                }
            }
        });

        let overrideNameForDuplicate = existingAlbumSameName.length > 0 ? `${displayName} (${existingAlbumSameName.length})` : null;


        const newAlbum = Albums.build({
            uuid: uuidv4(),
            displayName: overrideNameForDuplicate === null ? displayName : overrideNameForDuplicate,
            userId: user.dataValues.id});
        const respSave = await newAlbum.save();

        res.status(200).json({"message": respSave, "status": 200});
    }
}