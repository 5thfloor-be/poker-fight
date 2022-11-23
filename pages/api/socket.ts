import { IncomingMessage } from "http";
import { v4 as uuid } from "uuid";
import { Server } from "socket.io";
import Room from "./model/room";
import User, {Role} from "./model/user";
import {ErrorCode} from "./model/ErrorCode";

const rooms: Map<string, Room> = new Map();

export interface JoinRoomReturn {
  id: string,
  error: number
}

const SocketHandler = (req: IncomingMessage, res: any) => {
  if (res?.socket?.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket?.server);
    configIO(io);
    res.socket.server.io = io;
  }
  res.end();
};

function configIO(io: Server) {
  io.on("connection", (socket) => {
    /* Supprimer une Room après un certain temps */
    setInterval(checkValidityRooms, 30 * 60 * 30);
    function checkValidityRooms() {
      const roomsToDelete = Array.from(rooms.values())
        .filter(
          (room) =>
            (new Date().getTime() - room.modified.getTime()) / 1000 > 8 * 3600
        )
        .map((room) => room.id);

      roomsToDelete.forEach((roomId) => {
        rooms.delete(roomId);

        socket.leave(roomId);
      });
    }

    console.log(`User connected to server ${socket.id}`);

    socket.on("join_room", (data, listener) => {
      let userIdTemp = data.userInfo.id;

      console.log(`${socket.id} is joining room ${data.roomId}`);
      socket.join(data.roomId);
      let room = rooms.get(data.roomId);
      if (  room?.users.filter((user) => user.id === data.userInfo.id).length === 0) {
        const user = { ...data.userInfo, id: uuid() };
        userIdTemp = user.id;
        if(room?.isFull() && user?.role === Role.DEV){
          listener({id: null, error: ErrorCode.TOO_MANY_VOTERS});
          return;
        }
        room?.addUser(user);
      }
      listener({id: userIdTemp, error: null});
    });

    socket.on('disconnect', function()
    {
      console.log("A client has disconnected.");
    });
    socket.on("remove_user", (data) => {
      console.log(`${data.userId} is removed `, data);
      rooms.get(data.roomId)?.removeUser(data.userId);
      io.to(data.roomId).emit('user_removed', {userId: data.userId});
    });

    socket.on("leave_room", (data) =>{
      socket.leave(data.roomId)
    })

    socket.on("create_room", (data, listener) => {
      console.log(`Creating room with data `, data);

      let roomIdTemp = Math.floor(Math.random() * 100000);

      while (
        !!rooms.get(roomIdTemp.toString()) ||
        roomIdTemp === 0 ||
        roomIdTemp < 10000
      ) {
        roomIdTemp = Math.floor(Math.random() * 100000);
      }

      const roomId = roomIdTemp.toString();

      const room = new Room(roomId, data);
      room.registerOnChangeCallback((room: Room) => {
        console.log(`room state update sent${JSON.stringify(room)}`);
        io.to(roomId).emit("room_state_update", room);
      });
      rooms.set(roomId, room);

      listener(room);
    });

    socket.on("vote", (data, listener) => {
      console.log(`register vot e ${JSON.stringify(data)}`);
      if (data.vote !== -1) {
        const room = rooms.get(data.roomId);
        room?.registerVote(data.userId, data.vote);
        console.log("register vot e", room);
        if(room?.allUsersVoted()){
          rooms.get(data.roomId)?.revealVotes();
          io.to(data.roomId).emit("reveal", room);
        }
        listener(room);
      }
    });

    socket.on("reveal", (data) => {
      console.log(`reveal from scrum master ${JSON.stringify(data)}`);
      rooms.get(data.roomId)?.revealVotes();
      io.to(data.roomId).emit("reveal", rooms.get(data.roomId));
    });

    socket.on("validate", (data) => {
      console.log(`validate from scrum master ${JSON.stringify(data)}`);
      rooms.get(data.roomId)?.applyFinalVote(+data.finalVote);
    });

    socket.on("redo_vote", (data) => {
      console.log(`redo vote from scrum master ${JSON.stringify(data)}`);
      let room = rooms.get(data.roomId);

      room?.resetCurrentVotes();
      room?.startVoting();

      io.to(data.roomId).emit("start_voting", rooms.get(data.roomId));
    });

    socket.on("cofee_break_vote", (data) => {
      console.log(`cofee_break_vote ${JSON.stringify(data)}`);
      rooms.get(data.roomId)?.coffeeBreakVote(data.userId);
    });

    socket.on("coffee_break_over", (data) => {
      console.log(`coffee_break_over ${JSON.stringify(data)}`);
      rooms.get(data.roomId)?.coffeeBreakOver();
    });

    socket.on("buzzer_vote", (data) => {
      console.log(`buzzer_vote ${JSON.stringify(data)}`);
      rooms.get(data.roomId)?.buzzerVote(data.userId);
    });

    socket.on("buzzer_canceled", (data) => {
      console.log(`buzzer_canceled ${JSON.stringify(data)}`);
      rooms.get(data.roomId)?.buzzerCanceled();
    });

    socket.on("start_voting", (data) => {
      console.log(`start_voting ${JSON.stringify(data)}`);
      rooms.get(data.roomId)?.startVoting();

      io.to(data.roomId).emit("start_voting", rooms.get(data.roomId));
    });

    socket.on("get_room", (data, listener) => {
      console.log(`get_room ${data.roomId}`);
      const room = rooms.get(data.roomId);
      console.log(`room : ${JSON.stringify(room)}`);
      listener(room);
    });
  });
}

export default SocketHandler;
