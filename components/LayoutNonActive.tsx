import React from "react";

import HeaderNonActive from "./HeaderNonActive";
import styles from "../styles/LayoutNonActive.module.css";
import Footer from "./Footer";

const LayoutNonActive = ({ children }: any) => {
  return (
    <div className={styles.container}>
      <HeaderNonActive />
      {children}
      <Footer />
    </div>
  );
};

export default LayoutNonActive;
