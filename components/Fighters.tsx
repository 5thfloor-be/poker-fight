import React, { useContext, useEffect, useState } from "react";
import versus from "../public/images/versus.webp";
import Image, { StaticImageData } from "next/image";
import { UserContext } from "../context/UserContext";
import styles from "../styles/Versus.module.css";
import UserVote from "../pages/api/model/userVote";

const Fighters = () => {
  const { room } = useContext(UserContext);
  const [widthScreen, setWidthScreen] = useState(0);

  const [leftCards, setLeftCards] = useState<UserVote[]>();
  const [rightCards, setRightCards] = useState<UserVote[]>();

  const [otherVoters, setOtherVoters] = useState<UserVote[]>();

  const [fighterMath1, setFighterMath1] = useState<string>();
  const [fighterMath2, setFighterMath2] = useState<string>();

  const fightersImages: string[] = [
    "../public/images/versus/1.webp",
    "../public/images/versus/2.webp",
    "../public/images/versus/3.webp",
    "../public/images/versus/4.webp",
    "../public/images/versus/5.webp",
    "../public/images/versus/6.webp",
    "../public/images/versus/7.webp",
    "../public/images/versus/8.webp",
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

  useEffect(() => {
    if (!fighterMath1 && !fighterMath2) {
      let cards = room?.currentVotes.filter((vote) => vote.vote !== -1);

      let highVal = highest();
      let lowVal = lowest();

      setLeftCards(cards?.filter((it) => it.vote == lowVal));
      setRightCards(cards?.filter((it) => it.vote == highVal));

      setOtherVoters(
        cards?.filter((it) => it.vote != lowVal && it.vote != highVal)
      );

      /* On récupère l'image du fighter */
      let i1 = Math.floor(Math.random() * 8);
      let i2 = Math.floor(Math.random() * 8);

      if (i1 === i2) {
        i2 = i1 === fightersImages.length - 1 ? 0 : i1 + 1;
      }

      setFighterMath1(fightersImages[i1]);
      setFighterMath2(fightersImages[i2]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="row playingMat py-2 px-0 p-sm-3 m-2 mt-3">
        <div className="col-4 px-0 px-sm-3">
          <div className={`${styles.blocfighter}`}>
            {fighterMath2 && (
              <Image
                src={fighterMath2}
                layout="responsive"
                objectFit="contain"
                alt="Fighter"
                height={widthScreen > 576 ? "100px" : "200px"}
                width={widthScreen > 576 ? "100px" : "100px"}
              />
            )}
            <div className={`${styles.centered}`}>{lowest()}</div>
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
            {fighterMath1 && (
              <Image
                className={`${styles.flipX}`}
                src={fighterMath1}
                layout="responsive"
                objectFit="contain"
                alt="Fighter"
                height={widthScreen > 576 ? "100px" : "200px"}
                width={widthScreen > 576 ? "100px" : "100px"}
              />
            )}
            <div className={`${styles.centered}`}>{highest()}</div>
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
};

export default Fighters;
