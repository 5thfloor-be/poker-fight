import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import FooterActiveMobile from "../components/FooterActiveMobile";
import { Modal } from "react-bootstrap";
import ScrumMasterActions from "../components/ScrumMasterActions";

const Home: NextPage = () => {
  const [isRoomActive, setIsRoomActive] = useState(true);
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
                  >
                    here
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>

          <ScrumMasterActions minValue={1} maxValue={3} deck={[1, 3, 5, 8]} />

          <div className="row">
            <div className="offset-sm-3 col-sm-2 offset-1 col-10 my-1">
              <button type="button" className="btn btn-primary w-100 fw-bold">
                CREATE ROOM
              </button>
            </div>
            <div className="offset-sm-2 col-sm-2 offset-1 col-10 my-1">
              <button type="button" className="btn btn-success w-100 fw-bold">
                JOIN ROOM
              </button>
            </div>
          </div>
        </div>
      </main>
      {isRoomActive && <FooterActiveMobile />}
    </div>
  );
};

export default Home;
