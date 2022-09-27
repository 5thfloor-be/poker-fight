export default class User {

    userInfo: UserInfo;
    id?: string;
    canVote?: boolean;

    constructor(
        info: UserInfo,
        id?: string
    ) {
        this.canVote = info?.role == Role.DEV || info?.role == Role.VOTING_SCRUM_MASTER
        this.userInfo = info;
        this.id = id;
    }
}

export interface UserInfo {
    name: string;
    color: string;
    role: Role;
}

export enum Role {
    SCRUM_MASTER,
    VOTING_SCRUM_MASTER,
    DEV,
    SPECTATOR
}