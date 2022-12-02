
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import {UserContext} from "../context/UserContext";
import {IoExitOutline} from "react-icons/io5";
import {io} from "socket.io-client";
const QuitButton = () => {

    const { setIsRoomActive, user, setUser, room } =
        useContext(UserContext);
    const router = useRouter();

    const quitHandler = () => {
        setIsRoomActive(false);
        setUser({ ...user, role: "" });
        let socket = io({transports: ["websocket"]});
        socket.emit("remove_user", {
            userId: user.id,
            roomId: room?.id
        });
        router.push("/");
    };

    return (
        <>
        <button onClick={quitHandler} className="btn btn-danger mt-1 d-none d-sm-block">
            <IoExitOutline color="white" size={30} />
        </button>
        <div onClick={quitHandler} className="w-100 h-100 d-lg-none">
            QUIT ROOM <IoExitOutline color="white" size={30} />
        </div>
        </>
    );
};

export default QuitButton;