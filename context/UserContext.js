const { createContext, useState, useEffect } = require("react");

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "",
    color: "#ffffff",
  });

  let initailValue;

  useEffect(() => {
    const saved = localStorage.getItem("USER");
    initailValue = JSON.parse(saved);
    setUser(initailValue);
    //console.log("initailValue:=", initailValue);

    /*     if (!user) {
      tempo = JSON.parse(localStorage.getItem("USER"));
      setUser(JSON.parse(localStorage.getItem("USER")));
    } */
  }, []);

  useEffect(() => {
    console.log("user", user);
    console.log("initial", initailValue);

    localStorage.setItem("USER", JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
