export default class User {

    constructor(
        private id: string, 
        info: UserInfo, 
        canVote = true) {
    }
}

export interface UserInfo {
    name: string;
    color: string;
}