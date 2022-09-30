import type { NextPage } from "next";
import Head from "next/head";
import { useContext, useState } from "react";
import styles from "../styles/Home.module.css";
import CreateRoom from "../components/CreateRoom";
import JoinRoom from "../components/JoinRoom";
import FooterActiveMobile from "../components/layout/FooterActiveMobile";
import { UserContext } from "../context/UserContext";
import Carousel from "../components/Carousel";

const Home: NextPage = () => {
  const { isRoomActive, setIsRoomActive } = useContext(UserContext);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);

  return (
    <div>
      <Head>
        <title>Poker Fight - A new voting system for your Poker Planning</title>
        <meta
          name="description"
          content="Discover a new voting system for your Poker Planning, with fun
                  and innovative features."
        />
        <link rel="icon" href="/images/favicon.png" />
      </Head>

      <main>
        <div className="container mx-0 mw-100">
          {/* Partie dédiée au Carousel */}
          <div className="row mt-3">
            <div className="col-12 col-sm-8 offset-sm-2 my-3">
              <Carousel />
            </div>
          </div>

          <div className="row mt-3">
            <div className="offset-sm-2 col-sm-3 offset-1 col-10 my-2">
              <button
                type="button"
                className="btn btn-primary btn-lg w-100 fw-bold"
                onClick={() => setShowCreateRoom(!showCreateRoom)}
              >
                CREATE ROOM
              </button>
            </div>
            <div className="offset-sm-2 col-sm-3 offset-1 col-10 my-2">
              <button
                type="button"
                className="btn btn-success btn-lg w-100 fw-bold"
                onClick={() => setShowJoinRoom(!showJoinRoom)}
              >
                JOIN ROOM
              </button>
            </div>
          </div>
        </div>
      </main>
      {showCreateRoom && (
        <CreateRoom
          showCreateRoom={showCreateRoom}
          setShowCreateRoom={(val) => setShowCreateRoom(val)}
        />
      )}
      {showJoinRoom && (
        <JoinRoom
          showJoinRoom={showJoinRoom}
          setShowJoinRoom={(val) => setShowJoinRoom(val)}
        />
      )}
      {isRoomActive && <FooterActiveMobile />}
    </div>
  );
};

export default Home;

export async function getServerSideProps() {
  console.log("xxxxxxxxx");
  await fetch("http://localhost:3000/api/socket");
  return {
    props: {
      //socket: socket
    },
  };
}
