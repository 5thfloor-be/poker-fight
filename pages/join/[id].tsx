import React from "react";
import { useRouter } from "next/router";
import JoinRoom from "../../components/JoinRoom";
import { matomo } from '../_app';

const JoinWithId = () => {
  if (typeof window !== "undefined") {
    matomo();
  }

  const router = useRouter();
  const roomId: string = router.query.id as string;

  return <JoinRoom roomId={roomId} />;
};

export default JoinWithId;
