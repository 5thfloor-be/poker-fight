
import User from "./user";
import UserVote from './userVote';

export default class Room {
    users: User[] = [];
    modified: Date = new Date();
    coffeeBreak: Map<string, boolean> = new Map();
    buzzer: Map<string, boolean> = new Map();
    // currentVotes: Map<string, string> = new Map();
    currentVotes: UserVote[] = [];
    wondrousVote: number = -1;
    state: States = States.STARTING;
    currentPoints: number = 0;
    roomOptions: RoomOptions
    onChangeCallbacks: OnChangeCallback[] = [];
    coffeeBreakActive = false;
    buzzerActive = false;


    constructor(public id: string, roomOptions: RoomOptions) {
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

    registerVote(userId: string, vote: number){
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

    coffeeBreakVote(userId: string){
        const currentVote = this.coffeeBreak.get(userId) ? this.coffeeBreak.get(userId) : false
        this.coffeeBreak.set(userId, !currentVote);
        let totalVotes = 0
        this.coffeeBreak.forEach((v, k) =>{
            totalVotes += v?1:0;
        });

        this.coffeeBreakActive = totalVotes> (Math.trunc(this.users.length/2));
        this.stateUpdated();
    }

    coffeeBreakOver(){
        this.coffeeBreak.clear();
        this.coffeeBreakActive = false;
        this.stateUpdated();
    }

    buzzerVote(userId: string){
        const currentVote = this.buzzer.get(userId) ? this.buzzer.get(userId) : false
        this.buzzer.set(userId, !currentVote);
        this.stateUpdated();
        let totalVotes = 0
        this.buzzer.forEach((v, k) =>{
            totalVotes += v?1:0;
        });

        this.buzzerActive = totalVotes> (Math.trunc(this.users.length/2));
        this.stateUpdated();
    }

    buzzerCanceled(){
        this.buzzer.clear();
        this.buzzerActive = false;
        this.stateUpdated();
    }

    startVoting() {
        this.state = States.VOTING;
        this.stateUpdated();
    }

    revealVotes() {
        let set: Set<number> = new Set(Object.values(this.currentVotes.filter(vote => vote.vote > -1 )).map(v => v.vote));
        console.log(this.currentVotes);
        console.log(set);
        if (set.size > 0) {
            if (set.size == 1) {
                this.state = States.WONDROUS;
                this.vote(set.values().next().value);
            } else {
                this.state = States.FIGHTING;
            }
        }
        this.buzzer.clear();
        this.buzzerActive = false;
        this.stateUpdated();
    }

    startFighting() {
        this.state = States.FIGHTING;
        this.stateUpdated();
    }

    resetCurrentVotes() {
        this.currentVotes = [];
        this.wondrousVote = -1;
    }

    getCurrentVoteByUser(userId: string): number | undefined {
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

    vote(vote: number) {
        this.wondrousVote = vote;
    }

    forceVote(vote: number) {
        this.vote(vote);
        this.state = States.WONDROUS;
    }

    applyFinalVote(vote: number){
        this.currentPoints += vote;
        this.state = States.STARTING;
        this.currentVotes.forEach(vote => vote.vote = 0);
        this.stateUpdated();
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
