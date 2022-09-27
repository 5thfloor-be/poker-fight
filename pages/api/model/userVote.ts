export default class UserVote {

    userId: string;
    vote: string;

    constructor(
        userId: string,
        vote: string
    ) {
        this.userId = userId;
        this.vote = vote;
    }

    setVote(vote: string) {
        this.vote = vote;
    }
}
