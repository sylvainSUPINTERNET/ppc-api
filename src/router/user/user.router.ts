'use strict';
import * as express from 'express';

import {userService} from "../../services/user/user.service";

const userRouter = express.Router();

userRouter.get('/token-email', userService.getUserByEmailWithToken);

export default userRouter;
