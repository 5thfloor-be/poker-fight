import type { NextPage } from "next";
import Head from "next/head";
import { useContext, useState } from "react";
import styles from "../styles/Home.module.css";
import CreateRoom from "../components/CreateRoom";
import ScrumMasterActions from "../components/ScrumMasterActions";
import CreateRoomEdition from "../components/CreateRoomEdition";
import JoinRoom from "../components/JoinRoom";
import FooterActiveMobile from "../components/layout/FooterActiveMobile";
import { UserContext } from "../context/UserContext";

const Home: NextPage = () => {
  const { isRoomActive, setIsRoomActive } = useContext(UserContext);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [showCreateRoomEdition, setShowCreateRoomEdition] = useState(false);

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
        <div className="container mx-0 mw-100" style={{ marginTop: "15%" }}>
          <div className="row">
            <div className="col px-0">
              <div className={styles.landingText}>
                <p>
                  Discover a new voting system for your Poker Planning, with fun
                  and innovative features.
                </p>
                <p>
                  No registration is required, just start a game and invite your
                  colleagues to join you.
                </p>
                <p>
                  This application is Open Source and developed by 5th Floor
                  teams. Discover the full story{" "}
                  <a
                    className="text-decoration-none text-reset"
                    href="https://5thfloor.be/poker-fight"
                    target="_blank"
                    rel="noreferrer"
                  >
                    here
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="offset-sm-3 col-sm-2 offset-1 col-10 my-1">
              <button
                type="button"
                className="btn btn-primary w-100 fw-bold"
                onClick={() => setShowCreateRoom(!showCreateRoom)}
              >
                CREATE ROOM
              </button>
            </div>
            <div className="offset-sm-2 col-sm-2 offset-1 col-10 my-1">
              <button
                type="button"
                className="btn btn-success w-100 fw-bold"
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
          setShowCreateRoom={() => setShowCreateRoom(true)}
          setShowCreateRoomEdition={() => setShowCreateRoomEdition(true)}
        />
      )}
      {showJoinRoom && (
        <JoinRoom
          showJoinRoom={showJoinRoom}
          setShowJoinRoom={() => setShowJoinRoom(true)}
        />
      )}
      {showCreateRoomEdition && (
        <CreateRoomEdition showCreateRoomEdition={showCreateRoomEdition} />
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
