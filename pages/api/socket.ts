import { IncomingMessage } from "http";
import { v4 as uuid } from "uuid";
import Room from "./model/room";
import { isScrumMaster, Role } from "./model/user";
import { ErrorCode } from "./model/ErrorCode";
import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";

const rooms: Map<string, Room> = new Map();

let redisClient: any = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

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

    console.log("res.socket?.server : ", res.socket?.server);

    const io = new Server(res.socket?.server, {
      pingTimeout: 600000,
      pingInterval: 600000,
      upgradeTimeout: 300000,
    });

    const pubClient = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });
    const subClient = pubClient.duplicate();

    Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
      io.adapter(createAdapter(pubClient, subClient) as any);
      io.listen(3000);
    });

    configIO(io);
    res.socket.server.io = io;
  }
  res.end();
};

const sendHeartbeat = (socket: Server) => {
  setTimeout(() => sendHeartbeat(socket), 20 * 1000);
  socket.emit("ping", { beat: 1 });
};

function configIO(io: Server) {
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

      // Check if room already exists in Redis
      redisClient.get(
        data.roomId,
        (err: Error | null, result: string | null) => {
          if (err) {
            listener({ id: null, error: ErrorCode.ROOM_NOT_EXISTS });
            return;
          }
          let room: Room;
          if (result) {
            room = JSON.parse(result);
          } else {
            listener({ id: null, error: ErrorCode.ROOM_NOT_EXISTS });
            return;
          }
          // Add user to room
          if (
            room?.users.filter((user) => user.id === data.userInfo.id)
              .length === 0
          ) {
            const user = { ...data.userInfo, id: uuid() };
            userIdTemp = user.id;
            if (room?.isFull() && user?.role === Role.DEV) {
              listener({ id: null, error: ErrorCode.TOO_MANY_VOTERS });
              return;
            }
            room.users.push(user);
            // Update room in Redis
            redisClient.set(data.roomId, JSON.stringify(room));
          }
          // Join socket to room
          socket.join(data.roomId);
          listener({ id: userIdTemp, error: null });
        }
      );
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
      // Get room from Redis
      redisClient.get(
        data.roomId,
        (err: Error | null, result: string | null) => {
          if (err) {
            return;
          }
          let room: Room;
          if (result) {
            room = JSON.parse(result);
          } else {
            return;
          }
          // Remove user from room
          room.users = room.users.filter((user) => user.id !== data.userId);
          // Update room in Redis
          redisClient.set(data.roomId, JSON.stringify(room));
          // Leave socket from room
          socket.leave(data.roomId);
        }
      );
    });

    socket.on("create_room", (data, listener) => {
      console.log(`Creating room with data `, data);

      // Generate unique room ID
      let roomIdTemp = Math.floor(Math.random() * 100000);
      while (roomIdTemp === 0 || roomIdTemp < 10000) {
        roomIdTemp = Math.floor(Math.random() * 100000);
      }
      const roomId = roomIdTemp.toString();

      // Check if room already exists in Redis
      redisClient.get(
        data.roomId,
        (err: Error | null, result: string | null) => {
          if (err) {
            listener({ error: ErrorCode.ROOM_NOT_EXISTS });
            return;
          }
          if (result) {
            listener({ error: ErrorCode.ROOM_ALREADY_EXISTS });
            return;
          }
          // Create new room
          const room = new Room(roomId, data);
          room.registerOnChangeCallback((room: Room) => {
            console.log(`room state update sent${JSON.stringify(room)}`);
            io.to(roomId).emit("room_state_update", room);
          });

          // Add room to Redis
          redisClient.set(roomId, JSON.stringify(room));

          listener(room);
        }
      );
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
