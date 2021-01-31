'use strict';

import IProfile from "../../dto/IProfile";

export const profileService = {
    createProfile: (newProfile: IProfile) => {
        return new Promise( (resolve, reject) => {
            resolve(newProfile);
        });
    }
}