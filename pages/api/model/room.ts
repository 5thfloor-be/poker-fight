
import User from "./user";

export default class Room{
    users: User[] = [];
    modified: Date = new Date();
    coffeBreak: Map<string, boolean> = new Map([]);
    buzzer: Map<string, boolean> = new Map([]);
    currentVotes: Map<string, string> = new Map([]);
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
        this.users = this.users.filter(u => u.getId());
        //TODO : close room when users is empty or no more scrum master
        this.stateUpdated();
    }

    registerVote(userId: string, vote: string){
        this.currentVotes.set(userId, vote);
        //TODO : if everyone has voted, send event ?
        this.stateUpdated();
    }

    cofeeBreakVote(userId: string){
        const currentVote = this.coffeBreak.get(userId) ? this.coffeBreak.get(userId) : false
        this.coffeBreak.set(userId, !currentVote);
        this.stateUpdated();
    }

    buzzBreakVote(userId: string){
        const currentVote = this.buzzer.get(userId) ? this.buzzer.get(userId) : false
        this.buzzer.set(userId, !currentVote);
        this.stateUpdated();
    }

    startVoting() {
        this.state = States.VOTING;
        this.stateUpdated();
    }
    revealVotes() {
        this.state = States.VOTED;
        this.stateUpdated();
    }

    getCurrentVoteByUser(userId: string): string | undefined{
        return this.currentVotes.get(userId);
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

export interface OnChangeCallback{
    (room: Room): void;
}