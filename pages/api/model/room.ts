import User, { Role } from "./user";
import UserVote from "./userVote";

const MAX_VOTERS = 10;

export default class Room {
  users: User[] = [];
  modified: Date = new Date();
  coffeeBreak: string[] = [];
  buzzer: string[] = [];
  // currentVotes: Map<string, string> = new Map();
  currentVotes: UserVote[] = [];
  wondrousVote: number = -1;
  state: States = States.STARTING;
  currentPoints: number = 0;
  roomOptions: RoomOptions;
  onChangeCallbacks: OnChangeCallback[] = [];
  coffeeBreakActive = false;
  buzzerActive = false;
  scoreGoalActive = true;

  constructor(public id: string, roomOptions: RoomOptions) {
    this.roomOptions = roomOptions;
  }

  addUser(user: User) {
    this.users.push(user);
    this.stateUpdated();
  }

  removeUser(userId: string) {
    this.users = this.users.filter((u) => {
      console.debug(`u.id !== userId  `, u.id !== userId);
      return u.id !== userId;
    });
    console.debug("users :", this.users);
    //TODO : close room when users is empty or no more scrum master
    this.stateUpdated();
  }

  registerVote(userId: string, vote: number) {
    if (!this.isUserInRoom(userId)) {
      return;
    }
    console.debug("registerVote - user id : ", userId);
    console.debug("registerVote - vote : ", vote);
    if (
      this.currentVotes.filter((userVote) => userVote.userId === userId)
        .length === 0
    ) {
      this.currentVotes.push(new UserVote(userId, vote));
    } else {
      this.currentVotes
        .filter((userVote) => userVote.userId === userId)
        .map((userVote) => userVote.setVote(vote));
    }
    // this.currentVotes.set(userId, vote);
    //TODO : if everyone has voted, send event ?
    this.stateUpdated();
  }

  isUserInRoom(userId: string): boolean {
    return this.users.filter((u) => u.id === userId).length !== 0;
  }

  allUsersVoted() {
    console.debug("votes", this.currentVotes);
    console.debug("users", this.users);
    return (
      this.users.filter(
        (user) => user.role != Role.SCRUM_MASTER && user.role != Role.SPECTATOR
      ).length === this.currentVotes.length
    );
  }

  getActiveParticipants(): User[] {
    return this.users.filter((u) => u.role !== Role.SPECTATOR);
  }

  coffeeBreakVote(userId: string) {
    if (!this.isUserInRoom(userId)) {
      return;
    }
    const currentVote = !!this.coffeeBreak.find((u) => u === userId);
    if (currentVote) {
      this.coffeeBreak = this.coffeeBreak.filter((u) => u !== userId);
    } else {
      this.coffeeBreak.push(userId);
    }

    this.coffeeBreakActive =
      this.coffeeBreak.length >
      Math.trunc(this.getActiveParticipants().length / 2);
    this.stateUpdated();
  }

  coffeeBreakOver() {
    this.coffeeBreak = [];
    this.coffeeBreakActive = false;
    this.stateUpdated();
  }

  scoreGoalOver() {
    this.scoreGoalActive = false;
    this.stateUpdated();
  }

  buzzerVote(userId: string) {
    if (!this.isUserInRoom(userId)) {
      return;
    }
    const currentVote = !!this.buzzer.find((u) => u === userId);
    if (currentVote) {
      this.buzzer = this.buzzer.filter((u) => u !== userId);
    } else {
      this.buzzer.push(userId);
    }

    this.buzzerActive =
      this.buzzer.length > Math.trunc(this.getActiveParticipants().length / 2);
    this.stateUpdated();
  }

  buzzerCanceled() {
    this.buzzer = [];
    this.buzzerActive = false;
    this.stateUpdated();
  }

  startVoting() {
    this.state = States.VOTING;
    this.stateUpdated();
  }

  revealVotes() {
    let set: Set<number> = new Set(
      Object.values(this.currentVotes.filter((vote) => vote.vote > -1)).map(
        (v) => v.vote
      )
    );
    console.debug(this.currentVotes);
    console.debug(set);
    if (set.size > 0) {
      if (set.size == 1) {
        this.state = States.WONDROUS;
        this.vote(set.values().next().value);
      } else {
        this.state = States.FIGHTING;
      }
    }
    this.buzzer = [];
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
    return this.currentVotes
      .filter((userVote) => userVote.userId === userId)
      .at(0)?.vote;
  }

  private stateUpdated() {
    this.modified = new Date();
    this.onChangeCallbacks.forEach((callback) => {
      console.debug("callback invoked");
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

  applyFinalVote(vote: number) {
    this.currentPoints += vote;
    this.state = States.STARTING;
    this.resetCurrentVotes();
    this.stateUpdated();
  }

  isFull() {
    return (
      this.users.filter(
        (u) => u.role === Role.DEV || u.role === Role.VOTING_SCRUM_MASTER
      ).length >= MAX_VOTERS
    );
  }
}

export enum States {
  STARTING,
  VOTING,
  WONDROUS,
  FIGHTING,
  BREAK,
  BUZZ,
}

export interface RoomOptions {
  targetPoints: number;
  cardValues: number[];
  coffeeBreakAllowed: boolean;
  buzzerAllowed: boolean;
  revealTimer: number;
}

export interface OnChangeCallback {
  (room: Room): void;
}
