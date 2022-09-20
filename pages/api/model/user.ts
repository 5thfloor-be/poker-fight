export default class User {

    canVote: boolean;
    userInfo: UserInfo;

    constructor(
        private id: string, 
        info: UserInfo
    ) {
        this.canVote = info?.role == Role.DEV || info?.role == Role.VOTING_SCRUM_MASTER
        this.userInfo = info;
    }

    getId(): string{
        return this.id;
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