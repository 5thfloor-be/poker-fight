import React from "react";
import Footer from "./Footer";
import HeaderActive from "./HeaderActive";

const LayoutActive = ({ children }: any) => {
  return (
    <div>
      <HeaderActive />
      {children}
      <Footer />
    </div>
  );
};

export default LayoutActive;
