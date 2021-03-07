'use strict';
import * as express from 'express';

import {userService} from "../../services/user/user.service";
import {authMiddleware} from "../../middlewares/auth/auth.middleware";

const userRouter = express.Router();

userRouter.get('/token-email', userService.getUserByEmailWithToken);
userRouter.get("/", authMiddleware.isAuthenticated, userService.getUsers)

export default userRouter;
