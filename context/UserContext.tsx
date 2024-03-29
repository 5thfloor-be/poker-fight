import Room from "../pages/api/model/room";

import { createContext, useState, useEffect } from "react";

interface AppContextInterface {
  user: any;
  setUser: (newvalue: any) => void;
  room?: Room;
  setRoom: (newvalue: Room) => void;
  isRoomActive: any;
  setIsRoomActive: (newvalue: any) => void;
}

export const UserContext = createContext<AppContextInterface>({
  user: null,
  setUser: () => undefined,
  room: undefined,
  setRoom: () => undefined,
  isRoomActive: null,
  setIsRoomActive: () => undefined,
});

const UserContextProvider = (props: any) => {
  const [user, setUser] = useState({
    name: "",
    color: "#ffffff",
    role: "",
    webapp: true,
  });
  const [isRoomActive, setIsRoomActive] = useState(false);
  const [room, setRoom] = useState<Room>();

  let initailValue;

  useEffect(() => {
    const saved = localStorage.getItem("USER");
    if (saved) {
      initailValue = JSON.parse(saved ? saved : "");
      setUser(initailValue);
    }
  }, []);

  useEffect(() => {
    console.debug("Setting user to local storage ", user);
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
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
