import type { NextPage } from "next";
import React, { useContext, useEffect, useState } from "react";
import versus from "../public/images/versus.webp";
import fighter1 from "../public/images/versus/1.webp";
import fighter2 from "../public/images/versus/2.webp";
import fighter3 from "../public/images/versus/3.webp";
import fighter4 from "../public/images/versus/4.webp";
import fighter5 from "../public/images/versus/5.webp";
import fighter6 from "../public/images/versus/6.webp";
import fighter7 from "../public/images/versus/7.webp";
import fighter8 from "../public/images/versus/8.webp";
import Image from "next/image";
import { UserContext } from "../context/UserContext";
import styles from "../styles/Versus.module.css";

const Fighters = () => {
  const { user, setUser, setRoom, room } = useContext(UserContext);
  const [widthScreen, setWidthScreen] = useState(0);
  const fightersImages = [
    fighter1,
    fighter2,
    fighter3,
    fighter4,
    fighter5,
    fighter6,
    fighter7,
    fighter8,
  ];

  useEffect(() => {
    setWidthScreen(window.innerWidth);
  }, []);

  const lowest = () => {
    let cards = room?.currentVotes.filter((vote) => vote.vote !== -1);
    let ordered = cards
      ? Array.from(cards?.sort((a, b) => Number(b.vote) - Number(a.vote)))
      : [];
    return ordered[ordered.length - 1]?.vote;
  };

  const highest = () => {
    let cards = room?.currentVotes.filter((vote) => vote.vote !== -1);
    let ordered = cards
      ? Array.from(cards?.sort((a, b) => Number(b.vote) - Number(a.vote)))
      : [];
    return ordered[0]?.vote;
  };

  function getUserName(userId: string) {
    return (
      room?.users.filter((u) => u.id === userId).pop()?.name || "Anonymous"
    );
  }

  function getFighters() {
    let cards = room?.currentVotes.filter((vote) => vote.vote !== -1);

    let highVal = highest();
    let lowVal = lowest();

    let leftCards = cards?.filter((it) => it.vote == lowVal);
    let rightCards = cards?.filter((it) => it.vote == highVal);

    let otherVoters = cards?.filter(
      (it) => it.vote != lowVal && it.vote != highVal
    );

    /* On récupère l'image du fighter */
    let i1 = Math.floor(Math.random() * 8);
    let i2 = Math.floor(Math.random() * 8);

    if (i1 === i2) {
      i2 = i1 === fightersImages.length - 1 ? 0 : i1 + 1;
    }

    let fighterMath1 = fightersImages[i1];
    let fighterMath2 = fightersImages[i2];

    return (
      <>
        <div className="row playingMat py-2 px-0 p-sm-3 m-2 mt-3">
          <div className="col-4 px-0 px-sm-3">
            <div className={`${styles.blocfighter}`}>
              <Image
                src={fighterMath2}
                layout="responsive"
                objectFit="contain"
                alt="Fighter"
                height={widthScreen > 576 ? "100px" : "200px"}
                width={widthScreen > 576 ? "100px" : "100px"}
              />
              <div className={`${styles.centered}`}>{lowVal}</div>
            </div>
            <div className="container text-center px-0">
              {leftCards?.map((item, index) => (
                <p key={index} className="text-white fw-bold my-0">
                  {getUserName(item.userId)}
                </p>
              ))}
            </div>
          </div>

          <div className="col-4 px-0 my-auto">
            <Image
              className="text-white"
              src={versus}
              layout="responsive"
              objectFit="contain"
              alt="logo"
              height={widthScreen > 576 ? "200px" : "272px"}
              width={widthScreen > 576 ? "400px" : "381px"}
            />
          </div>

          <div className="col-4 px-0 px-sm-3">
            <div className={`${styles.blocfighter}`}>
              <Image
                className={`${styles.flipX}`}
                src={fighterMath1}
                layout="responsive"
                objectFit="contain"
                alt="Fighter"
                height={widthScreen > 576 ? "100px" : "200px"}
                width={widthScreen > 576 ? "100px" : "100px"}
              />
              <div className={`${styles.centered}`}>{highVal}</div>
            </div>
            <div className="container text-center px-0">
              {rightCards?.map((item, index) => (
                <p key={index} className="text-white fw-bold my-0">
                  {getUserName(item.userId)}
                </p>
              ))}
            </div>
          </div>

          <div className="col-12 pt-sm-3 px-2 text-white text-center">
            {/* On applique le scroll auto si Mobile ou plus de 4 éléments */}
            <div className={`${styles.scrollcontainer}`}>
              <div
                className={
                  widthScreen < 576 || (otherVoters && otherVoters.length > 4)
                    ? `${styles.scrolltext}`
                    : ""
                }
              >
                <div className="container text-center">
                  {otherVoters?.map((item, index) => (
                    <span key={index} className="text-white fw-bold my-0 mx-3">
                      <span className="border border-white rounded px-2 py-1 me-2">
                        {item.vote}
                      </span>
                      {getUserName(item.userId)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return <>{getFighters()}</>;
};

export default Fighters;
