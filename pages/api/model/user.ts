export default interface User extends UserInfo {
    id?: string;
    canVote?: boolean;
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
