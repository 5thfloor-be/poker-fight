import React, {useEffect, useState} from "react";
import { useRouter } from "next/router";
import JoinRoom from "../../components/JoinRoom";
import { matomo } from '../_app';

const JoinWithId = () => {
  if (typeof window !== "undefined") {
    matomo("analyticsJoin");
  }
  const router = useRouter();
  const id: string = router.query.id as string;
  const [roomId, setRoomId] = useState('');

  useEffect(() => {
    if (router.isReady) {
      setRoomId(id);
    }
  }, [id, router.isReady])


  return <JoinRoom roomId={roomId} />;
};

export default JoinWithId;
