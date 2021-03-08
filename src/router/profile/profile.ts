'use strict';
import * as express from 'express';
import {profileMiddleware} from "../../middlewares/profile/profile.middleware";
import {authMiddleware} from "../../middlewares/auth/auth.middleware";

const profileRouter = express.Router();

profileRouter.post('/',authMiddleware.isAuthenticated, profileMiddleware.create);

export default profileRouter;
