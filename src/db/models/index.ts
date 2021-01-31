'use strict';

import { Permissions } from "./permissions.model";
import { Roles } from './roles.model';
import { Users} from './users.model';
import { Profiles } from "./profiles.model";

const models = [
    Users,
    Permissions,
    Roles,
    Profiles
]

export default models;