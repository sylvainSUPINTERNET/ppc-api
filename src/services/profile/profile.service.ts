'use strict';

import IProfile from "../../dto/IProfile";
import {Profiles} from "../../db/models/profiles.model";

export const profileService = {
    createProfile: async (newProfile: IProfile) => {
        console.log("CREATE THE PROFILE");
        console.log(newProfile);
        const profile = Profiles.build({
            city: newProfile.cityName,
            username: newProfile.username,
            uuid: newProfile.uuid,
            country: newProfile.countryName,
            gender: newProfile.gender,
            relationKind: newProfile.relationKind,
            hobbies: newProfile.hobbiesListAsString,
            active: newProfile.active
        });
        console.log(profile);
        return await profile.save();
    }
}