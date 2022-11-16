import Head from "next/head";
import { useContext, useState, useEffect } from "react";
import CreateRoom from "../components/CreateRoom";
import { UserContext } from "../context/UserContext";
import { useKonamiCode } from "../components/konami/useKonamiCode";
import Credits from "../components/konami/Credits";
import { useRouter } from "next/router";
import Image from "next/image";
import { MdAccountCircle } from "react-icons/md";
import EditProfile from "../components/EditProfile";

const Home = () => {
  const { user, isRoomActive } = useContext(UserContext);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [widthScreen, setWidthScreen] = useState(0);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const konami = useKonamiCode();
  const router = useRouter();

  useEffect(() => {
    setWidthScreen(window.innerWidth);
  }, []);

  useEffect(() => {
    if (konami) setShowCredits(true);
  }, [konami]);

  const handleCreateRoom = () => {
    setShowCreateRoom(!showCreateRoom);
    setShowLoading(true);
  };

  return (
    <div
      className="text-white"
      style={widthScreen < 576 ? { paddingTop: 50 } : { paddingTop: 70 }}
    >
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
          <nav className="navbar fixed-top navbar-black bg-black w-100 py-1">
            <div className="container-fluid px-0 mx-0 w-100">
              <div className="col-3 ps-2 mt-2 d-none d-sm-block">
                <Image
                  src="/images/logo-project.png"
                  width={208}
                  height={40}
                  alt="logo"
                />
              </div>

              <div className="col-5 col-sm-3 px-2">
                {/* Bouton Create Room et Join Room */}
                <button
                  type="button"
                  className="btn btn-outline-primary fs-6 w-100"
                  onClick={() => handleCreateRoom()}
                >
                  CREATE ROOM
                </button>
              </div>

              <div className="col-5 col-sm-3 px-2">
                <button
                  type="button"
                  className="btn btn-outline-success fs-6 w-100"
                  onClick={() => router.push("/join")}
                >
                  JOIN ROOM
                </button>
              </div>

              <div className="col-2 col-sm-3 pe-3 text-end w100">
                <MdAccountCircle
                  color={user ? user.color : "#ffffff"}
                  onClick={() => {
                    setShowEditProfile(!showEditProfile);
                  }}
                  size={widthScreen < 576 ? 40 : 60}
                />
                {showEditProfile && (
                  <EditProfile
                    showEditProfile={showEditProfile}
                    setShowEditProfile={(val) => setShowEditProfile(val)}
                  />
                )}
              </div>
            </div>
          </nav>

          <div className="container bg-black mx-0 mw-100">
            <div className="row mt-3">
              <p
                style={{
                  fontSize: "70px",
                  fontFamily: "Arial",
                  fontWeight: "600",
                }}
              >
                <span className="d-none d-sm-block">
                  A new experience in
                  <br />
                  Agility World !
                </span>
                <span className="d-sm-none d-block">
                  A new experience in Agility World !
                </span>
              </p>
            </div>

            <div
              className="row"
              style={widthScreen < 576 ? { paddingTop: 0 } : { paddingTop: 70 }}
            >
              <div className="col-sm-5 offset-sm-1 py-3">
                <p
                  style={{
                    fontSize: "35px",
                    fontFamily: "Arial",
                    fontWeight: "600",
                  }}
                >
                  Discover a new voting system for your Poker Planning, with fun
                  and innovative features.
                </p>
              </div>
              <div className="col-sm-5 py-3">
                <Image
                  src="/images/in-progress.png"
                  alt="Poker Planning"
                  width={500}
                  height={245}
                />
              </div>
            </div>
            <div
              className="row"
              style={widthScreen < 576 ? { paddingTop: 0 } : { paddingTop: 70 }}
            >
              <div className="col-sm-5 offset-sm-1 py-3">
                <Image
                  src="/images/versus.png"
                  alt="VS Room"
                  width={381}
                  height={272}
                />
              </div>
              <div className="col-sm-5 py-3">
                <p
                  style={{
                    fontSize: "35px",
                    fontFamily: "Arial",
                    fontWeight: "600",
                  }}
                >
                  When there is no consensus, enter into the VS Room to open a
                  debate between the lowest and the highest votes.
                </p>
              </div>
            </div>
            <div
              className="row"
              style={widthScreen < 576 ? { paddingTop: 0 } : { paddingTop: 70 }}
            >
              <div className="col-sm-5 offset-sm-1 py-3">
                <p
                  style={{
                    fontSize: "35px",
                    fontFamily: "Arial",
                    fontWeight: "600",
                  }}
                >
                  You can decide to fix a goal or not for every session with a
                  number of points to achieve.
                </p>
              </div>
              <div className="col-sm-5 py-3">
                <Image
                  src="/images/points-achieved.png"
                  alt="Poker Planning"
                  width={500}
                  height={331}
                />
              </div>
            </div>
            <div
              className="row"
              style={widthScreen < 576 ? { paddingTop: 0 } : { paddingTop: 70 }}
            >
              <div className="col-sm-5 offset-sm-1 py-3">
                <Image
                  src="/images/coffee-time.png"
                  alt="VS Room"
                  width={500}
                  height={330}
                />
              </div>
              <div className="col-sm-5 py-3">
                <p
                  style={{
                    fontSize: "35px",
                    fontFamily: "Arial",
                    fontWeight: "600",
                  }}
                >
                  It&apos;s coffee time ! Activate that option to let the people
                  claiming a little break if the meeting starts to get long...
                </p>
              </div>
            </div>
            <div
              className="row"
              style={widthScreen < 576 ? { paddingTop: 0 } : { paddingTop: 70 }}
            >
              <div className="col-sm-5 offset-sm-1 py-3">
                <p
                  style={{
                    fontSize: "35px",
                    fontFamily: "Arial",
                    fontWeight: "600",
                  }}
                >
                  Maybe it&apos;s time to accelerate the discussion ? Activate
                  that function to let the people speed up the pace.
                </p>
              </div>
              <div className="col-sm-5 py-3">
                <Image
                  src="/images/speed-up.png"
                  alt="Poker Planning"
                  width={500}
                  height={365}
                />
              </div>
            </div>
            <div
              className="row"
              style={widthScreen < 576 ? { paddingTop: 0 } : { paddingTop: 70 }}
            >
              <div className="col-sm-5 offset-sm-1 py-3">
                <Image
                  src="/images/github.png"
                  alt="VS Room"
                  width={500}
                  height={284}
                />
              </div>
              <div className="col-sm-5 py-3">
                <p
                  style={{
                    fontSize: "35px",
                    fontFamily: "Arial",
                    fontWeight: "600",
                  }}
                >
                  This application is Open Source and developed by 5th Floor
                  teams. Discover the full story{" "}
                  <a
                    className="text-decoration-none text-reset"
                    href="https://5thfloor.be/poker-fight"
                    target="_blank"
                    rel="noreferrer"
                  >
                    [here]
                  </a>
                  .
                </p>
              </div>
            </div>
            <div
              className="row"
              style={
                widthScreen < 576
                  ? { paddingTop: 0, paddingBottom: 50 }
                  : { paddingTop: 70, paddingBottom: 50 }
              }
            >
              <div className="col-sm-5 offset-sm-1 py-3">
                <p
                  style={{
                    fontSize: "35px",
                    fontFamily: "Arial",
                    fontWeight: "600",
                  }}
                >
                  We love Cookies but not yours ! Here there are no collection
                  of information, no database, and no registration is required.
                  Just start a game with your colleagues and enjoy freely.
                </p>
              </div>
              <div className="col-sm-5 py-3">
                <Image
                  src="/images/cookies.png"
                  alt="Poker Planning"
                  width={500}
                  height={329}
                />
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
