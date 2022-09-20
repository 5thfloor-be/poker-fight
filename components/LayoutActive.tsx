import React from "react";
import Footer from "./Footer";
import HeaderActive from "./HeaderActive";
import styles from "../styles/LayoutActive.module.css";

const LayoutActive = ({ children }: any) => {
  return (
    <div className={styles.container}>
      <HeaderActive />
      {children}
      <Footer />
    </div>
  );
};

export default LayoutActive;
