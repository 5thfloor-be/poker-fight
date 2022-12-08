export default interface User extends UserInfo {
    id?: string;
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

export const isScrumMaster = (user: User)=> [Role.SCRUM_MASTER, Role.VOTING_SCRUM_MASTER].includes(user.role);

export const isVoter = (user: User)=> [Role.DEV, Role.VOTING_SCRUM_MASTER].includes(user.role);
