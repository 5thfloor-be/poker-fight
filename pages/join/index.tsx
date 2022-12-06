import React from "react";
import JoinRoom from "../../components/JoinRoom";
import { matomo } from '../_app';

const Join = () => {
  if (typeof window !== "undefined") {
    matomo("analyticsJoin");
  }
  return <JoinRoom />;
};

export default Join;
