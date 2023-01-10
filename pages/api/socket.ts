import { IncomingMessage } from "http";
import { v4 as uuid } from "uuid";
import { Server } from "socket.io";
import Room from "./model/room";
import User, { isScrumMaster, Role } from "./model/user";
import { ErrorCode } from "./model/ErrorCode";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import { Emitter } from "@socket.io/redis-emitter";

const rooms: Map<string, Room> = new Map();

export interface JoinRoomReturn {
  id: string;
  error: number;
}

const SocketHandler = (req: IncomingMessage, res: any) => {
  console.log("Starting server with environment variables : ", process.env);
  if (res?.socket?.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    console.log("Log after initialize");
    console.log("res.socket?.server : ", res.socket?.server);
    // Create the socket.io server
    const io = new Server(res.socket?.server, {
      pingTimeout: 600000,
      pingInterval: 600000,
      upgradeTimeout: 300000,
    });
    // Create Redis clients
    console.log(
      `Connecting redis adapter to : redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    );
    const pubClient = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });
    const subClient = pubClient.duplicate();
    // create Redis adapter and connect it to the io instance
    const adapter = createAdapter(pubClient, subClient);
    io.adapter(adapter);
    // create Redis emitter and start listening to the io instance
    const emitter = new Emitter(
      createClient({
        url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      })
    );

    // You should also handle promise rejections correctly
    Promise.all([pubClient.connect(), subClient.connect()])
      .then(() => {
        console.log("Redis clients connected");
        io.listen(3000);
      })
      .catch((reason: any) => {
        console.error("An error occurred connecting to redis : ", reason);
      });

    // do whatever you want with the emitter and io instances
    configIO(io, emitter);
    res.socket.server.io = io;
  }
  res.end();
};

const sendHeartbeat = (socket: Server) => {
  setTimeout(() => sendHeartbeat(socket), 20 * 1000);
  socket.emit("ping", { beat: 1 });
};

function configIO(io: Server, emitter: Emitter) {
  //Trying some debugging of redis adapter, should be removed
  // io.of("/").adapter.on('room_state_update', data => console.debug('Redis adapter received room state update ', data));
  // io.of("/").adapter.on('create-room', data => console.debug('Redis adapter received room creation ', data));
  // io.of("/").adapter.on('join-room', data => console.debug('Redis adapter received join room ', data));
  io.on("server_room_state_update", (data: Room) => {
    console.log("server room state update received", data);
    rooms.set(data.id, data);
    io.to(data.id).emit("room_state_update", data);
  });

  io.on("connection", (socket) => {
    setTimeout(() => sendHeartbeat(io), 20 * 1000);
    socket.on("pong", () => {});

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
      if (!room) {
        listener({ id: null, error: ErrorCode.ROOM_NOT_EXISTS });
        return;
      }
      if (
        room?.users.filter((user) => user.id === data.userInfo.id).length === 0
      ) {
        const user = { ...data.userInfo, id: uuid() };
        userIdTemp = user.id;
        if (room?.isFull() && user?.role === Role.DEV) {
          listener({ id: null, error: ErrorCode.TOO_MANY_VOTERS });
          return;
        }

        room?.addUser(user);
      }
      listener({ id: userIdTemp, error: null });
    });

    socket.on("join_socket", (data) => {
      console.log("join_socket");
      socket.join(data.roomId);
    });

    socket.on("disconnect", function () {
      console.log("A client has disconnected.");
    });
    socket.on("remove_user", (data) => {
      console.log(`${data.userId} is removed `, data);
      const userRemoved = rooms.get(data.roomId)?.removeUser(data.userId);
      io.to(data.roomId).emit("user_removed", { userId: data.userId });
      if (userRemoved && isScrumMaster(userRemoved)) {
        rooms.get(data.roomId)?.users.forEach((u) => {
          if (u.id !== data.userId) {
            io.to(data.roomId).emit("user_removed", { userId: u.id });
          }
        });
      }
    });

    socket.on("leave_room", (data) => {
      console.log("user leaving room");
      socket.leave(data.roomId);
    });

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
      room.registerOnChangeCallback((room: Room) => {
        console.log(
          `server side - room state update sent${JSON.stringify(room)}`
        );
        emitter.serverSideEmit("server_room_state_update", room);
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
        if (room?.allUsersVoted()) {
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

    socket.on("score_goal_over", (data) => {
      console.log(`score_goal_over ${JSON.stringify(data)}`);
      rooms.get(data.roomId)?.scoreGoalOver();
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
