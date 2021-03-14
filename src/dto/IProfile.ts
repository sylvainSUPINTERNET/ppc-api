'use strict';

export default interface IProfile {
    cityName: string;
    username: string;
    uuid: string;
    countryName: string;
    gender: string;
    relationKind: string;
    hobbiesListAsString: string;
    active: boolean;
    userId: number;
}