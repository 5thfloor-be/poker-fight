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
import { matomo } from "./_app";
import logoProject from "../public/images/logo-project-happy.webp";
import inProgress from "../public/images/in-progress.webp";
import versus from "../public/images/versus.webp";
import pointsAchieved from "../public/images/points-achieved.webp";
import coffeeTime from "../public/images/coffee-time.webp";
import speedUp from "../public/images/speed-up.webp";
import gitHub from "../public/images/github.webp";
import cookies from "../public/images/cookies.webp";

const Home = () => {
  if (typeof window !== "undefined") {
    matomo("analytics");
  }

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
    <div className="text-white">
      <Head>
        <title>Poker Fight - A new voting system for your Poker Planning</title>
        <meta
          name="description"
          content="Discover a new voting system for your Poker Planning, with fun
                  and innovative features."
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="public/manifest.json" />
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
        <main
          style={widthScreen < 576 ? { paddingTop: 50 } : { paddingTop: 70 }}
        >
          <nav className="navbar fixed-top navbar-black bg-black w-100 py-1">
            <div className="container-fluid px-0 mx-0 w-100">
              <div className="col-3 ps-2 mt-2 d-none d-sm-block">
                <Image
                  loading="eager"
                  src={logoProject}
                  width={208}
                  height={40}
                  alt="logo"
                />
              </div>

              <div className="col-5 col-sm-3 px-2">
                {/* Bouton Create Room et Join Room */}
                <button
                  type="button"
                  className="btn btn-outline-primary fs-6 w-100 fw-bold"
                  onClick={() => handleCreateRoom()}
                >
                  CREATE ROOM
                </button>
              </div>

              <div className="col-5 col-sm-3 px-2">
                <button
                  type="button"
                  className="btn btn-outline-success fs-6 w-100 fw-bold"
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
                  style={{ cursor: "pointer" }}
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
                  lineHeight: "1.2",
                }}
              >
                <span className="d-none d-sm-block">
                  A new experience in
                  <br />
                  Agile World!
                </span>
                <span className="d-sm-none d-block">
                  A new experience in Agile World!
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
                  and innovative features. And it&apos;s mobile first!
                </p>
              </div>
              <div className="col-sm-5 py-3">
                <Image
                  loading="eager"
                  src={inProgress}
                  alt="Poker Planning"
                  width={500}
                  height={257}
                />
              </div>
              <div
                className="col-4 offset-4 border-white border-top"
                style={widthScreen < 576 ? { marginTop: 0 } : { marginTop: 70 }}
              ></div>
            </div>
            <div
              className="row"
              style={widthScreen < 576 ? { paddingTop: 0 } : { paddingTop: 70 }}
            >
              <div className="col-sm-5 offset-sm-1 py-3">
                <Image
                  loading="eager"
                  src={versus}
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
                  When there is no consensus, enter into the VS Room to start a
                  debate between the lowest and the highest votes.
                </p>
              </div>
              <div
                className="col-4 offset-4 border-white border-top"
                style={widthScreen < 576 ? { marginTop: 0 } : { marginTop: 70 }}
              ></div>
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
                  Set a goal for your estimation session with a target number of
                  points to reach. Poker-Fight will visualise the team&apos;s
                  progress towards the goal during the planning session.
                </p>
              </div>
              <div className="col-sm-5 py-3">
                <Image
                  loading="eager"
                  src={pointsAchieved}
                  alt="Points Achieved"
                  width={500}
                  height={331}
                />
              </div>
              <div
                className="col-4 offset-4 border-white border-top"
                style={widthScreen < 576 ? { marginTop: 0 } : { marginTop: 70 }}
              ></div>
            </div>
            <div
              className="row"
              style={widthScreen < 576 ? { paddingTop: 0 } : { paddingTop: 70 }}
            >
              <div className="col-sm-5 offset-sm-1 py-3">
                <Image
                  loading="eager"
                  src={coffeeTime}
                  alt="Coffee Time"
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
                  It&apos;s coffee time! Let participants ask for a coffee break
                  when focus and energy is getting low. Triggered as soon as the
                  majority of participants asks for a break!
                </p>
              </div>
              <div
                className="col-4 offset-4 border-white border-top"
                style={widthScreen < 576 ? { marginTop: 0 } : { marginTop: 70 }}
              ></div>
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
                  Need to accelerate the discussion? Hit the speedometer and
                  make the team pick up the pace.
                </p>
              </div>
              <div className="col-sm-5 py-3">
                <Image
                  loading="eager"
                  src={speedUp}
                  alt="Speed Up"
                  width={500}
                  height={321}
                />
              </div>
              <div
                className="col-4 offset-4 border-white border-top"
                style={widthScreen < 576 ? { marginTop: 0 } : { marginTop: 70 }}
              ></div>
            </div>
            <div
              className="row"
              style={widthScreen < 576 ? { paddingTop: 0 } : { paddingTop: 70 }}
            >
              <div className="col-sm-5 offset-sm-1 py-3">
                <Image
                  loading="eager"
                  src={gitHub}
                  alt="GitHub"
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
                    href="https://5thfloor.be/fr/poker-fight/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    [here]
                  </a>
                  .
                </p>
              </div>
              <div
                className="col-4 offset-4 border-white border-top"
                style={widthScreen < 576 ? { marginTop: 0 } : { marginTop: 70 }}
              ></div>
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
                  We love Cookies but not yours ! No collection of information,
                  no database, and no registration is required. Just start a
                  game with your colleagues and enjoy it.
                </p>
              </div>
              <div className="col-sm-5 py-3">
                <Image
                  loading="eager"
                  src={cookies}
                  alt="Cookies"
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
  console.debug("index.js url", url);
  await fetch(url);
  return {
    props: {
      //socket: socket
    },
  };
}
