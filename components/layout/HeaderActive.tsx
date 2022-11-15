import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { MdAccountCircle, MdOutlineCheck } from "react-icons/md";
import { UserContext } from "../../context/UserContext";
import EditProfile from "../EditProfile";
import RoomModel, { States } from "../../pages/api/model/room";
import { io } from "socket.io-client";
import { IoExitOutline } from "react-icons/io5";

const HeaderActive = () => {


  return (<div>HEADER TEST</div>);
};

export default HeaderActive;
