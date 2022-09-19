import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import Header from "./header";
import { FaLinkedinIn } from "react-icons/fa";
import Image from "next/image";
import SubFooter from "./subfooter";
import Footer from "./footer";

const Home: NextPage = () => {
  const [isRoomActive, setIsRoomActive] = useState(true);
  return (
    <div className={styles.container}>
      <Head>
        <title>Poker-Fight.com</title>
        <meta
          name="description"
          content="Discover a new voting system for your Poker Planning, with fun
                  and innovative features."
        />
        <link rel="icon" href="/images/favicon.png" />
      </Head>

      <Header isRoomActive={isRoomActive} />
      <main className={styles.main}>
        <div className="container mx-0 mw-100">
          <div className="row">
            <div className="col">
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
      {isRoomActive && <SubFooter />}
      <Footer />
    </div>
  );
};

export default Home;
