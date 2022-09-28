import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import Footer from "./Footer";
import HeaderActive from "./HeaderActive";
import HeaderNonActive from "./HeaderNonActive";
import styles from "../../styles/Layout.module.css";

//Determine if where are in active Layout or not
const Layout = ({ children }) => {
  const { isRoomActive } = useContext(UserContext);

  let myHeader = <HeaderNonActive />;
  let myStyle = styles.nonActive;

  if (isRoomActive) {
    myHeader = <HeaderActive />;
    myStyle = styles.active;
  }

  return (
    <div className={myStyle}>
      {myHeader}
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
