import Head from "next/head";
import { useContext, useState, useEffect } from "react";
import CreateRoom from "../components/CreateRoom";
import FooterActiveMobile from "../components/layout/FooterActiveMobile";
import { UserContext } from "../context/UserContext";
import { useKonamiCode } from "../components/konami/useKonamiCode";
import Credits from "../components/konami/Credits";
import { useRouter } from "next/router";
import Image from "next/image";

const Home = () => {
  const { isRoomActive, room } = useContext(UserContext);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const konami = useKonamiCode();
  const router = useRouter();

  useEffect(() => {
    if (konami) setShowCredits(true);
  }, [konami]);

  const handleCreateRoom = () => {
    setShowCreateRoom(!showCreateRoom);
    setShowLoading(true);
  };

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

      {showLoading && isRoomActive && (
        <>
          <div className="loader-container">
            <div className="spinner"></div>
          </div>
        </>
      )}

      {/* On affiche uniquement les éléments si la Room n'est pas active */}
      {!isRoomActive && (
        <main>
          <div className="container mx-0 mw-100">
            <div className="row mt-3">
              <div className="offset-sm-2 col-sm-3 offset-1 col-10 my-2">
                <button
                  type="button"
                  className="btn btn-primary btn-lg w-100 fw-bold"
                  onClick={() => handleCreateRoom()}
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
              <div className="col-sm-5 offset-sm-1 py-3">
                <Image
                  src="/images/poker-planning.jpg"
                  alt="Poker Planning"
                  width={500}
                  height={250}
                />
                <p className="fw-bold">
                  Discover a new voting system for your Poker Planning, with fun
                  and innovative features.
                </p>
              </div>
            </div>
            <div className="row py-3 bg-secondary">
              <div className="col-sm-5 offset-sm-5 mt-3">
                <Image
                  src="/images/vsroom.jpg"
                  alt="VS Room"
                  width={1000}
                  height={500}
                />
                <p className="fw-bold">
                  When there is no consensus, meet in a special room to open a
                  debate.
                </p>
              </div>
            </div>
            <div className="row py-3 bg-black">
              <div className="col-sm-5 offset-sm-1 mt-3">
                <Image
                  src="/images/love-git.jpg"
                  alt="Love Git"
                  width={1000}
                  height={500}
                />
                <p className="fw-bold text-white">
                  This application is Open Source and developed by 5th Floor
                  teams. Discover the full story
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
            <div className="row py-3 bg-light">
              <div className="col-sm-5 offset-sm-5 mt-3">
                <Image
                  src="/images/gdpr.jpg"
                  alt="GDPR Friendly"
                  width={1000}
                  height={500}
                />
                <p className="fw-bold">
                  No registration is required, just start a game and invite your
                  colleagues to join you.
                </p>
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
