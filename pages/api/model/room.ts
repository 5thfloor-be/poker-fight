
import User from "./user";
import UserVote from './userVote';

export default class Room {
    users: User[] = [];
    modified: Date = new Date();
    coffeBreak: Map<string, boolean> = new Map();
    buzzer: Map<string, boolean> = new Map();
    // currentVotes: Map<string, string> = new Map();
    currentVotes: UserVote[] = [];
    state: States = States.STARTING;
    currentPoints: number = 0;
    roomOptions: RoomOptions
    onChangeCallbacks: OnChangeCallback[] = [];


    constructor(private id: string, roomOptions: RoomOptions) {
        this.roomOptions = roomOptions;
    }

    addUser(user: User){
        this.users.push(user);
        this.stateUpdated()
    }

    removeUser(userId: string){
        this.users = this.users.filter(u => u.id);
        //TODO : close room when users is empty or no more scrum master
        this.stateUpdated();
    }

    registerVote(userId: string, vote: string){
        console.log('registerVote - user id : ', userId);
        console.log('registerVote - vote : ', vote);
        if (this.currentVotes.filter(userVote => userVote.userId === userId).length === 0) {
            this.currentVotes.push(new UserVote(userId, vote));
        } else {
            this.currentVotes.filter(userVote => userVote.userId === userId).map(userVote => userVote.setVote(vote));
        }
        // this.currentVotes.set(userId, vote);
        //TODO : if everyone has voted, send event ?
        this.stateUpdated();
    }

    cofeeBreakVote(userId: string){
        const currentVote = this.coffeBreak.get(userId) ? this.coffeBreak.get(userId) : false
        this.coffeBreak.set(userId, !currentVote);
        this.stateUpdated();
    }

    buzzBreakVote(userId: string){
        const currentVote = this.buzzerAllowed.get(userId) ? this.buzzerAllowed.get(userId) : false
        this.buzzerAllowed.set(userId, !currentVote);
        this.stateUpdated();
    }

    startVoting() {
        this.state = States.VOTING;
        this.stateUpdated();
    }

    revealVotes() {
        let set: Set<string> = new Set(Object.values(this.currentVotes.filter(vote => vote.vote !== "-1" )).map(v => v.vote));
        console.log(this.currentVotes);
        console.log(set);
        if (set.size > 0) {
            if (set.size == 1) {
                this.state = States.WONDROUS;
            } else {
                this.state = States.FIGHTING;
            }
        }
        this.stateUpdated();
    }

    resetCurrentVotes() {
        this.currentVotes = [];
    }

    getCurrentVoteByUser(userId: string): string | undefined{
        return this.currentVotes.filter(userVote => userVote.userId === userId).at(0)?.vote;
    }

    private stateUpdated(){
        this.onChangeCallbacks.forEach(callback => {
            console.log('callback invoked')
            callback(this);
        });
    }

    registerOnChangeCallback(callback: OnChangeCallback) {
        this.onChangeCallbacks.push(callback);
    }

}

export enum States{
    STARTING,
    VOTING,
    WONDROUS,
    FIGHTING,
    BREAK,
    BUZZ
}

export interface RoomOptions{
    targetPoints: number;
    cardValues : number[];
    coffeeBreakAllowed: boolean;
    buzzerAllowed: boolean;
    revealTimer: number;
}

export interface OnChangeCallback{
    (room: Room): void;
}
