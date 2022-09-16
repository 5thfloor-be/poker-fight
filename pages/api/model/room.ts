import User from "./user";

export default class Room{
    users: User[] = [];

    constructor(private id: string) {

    }

    addUser(user: User){
        this.users.push(user);
    }

}