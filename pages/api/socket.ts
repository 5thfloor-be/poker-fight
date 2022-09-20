import {IncomingMessage, ServerResponse} from "http";
import {v4 as uuid} from 'uuid';
import {Server} from 'socket.io'
import Room from './model/room';
import User, {Role} from './model/user';

const rooms : Map<string, Room> = new Map();

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
        console.log(`Current rooms ${JSON.stringify(rooms)}`);

        socket.on("join_room", (data) => {
            console.log(`${socket.id} is joining ${data}`)
            console.log(`${socket.id} is joining ${data.userInfo}`)
            console.log(`${socket.id} is joining ${socket.id}`)
            socket.join(data.roomId)
            rooms.get(data.roomId)?.addUser(new User(socket.id,data.userInfo));
        })

        socket.on("leave_room", (data) => {
            console.log(`${socket.id} is leaving ${data}`)
            socket.leave(data.roomId);
            rooms.get(data.roomId)?.removeUser(socket.id);
        })
        
        socket.on("create_room", (data, listener) =>{
            const roomId = uuid();
            const room = new Room(roomId, data?.roomOptions, (room: Room) =>{
                console.log(`room state update sent${JSON.stringify(room)}`)
                socket.to(roomId).emit('room_state_update', room);
            });
            rooms.set(roomId, room);
            listener(roomId);
        })

        socket.on("vote", data =>{
            console.log(`register vote ${JSON.stringify(data)}`);
            rooms.get(data.roomId)?.registerVote(data.userId, data.vote);
        })

        socket.on("reveal", data =>{
            console.log(`reveal from scrum master ${JSON.stringify(data)}`);
            rooms.get(data.roomId)?.revealVotes();
            
            socket.to(data.roomId).emit('reveal', rooms.get(data.roomId));
        })

        socket.on("cofee-break-vote", data =>{
            console.log(`cofee-break-vote ${JSON.stringify(data)}`);
            rooms.get(data.roomId)?.cofeeBreakVote(data.userId);
        })

        socket.on("buzz-break-vote", data =>{
            console.log(`buzz-break-vote ${JSON.stringify(data)}`);
            rooms.get(data.roomId)?.buzzBreakVote(data.userId);
        })
        
        socket.on('start-voting', data => {
            console.log(`start-voting ${JSON.stringify(data)}`);
            rooms.get(data.roomId)?.startVoting();
            
            io.in(data.roomId).emit('start-voting', rooms.get(data.roomId));
        });

    })
}

export default SocketHandler;
