export default class User {

    canVote: boolean;
    constructor(
        private id: string, 
        info: UserInfo
    ) {
        this.canVote = info.role == Role.DEV || info.role == Role.VOTING_SCRUM_MASTER

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