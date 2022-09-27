import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import LayoutActive from "../LayoutActive";
import LayoutNonActive from "../LayoutNonActive";

//Determine if where are in active Layout or not
const Layout = ({ children }) => {
  const { isRoomActive, setIsRoomActive } = useContext(UserContext);

  return (
    <>
      {isRoomActive ? (
        <LayoutActive>{children}</LayoutActive>
      ) : (
        <LayoutNonActive>{children}</LayoutNonActive>
      )}
    </>
  );
};

export default Layout;
