const { createContext, useState, useEffect } = require("react");

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [userbis, setUser] = useState({
    username: "",
    color: "#ffffff",
  });

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("USERBis")));
  }, []);

  useEffect(() => {
    console.log("userbis", userbis);

    localStorage.setItem("USERBis", JSON.stringify(userbis));
  }, [userbis]);

  return (
    <UserContext.Provider value={{ userbis, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
