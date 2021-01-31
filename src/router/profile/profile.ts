'use strict';
import * as express from 'express';
import {profileMiddleware} from "../../middlewares/profile/profile.middleware";

const profileRouter = express.Router();

profileRouter.post('/', profileMiddleware.create);

export default profileRouter;
