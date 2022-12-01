import type { NextPage } from "next";
import React, { useContext, useEffect, useState } from "react";
import Card from "./Card";
import Image from "next/image";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import { Role } from "../pages/api/model/user";
import ScrumMasterActions from "./ScrumMasterActions";
import { Button, Modal } from "react-bootstrap";
import { Deck } from "./Deck";
import { UserContext } from "../context/UserContext";
import FooterActiveMobile from "./layout/FooterActiveMobile";

const Versus: NextPage = () => {
  const [widthScreen, setWidthScreen] = useState(0);
  let socket: any;
  const [stateSocket, setStateSocket] = useState();
  const router = useRouter();
  const roomId = router.query.id;
  const { user, setUser, setRoom, room } = useContext(UserContext);
  const [showOtherScoreModal, setShowOtherScoreModal] = useState(false);
  const [othercard, setOthercard] = useState(0);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setWidthScreen(window.innerWidth);
  }, []);

  if (stateSocket) {
    socket = stateSocket;
  } else {
    socket = io();
    setStateSocket(socket);
  }

  const updateSelection = (chosenVote: number) => {
    setOthercard(chosenVote);
  };

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

  const forceHigh = () => {
    console.debug("Force highest : ", highest());
    socket.emit("validate", { roomId: roomId, finalVote: highest() });
    setReload(true);
    console.debug("Validate: Add points and change status room to voting");
  };

  const forceLow = () => {
    console.debug("Force lowest : ", lowest());
    socket.emit("validate", { roomId: roomId, finalVote: lowest() });
    setReload(true);
    console.debug("Validate: Add points and change status room to voting");
  };

  const forceOther = (other: number) => {
    setShowOtherScoreModal(false);
    console.debug("Force Other : ", other);
    socket.emit("validate", { roomId: roomId, finalVote: other });
    setReload(true);
    console.debug("Validate: Add points and change status room to voting");
  };

  const redoVote = () => {
    console.debug("Redo vote : ");
    socket.emit("redo_vote", { roomId });
  };

  function getUserName(userId: string) {
    return (
      room?.users.filter((u) => u.id === userId).pop()?.name || "Anonymous"
    );
  }

  const cancel = () => setShowOtherScoreModal(false);

  function getCards(side: String, mobile: boolean = false) {
    let cards = room?.currentVotes.filter((vote) => vote.vote !== -1);

    let highVal = highest();
    let lowVal = lowest();

    let leftCards = cards?.filter((it) => it.vote == lowVal);
    let rightCards = cards?.filter((it) => it.vote == highVal);

    if (side == "right") {
      return (
        <>
          <div>
            <div className="d-flex flex-wrap justify-content-center">
              <Card value={highVal} name={""} canClose={false} />
              <div className="container text-center">
                {rightCards?.map((item, index) => (
                  <h4 key={index} className="text-white fw-bold">
                    {getUserName(item.userId)}
                  </h4>
                ))}
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div>
            <div className="d-flex flex-wrap justify-content-center">
              <Card value={lowVal} name={""} canClose={false} />
              <div className="container text-center">
                {leftCards?.map((item, index) => (
                  <h4 key={index} className="text-white fw-bold">
                    {getUserName(item.userId)}
                  </h4>
                ))}
              </div>
            </div>
          </div>
        </>
      );
    }
  }

  return (
    <>
      <div className="text-center text-white pt-3">
        <h1
          style={{ fontSize: "50px", fontWeight: "bold" }}
          className="mx-0 pt-3 pb-1"
        >
          LET&apos;S FIGHT !
        </h1>
      </div>
      <div className="container px-0 px-sm-3">
        <div className="row playingMat py-3 px-0 p-sm-3 m-2 mt-sm-5 mt-3">
          <div className="col-4 px-0 px-sm-3">
            <div>{getCards("left")}</div>
          </div>
          <div className="col-4 px-0 my-auto">
            <Image
              className="text-white"
              src="/images/versus.png"
              layout="responsive"
              objectFit="contain"
              alt="logo"
              height={widthScreen > 576 ? "200px" : "272px"}
              width={widthScreen > 576 ? "400px" : "381px"}
            />
          </div>
          <div className="col-4 px-0 px-sm-3">
            <div>{getCards("right")}</div>
          </div>
        </div>

        {/* Partie texte explicatif */}
        <div className="row">
          <div className="col text-center text-xl-center m-3 p-1 roomStatus">
            <h4 className="pt-2 d-sm-block d-none">
              Hey, it seems like we&apos;re not all aligned. Let&apos;s talk
              about it. Here are the lowest and the highest votes.
            </h4>
            <h4 className="py-2 px-1 d-block d-sm-none">
              Hey, it seems like we&apos;re not all aligned. Let&apos;s talk
              about it. Here are the lowest and the highest votes.
            </h4>
          </div>
        </div>

        {(user?.role == Role.SCRUM_MASTER ||
          user?.role == Role.VOTING_SCRUM_MASTER) && (
          <div className="row mt-3">
            <div className="d-sm-none d-block offset-4 col-4">
              <ScrumMasterActions
                minValue={lowest()}
                maxValue={highest()}
                forceLow={forceLow}
                forceHigh={forceHigh}
                redoVote={redoVote}
                otherScore={() => setShowOtherScoreModal(true)}
                deck={[1, 3, 5, 8]}
              />
            </div>
            <div className="d-none d-sm-block offset-sm-2 col-sm-2">
              <button
                type="button"
                className="btn btn-lg btn-primary fw-bold w-100"
                onClick={forceLow}
              >
                GO FOR {lowest()}
              </button>
            </div>
            <div className="d-none d-sm-block col-sm-2">
              <button
                type="button"
                className="btn btn-lg btn-primary fw-bold w-100"
                onClick={forceHigh}
              >
                GO FOR {highest()}
              </button>
            </div>
            <div className="d-none d-sm-block col-sm-2">
              <button
                type="button"
                className="btn btn-lg btn-secondary fw-bold w-100"
                onClick={() => setShowOtherScoreModal(true)}
              >
                OTHER
              </button>
            </div>
            <div className="d-none d-sm-block col-sm-2">
              <button
                type="button"
                className="btn btn-lg btn-danger fw-bold w-100"
                onClick={redoVote}
              >
                REDO VOTE
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        size="lg"
        className="text-white"
        centered={true}
        show={showOtherScoreModal}
        contentClassName="bg-dark"
        onHide={cancel}
      >
        <Modal.Header style={{ border: "none" }}>
          <Modal.Title className="w-100 text-center">OTHER SCORE</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            {/* Début du block des cartes à ajouter */}
            <div className="row mt-3 ms-sm-2 text-center">
              <Deck
                deck={
                  room
                    ? room.roomOptions?.cardValues?.filter(
                        (card: number) => card != highest() && card != lowest()
                      )
                    : []
                }
                updateSelection={updateSelection}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ border: "none" }}>
          <div className="container">
            <div className="row">
              <div className="col-sm-6">
                <Button
                  className="btn-lg w-100 fw-bold mb-3"
                  variant="primary"
                  onClick={() => forceOther(othercard)}
                >
                  VALIDATE
                </Button>
              </div>
              <div className="col-sm-6">
                <Button
                  className="btn-lg w-100 fw-bold mb-3"
                  variant="danger"
                  onClick={cancel}
                >
                  CANCEL
                </Button>
              </div>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
      <FooterActiveMobile />
    </>
  );
};

export default Versus;
