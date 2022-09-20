
import User from "./user";

export default class Room{
    users: User[] = [];
    modified: Date = new Date();
    coffeBreak: Map<string, boolean> = new Map([]);
    buzzer: Map<string, boolean> = new Map([]);
    currentVotes: Map<string, string> = new Map([]);
    state: States = States.STARTING;
    currentPoints: number = 0;
    callback: RoomStateChanged;


    constructor(private id: string, roomOptions: RoomOptions, callback: RoomStateChanged) {
        this.callback = callback;
    }

    addUser(user: User){
        this.users.push(user);
        this.callback(this)
    }
    
    removeUser(userId: string){
        this.users = this.users.filter(u => u.getId());
        //TODO : close room when users is empty or no more scrum master
        this.callback(this);
    }
    
    registerVote(userId: string, vote: string){
        this.currentVotes.set(userId, vote);
        //TODO : if everyone has voted, send event ?
        this.callback(this);
    }
    
    cofeeBreakVote(userId: string){
        const currentVote = this.coffeBreak.get(userId) ? this.coffeBreak.get(userId) : false
        this.coffeBreak.set(userId, !currentVote);
        this.callback(this);
    }

    buzzBreakVote(userId: string){
        const currentVote = this.buzzer.get(userId) ? this.buzzer.get(userId) : false
        this.buzzer.set(userId, !currentVote);
        this.callback(this);
    }

    startVoting() {
        this.state = States.VOTING;
        this.callback(this);
    }
    revealVotes() {
        this.state = States.VOTED;
        this.callback(this);
    }

    getCurrentVoteByUser(userId: string): string | undefined{
        return this.currentVotes.get(userId);
    }

}

export enum States{
    STARTING,
    VOTING,
    VOTED,
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

export interface RoomStateChanged{
    (room: Room): void;
}