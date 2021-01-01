'use strict';

import {Permissions} from "./permissions.model";
import { Roles } from './roles.model';
import {Users} from './users.model';

const models = [
    Users,
    Permissions,
    Roles
]

export default models;