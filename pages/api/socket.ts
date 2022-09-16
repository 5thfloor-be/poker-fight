import type { NextApiRequest, NextApiResponse } from 'next'
import {IncomingMessage, ServerResponse} from "http";
import { v4 as uuid } from 'uuid';
import { Server } from 'Socket.IO'
import Room from './model/room';
import User from './model/user';

const SocketHandler = (req: IncomingMessage, res: ServerResponse) => {

    if (res?.socket?.server.io) {
        console.log('Socket is already running')
    } else {
        console.log('Socket is initializing')
        const io = new Server(res.socket?.server)
        configIO(io);
        res.socket.server.io = io
    }
    res.end()
}



function configIO(io: Server){
    io.on("connection", (socket) =>{
        console.log(`User connected ${socket.id}`);

        socket.on("join_room", (data) => {
            console.log(`${socket.id} is joining ${data}`)
            socket.join(data)
        })

        socket.on("leave_room", (data) => {
            console.log(`${socket.id} is leaving ${data}`)
            socket.leave(data);
        })
        
        socket.on("create_room", listener =>{
            const roomId = uuid();
            socket.join(roomId)
            const room = new Room(roomId);
            const user = new User(socket.id);
            room.addUser(user);
            listener(roomId);
        })
    })
}

function generateId(){
    const random = Math.random();
    const string = Number(random).toString(32).slice(2).toUpperCase();
    console.log(string);
    return string;
}

export default SocketHandler;