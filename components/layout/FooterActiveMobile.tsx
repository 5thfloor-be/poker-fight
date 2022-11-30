import type { NextPage } from "next";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../../context/UserContext";
import styles from "../../styles/Footer.module.css";
import Modal from "react-bootstrap/Modal";
import { Deck } from "../Deck";
import { io } from "socket.io-client";
import { Button } from "react-bootstrap";
import { Role } from "../../pages/api/model/user";
import { States } from "../../pages/api/model/room";
import { GiCardRandom } from "react-icons/gi";
import CoffeBreak from "../CoffeBreak";
import Buzzer from "../Buzzer";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { IoExitOutline } from "react-icons/io5";

const FooterActiveMobile: NextPage = () => {
  const { isRoomActive, setIsRoomActive, user, setUser, room } =
    useContext(UserContext);

  const cardValues = room ? room.roomOptions.cardValues : [];

  const [selectedVote, setSelectedVote] = useState(-1);
  const [stateSocket, setStateSocket] = useState();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const router = useRouter();
  const roomId = router.query.id;
  const urlValue = "https://www.poker-fight.com/room/" + router.query.id;

  let socket: any;

  if (stateSocket) {
    socket = stateSocket;
  } else {
    socket = io({ reconnectionDelayMax: 3600000 });
    setStateSocket(socket);
  }

  const path = useRouter();

  const quitHandler = () => {
    setIsRoomActive(false);
    setUser({ ...user, role: "" });
    path.push("/");
  };

  const updateSelection = (chosenVote: number) => {
    setSelectedVote(chosenVote);
    setShow(false);
    socket.emit(
      "vote",
      { roomId: roomId, userId: user?.id, vote: chosenVote },
      (room: any) => {
        console.log("room in listener : ", room);
      }
    );
  };

  const getVoteByUserId = (userId: string) => {
    return room?.currentVotes
      .filter((userVote) => userVote.userId === userId)
      .at(0)?.vote
      ? Number(
          room?.currentVotes
            .filter((userVote) => userVote.userId === userId)
            .at(0)?.vote
        )
      : undefined;
  };

  /* Si la room est undefined */
  if (!room) {
    return <></>;
  }

  return (
    <>
      {isRoomActive && (
        <footer className={styles.containeractivefooter}>
          <div className="container d-sm-none mx-0 mw-100 py-2 text-center">
            <div className="row my-auto">
              {/* Affichage du Score */}
              <div className="col-2 px-0" style={{ marginTop: "30px" }}>
                {room && room.roomOptions.targetPoints && (
                  <div
                    className={
                      room.currentPoints >= room.roomOptions.targetPoints
                        ? "text-success"
                        : "text-white"
                    }
                  >
                    {room.currentPoints ? room.currentPoints : 0}/
                    {room.roomOptions.targetPoints}
                  </div>
                )}
              </div>
              {/* Bouton Pause Café */}
              <div className="col-2 pt-3 px-0 ">
                {room.roomOptions.coffeeBreakAllowed && (
                  <CoffeBreak user={user} socket={socket} room={room} />
                )}
              </div>
              {/* Deck central */}
              <div className="col-4">
                {user?.role !== Role.SCRUM_MASTER &&
                  user?.role !== Role.SPECTATOR &&
                  room?.state === States.VOTING && (
                    <div>
                      <button className="btn text-white" onClick={handleShow}>
                        <div className="bg-white rounded-circle p-2">
                          <GiCardRandom color="black" size={60} />
                        </div>
                      </button>
                    </div>
                  )}
              </div>
              {/* Bouton Buzzer */}
              <div className="col-2 pt-3 px-0 ">
                {room.roomOptions.buzzerAllowed &&
                  room.state === States.VOTING && (
                    <Buzzer user={user} socket={socket} room={room} />
                  )}
              </div>

              {/* Dropup menu */}
              <div className="col-2 px-0 fw-bold ">
                <DropdownButton
                  id="dropup-button"
                  drop="up"
                  variant="dark"
                  title="[+]"
                  className={`p-0 my-auto ${styles.dropUpButton}`}
                  menuVariant="dark"
                  color="white"
                  size="lg"
                >
                  <Dropdown.Item
                    onClick={() => {
                      navigator.clipboard.writeText(urlValue);
                    }}
                  >
                    Copy URL Room :{" "}
                    <span className="bg-primary p-1 rounded">{roomId}</span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    href="https://5thfloor.be/fr/poker-fight/"
                    target="_blank"
                  >
                    5th Floor Open Source Project
                  </Dropdown.Item>
                  <Dropdown.Item className="text-center" onClick={quitHandler}>
                    QUIT ROOM <IoExitOutline size={30} />
                  </Dropdown.Item>
                </DropdownButton>
              </div>
            </div>
          </div>

          <Modal
            size="lg"
            centered={true}
            contentClassName="bg-dark"
            show={show}
          >
            <Modal.Header style={{ border: "none" }}>
              <Modal.Title className="w-100">
                <p className="text-white text-center">CHOOSE CARD</p>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="container">
                <div className="row">
                  <Deck deck={cardValues} updateSelection={updateSelection} />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer style={{ border: "none" }}>
              <div className="container">
                <div className="row">
                  <div className="sm-6">
                    <Button
                      className="w-100 mb-3"
                      variant="danger"
                      onClick={handleClose}
                    >
                      CANCEL
                    </Button>
                  </div>
                </div>
              </div>
            </Modal.Footer>
          </Modal>
        </footer>
      )}
    </>
  );
};

export default FooterActiveMobile;
