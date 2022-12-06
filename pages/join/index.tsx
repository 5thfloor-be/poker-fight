import React from "react";
import JoinRoom from "../../components/JoinRoom";
import { matomo } from '../_app';

const Join = () => {
  if (typeof window !== "undefined") {
    matomo();
  }

  return <JoinRoom />;
};

export default Join;
