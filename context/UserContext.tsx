import Room from "../pages/api/model/room";

import { createContext, useState, useEffect } from "react";
import { io } from 'socket.io-client';
import { Socket } from 'socket.io';

interface AppContextInterface {
  user: any;
  setUser: (newvalue: any) => void;
  room?: Room;
  setRoom: (newvalue: Room) => void;
  isRoomActive: any;
  setIsRoomActive: (newvalue: any) => void;
  socket: any;
  setSocket: (newvalue: any) => void;
}

export const UserContext = createContext<AppContextInterface>({
  user: null,
  setUser: () => undefined,
  room: undefined,
  setRoom: () => undefined,
  isRoomActive: null,
  setIsRoomActive: () => undefined,
  socket: undefined,
  setSocket: () => undefined
});

const UserContextProvider = (props: any) => {
  const [user, setUser] = useState({
    name: "",
    color: "#ffffff",
    role: "",
  });
  const [isRoomActive, setIsRoomActive] = useState(false);
  const [room, setRoom] = useState<Room>();
  const [socket, setSocket] = useState(io())
  let initailValue;

  useEffect(() => {
    const saved = localStorage.getItem("USER");
    if(saved){
      initailValue = JSON.parse(saved ? saved : "");
      setUser(initailValue);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("USER", JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        room,
        setRoom,
        isRoomActive,
        setIsRoomActive,
        socket,
        setSocket
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
