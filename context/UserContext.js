const { createContext, useState, useEffect } = require("react");

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "",
    color: "#ffffff",
    role: "",
  });
  const [isRoomActive, setIsRoomActive] = useState(false);

  let initailValue;

  useEffect(() => {
    const saved = localStorage.getItem("USER");
    initailValue = JSON.parse(saved);
    setUser(initailValue);
  }, []);

  useEffect(() => {
    localStorage.setItem("USER", JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider
      value={{ user, setUser, isRoomActive, setIsRoomActive }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
