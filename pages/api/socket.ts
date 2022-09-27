import {IncomingMessage, ServerResponse} from "http";
import {v4 as uuid} from 'uuid';
import {Server} from 'socket.io'
import Room from './model/room';
import User, {Role} from './model/user';

const rooms: Map<string, Room> = new Map();

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

function configIO(io: Server) {
    io.on("connection", (socket) => {
        console.log(`User connected ${socket.id}`);

        socket.on("join_room", (data, listener) => {
            console.log(`${socket.id} is joining ${data}`)
            console.log(`${socket.id} is joining ${data.userInfo}`)
            console.log(`${socket.id} is joining ${socket.id}`)
            socket.join(data.roomId)
            const user = {...data.userInfo, id: uuid()};
            rooms.get(data.roomId)?.addUser(user);

            listener(user.id);
        })

        socket.on("leave_room", (data) => {
            console.log(`${socket.id} is leaving ${data}`)
            socket.leave(data.roomId);
            rooms.get(data.roomId)?.removeUser(socket.id);
        })

        socket.on("create_room", (data, listener) => {
            console.log(`Creating room with data `, data)
            const roomId = uuid();
            const room = new Room(roomId, data?.roomOptions);
            room.registerOnChangeCallback((room: Room) => {
                console.log(`room state update sent${JSON.stringify(room)}`)
                io.to(roomId).emit('room_state_update', room);
            })
            rooms.set(roomId, room);
            listener({roomId: roomId});
        })

        socket.on("vote", (data, listener) => {
            console.log("AAAAAAAAAAAAAAAA");
            console.log(`register vot e ${JSON.stringify(data)}`);
            if (data.vote !== -1) {
                rooms.get(data.roomId)?.registerVote(data.userId, data.vote);
                console.log("register vot e", rooms.get(data.roomId));

                listener(rooms.get(data.roomId));
            }
        })

        socket.on("reveal", data => {
            console.log(`reveal from scrum master ${JSON.stringify(data)}`);
            const room = rooms.get(data.roomId);
            if (!!room) {
                let votes = room.currentVotes.map(userVote => userVote.vote).filter(vote => vote > -1);
                if (votes.length > 0) {
                    const wondrous = votes.every(vote => vote === votes[0]);
                    const vote = votes.pop();
                    if (wondrous && !!vote) {
                        room.vote(vote);
                        rooms.get(data.roomId)?.revealVotes();
                    } else {
                        rooms.get(data.roomId)?.startFighting();
                    }
                }

                socket.to(data.roomId).emit('reveal', rooms.get(data.roomId));
            }
        })

        socket.on("redo_vote", data => {
            console.log(`redo vote from scrum master ${JSON.stringify(data)}`);
            let room = rooms.get(data.roomId);

            room?.resetCurrentVotes();
            room?.startVoting();

            io.in(data.roomId).emit('start-voting', rooms.get(data.roomId));
        });

        socket.on("cofee-break-vote", data => {
            console.log(`cofee-break-vote ${JSON.stringify(data)}`);
            rooms.get(data.roomId)?.cofeeBreakVote(data.userId);
        })

        socket.on("buzz-break-vote", data => {
            console.log(`buzz-break-vote ${JSON.stringify(data)}`);
            rooms.get(data.roomId)?.buzzBreakVote(data.userId);
        })

        socket.on('start-voting', data => {
            console.log(`start-voting ${JSON.stringify(data)}`);
            rooms.get(data.roomId)?.startVoting();

            io.in(data.roomId).emit('start-voting', rooms.get(data.roomId));
        });

        socket.on('get_room', (data, listener) => {
            console.log(`get_room ${data.roomId}`);
            const room = rooms.get(data.roomId);
            console.log(`room : ${JSON.stringify(room)}`)
            listener(room);
        })

    })
}

export default SocketHandler;
