'use strict';
import * as express from 'express';
import {authMiddleware} from "../../middlewares/auth/auth.middleware";

const authRouter = express.Router();

//mapRouter.get('/vectorize/:positionA;:positionB', Authorization.checkAuthorization("TEST"), mapService.getWayPoints, mapService.vectorizePolyline);
/*
authRouter.get('/register', authMiddleware.register);
authRouter.get('/login', authMiddleware.login);
 */

export default authRouter;
