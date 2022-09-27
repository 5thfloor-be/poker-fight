export default class UserVote {

    userId: string;
    vote: number;

    constructor(
        userId: string,
        vote: number
    ) {
        this.userId = userId;
        this.vote = vote;
    }

    setVote(vote: number) {
        this.vote = vote;
    }
}
