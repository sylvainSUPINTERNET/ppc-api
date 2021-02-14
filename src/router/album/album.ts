'use strict';
import * as express from 'express';
import {albumsService} from "../../services/album/album.service";
import {authMiddleware} from "../../middlewares/auth/auth.middleware";

const albumRouter = express.Router();

albumRouter.post('/',
    authMiddleware.isAuthenticated,
    authMiddleware.isAuthorized(["ALBUM_CREATE"], true),
    albumsService.createAlbum);

export default albumRouter;
