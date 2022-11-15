import { IncomingMessage } from "http";
import { v4 as uuid } from "uuid";
import { Server } from "socket.io";
import Room from "./model/room";

const rooms: Map<string, Room> = new Map();

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
    console.log(`User connected ${socket.id}`);

    socket.on("join_room", (data, listener) => {
      let userIdTemp = data.userInfo.id;

      console.log(`${socket.id} is joining data :${data.userInfo.id}`);
      console.log(`${socket.id} is joining ${data.userInfo}`);
      console.log(`${socket.id} is joining ${socket.id}`);
      socket.join(data.roomId);

      console.log("data.roomId)", data.roomId);

      /* Check if User in DataTransfer, if yes compare with user in room, if user doesn't exist add it */
      console.log(
        "gros if",
        rooms
          .get(data.roomId)
          ?.users.filter((user) => user.id === data.userInfo.id).length === 0
      );

      if (
        rooms
          .get(data.roomId)
          ?.users.filter((user) => user.id === data.userInfo.id).length === 0
      ) {
        console.log(
          "rooms.get(data.roomId)?.users.",
          rooms.get(data.roomId)?.users.length
        );

        const user = { ...data.userInfo, id: uuid() };
        userIdTemp = user.id;
        rooms.get(data.roomId)?.addUser(user);
      }
      listener(userIdTemp);
    });

    socket.on("leave_room", (data) => {
      console.log(`${socket.id} is leaving ${data}`);
      socket.leave(data.roomId);
      rooms.get(data.roomId)?.removeUser(socket.id);
    });

    socket.on("create_room", (data, listener) => {
      console.log(`Creating room with data `, data);
      const roomId = uuid();
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
        rooms.get(data.roomId)?.registerVote(data.userId, data.vote);
        console.log("register vot e", rooms.get(data.roomId));

        listener(rooms.get(data.roomId));
      }
    });

    socket.on("reveal", (data) => {
      console.log(`reveal from scrum master ${JSON.stringify(data)}`);
      rooms.get(data.roomId)?.revealVotes();
      socket.to(data.roomId).emit("reveal", rooms.get(data.roomId));
    });

    socket.on("redo_vote", (data) => {
      console.log(`redo vote from scrum master ${JSON.stringify(data)}`);
      let room = rooms.get(data.roomId);

      room?.resetCurrentVotes();
      room?.startVoting();

      io.in(data.roomId).emit("start_voting", rooms.get(data.roomId));
    });

    socket.on("cofee_break_vote", (data) => {
      console.log(`cofee_break_vote ${JSON.stringify(data)}`);
      rooms.get(data.roomId)?.coffeeBreakVote(data.userId);
    });

    socket.on('coffee_break_over', (data) =>{
      console.log(`coffee_break_over ${JSON.stringify(data)}`);
      rooms.get(data.roomId)?.coffeeBreakOver();
    })

    socket.on("buzz_break_vote", (data) => {
      console.log(`buzz_break_vote ${JSON.stringify(data)}`);
      rooms.get(data.roomId)?.buzzBreakVote(data.userId);
    });

    socket.on("start_voting", (data) => {
      console.log(`start_voting ${JSON.stringify(data)}`);
      rooms.get(data.roomId)?.startVoting();

      io.in(data.roomId).emit("start_voting", rooms.get(data.roomId));
    });

    socket.on("get_room", (data, listener) => {
      console.log(`get_room ${data.roomId}`);
      const room = rooms.get(data.roomId);
      console.log(`room : ${JSON.stringify(room)}`);
      listener(room);
    });

    socket.on("force_vote", (data) => {
      const roomId = data.roomId;
      rooms.get(roomId)?.forceVote(data.vote);
      socket.to(data.roomId).emit("force_vote", rooms.get(roomId));
    });
  });
}

export default SocketHandler;
