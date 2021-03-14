'use strict';

import IProfile from "../../dto/IProfile";
import {Profiles} from "../../db/models/profiles.model";

export const profileService = {
    createProfile: async (newProfile: IProfile) => {
        const profile = Profiles.build({
            city: newProfile.cityName,
            username: newProfile.username,
            uuid: newProfile.uuid,
            country: newProfile.countryName,
            gender: newProfile.gender,
            relationKind: newProfile.relationKind,
            hobbies: newProfile.hobbiesListAsString,
            active: newProfile.active,
            userId: newProfile.userId
        });
        return await profile.save();
    }
}