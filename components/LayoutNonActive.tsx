import React from "react";

import HeaderNonActive from "./HeaderNonActive";
import styles from "../styles/LayoutNonActive.module.css";
import Footer from "./Footer";

type LayoutNonActiveProps = {
  user: any;
};

const LayoutNonActive = ({ children }: any, props: LayoutNonActiveProps) => {
  return (
    <div className={styles.container}>
      <HeaderNonActive user={props.user} />
      {children}
      <Footer />
    </div>
  );
};

export default LayoutNonActive;
