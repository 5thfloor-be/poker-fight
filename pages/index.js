import Head from "next/head";
import { useContext, useState, useEffect } from "react";
import CreateRoom from "../components/CreateRoom";
import JoinRoom from "../components/JoinRoom";
import FooterActiveMobile from "../components/layout/FooterActiveMobile";
import { UserContext } from "../context/UserContext";
import Carousel from "../components/Carousel";
import { useKonamiCode } from "../components/konami/useKonamiCode";
import Credits from "../components/konami/Credits";
import { useRouter } from "next/router";

const Home = () => {
  const { isRoomActive } = useContext(UserContext);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const konami = useKonamiCode();
  const router = useRouter();

  useEffect(() => {
    if (konami) setShowCredits(true);
  }, [konami]);

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

      {/* On affiche uniquement les éléments si la Room n'est pas active */}
      {!isRoomActive && (
        <main>
          <div className="container mx-0 mw-100">
            {/* Partie dédiée au Carousel */}
            <div className="row mt-3">
              <Carousel />
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
                  onClick={() => router.push("/join")}
                >
                  JOIN ROOM
                </button>
              </div>
            </div>
          </div>
        </main>
      )}
      {showCreateRoom && (
        <CreateRoom
          showCreateRoom={showCreateRoom}
          setShowCreateRoom={(val) => setShowCreateRoom(val)}
        />
      )}
      {showCredits && (
        <Credits
          showCredits={showCredits}
          setShowCredits={(val) => setShowCredits(val)}
        />
      )}
      {isRoomActive && <FooterActiveMobile />}
    </div>
  );
};

export default Home;

export async function getServerSideProps() {
  const url = process.env.HOST;

  console.log("URL", url);
  await fetch(url);
  return {
    props: {
      //socket: socket
    },
  };
}
