import React, { useCallback, useState, useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import { io } from "socket.io-client";
import { getStorageValue, setStorageValue } from "./UseLocalStorage";
import User, { Role } from "../pages/api/model/user";
import { useRouter } from "next/router";
import { UserContext } from "../context/UserContext";

type CreateRoomEditionProps = {
  showCreateRoomEdition: boolean;
};

const CreateRoomEdition = (props: CreateRoomEditionProps) => {
  const [showCreateRoomEdition, setShowCreateRoomEdition] = useState(
    props.showCreateRoomEdition
  );

  const [addCard, setAddCard] = useState(false);
  const [valueNewCard, setValueNewCard] = useState("");
  const { isRoomActive, setIsRoomActive } = useContext(UserContext);

  /* All params of the future Room */
  const [roomSettings, setRoomSettings] = useState({
    cardValues: ["1", "2", "3", "5", "8", "13"],
    targetPoints: "",
    coffeeBreakAllowed: false,
    revealTimer: "",
    buzzerAllowed: false,
  });

  const router = useRouter();
  const deleteCard = (index: any) => {
    setRoomSettings({
      ...roomSettings,
      cardValues: roomSettings.cardValues.filter((o, i) => index !== i),
    });
  };

  const save = () => {
    /* TODO LocalStorage Room */
    setShowCreateRoomEdition(false);
  };

  const cancel = () => setShowCreateRoomEdition(false);

  console.log("roomSettings", roomSettings);

  const socket = io();
  const createRoom = useCallback(() => {
    setIsRoomActive(true);
    socket.emit("create_room", roomSettings, (data: any) => {
      console.log(data.roomId);
      const userInfo = getStorageValue("USER", {
        name: "Anonymous Scrum master",
        color: "white",
        role: "SCRUM_MASTER",
      });
      setStorageValue("USER", { ...userInfo, role: Role.VOTING_SCRUM_MASTER });
      //TODO set user role vased on the "can vote" property from previous popup
      // socket.emit('join_room', {roomId: data.roomId, userInfo: userInfo});
      router.push(`room/${data.roomId}`);
    });
  }, []);

  return (
    <>
      <Modal
        className="text-white"
        centered={true}
        contentClassName="bg-dark"
        show={showCreateRoomEdition}
        onHide={cancel}
      >
        <Modal.Header style={{ border: "none" }}>
          <Modal.Title className="w-100">
            <p className="text-center">CREATE ROOM</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              {roomSettings.cardValues.map((card, key) => (
                <div className="col-2" key={key}>
                  {card}
                  {roomSettings.cardValues.length > 3 && (
                    <MdCancel
                      color="red"
                      size={"26"}
                      onClick={() => deleteCard(key)}
                    />
                  )}
                </div>
              ))}
              <div className="col-2">
                {!addCard ? (
                  <div onClick={() => setAddCard(!addCard)}>Card +</div>
                ) : (
                  <div>
                    <input
                      type="text"
                      placeholder="Value"
                      pattern="[A-Za-z0-9-?_]{1,2}"
                      title="Letters, numbers, and ? only"
                      maxLength={2}
                      size={1}
                      onChange={(e) => {
                        setValueNewCard(e.target.value);
                      }}
                    />

                    {/* On teste si au moins un caractère est rentré */}
                    {valueNewCard.length > 0 && (
                      <MdCheckCircle
                        color="#3f51b5"
                        size={"26"}
                        onClick={() => {
                          let tempoCardValue: string[];
                          tempoCardValue = [
                            ...roomSettings.cardValues,
                            valueNewCard,
                          ];

                          setRoomSettings({
                            ...roomSettings,
                            cardValues: tempoCardValue,
                          });
                          setAddCard(!addCard);
                        }}
                      />
                    )}
                    <MdCancel
                      color="red"
                      size={"26"}
                      onClick={() => setAddCard(!addCard)}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="row pt-3">
              <div className="col text-center">
                <input
                  id="pointsachieved"
                  type="text"
                  placeholder="Value"
                  value={roomSettings.targetPoints}
                  pattern="[0-9]{1,3}"
                  title="Numbers only"
                  maxLength={3}
                  size={1}
                  onChange={(e) => {
                    setRoomSettings({
                      ...roomSettings,
                      targetPoints: e.target.value,
                    });
                  }}
                />
                {roomSettings.targetPoints.length > 0 && (
                  <MdCancel
                    color="red"
                    size={"26"}
                    onClick={() => {
                      setRoomSettings({
                        ...roomSettings,
                        targetPoints: "",
                      });
                    }}
                  />
                )}
                <label className="ps-2">Number of points to achieve</label>
              </div>
            </div>
            <div className="row text-center pt-3">
              <div className="col form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={roomSettings.coffeeBreakAllowed}
                  role="switch"
                  id="flexSwitchCheckDefault"
                  onChange={() => {
                    setRoomSettings({
                      ...roomSettings,
                      coffeeBreakAllowed: !roomSettings.coffeeBreakAllowed,
                    });
                  }}
                />
                <label className="ps-2" htmlFor="flexSwitchCheckDefault">
                  Allow players to initiate a break
                </label>
              </div>
            </div>
            <div className="row pt-3">
              <div className="col text-center">
                <input
                  id="timer"
                  type="text"
                  placeholder="Value"
                  value={roomSettings.revealTimer}
                  pattern="[0-9]{1,3}"
                  title="Numbers only"
                  maxLength={3}
                  size={1}
                  onChange={(e) => {
                    setRoomSettings({
                      ...roomSettings,
                      revealTimer: e.target.value,
                    });
                  }}
                />
                {roomSettings.revealTimer.length > 0 && (
                  <MdCancel
                    color="red"
                    size={"26"}
                    onClick={() => {
                      setRoomSettings({
                        ...roomSettings,
                        revealTimer: "",
                      });
                    }}
                  />
                )}
                <label className="ps-2">
                  Automatically reveal the votes after X seconds. If empty no
                  countdown
                </label>
              </div>
            </div>
            <div className="row text-center pt-3">
              <div className="col form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={roomSettings.buzzerAllowed}
                  role="switch"
                  id="flexSwitchBuzzer"
                  onChange={() => {
                    setRoomSettings({
                      ...roomSettings,
                      buzzerAllowed: !roomSettings.buzzerAllowed,
                    });
                  }}
                />
                <label className="ps-2" htmlFor="flexSwitchBuzzer">
                  Allow players to speed up discussion
                </label>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ border: "none" }}>
          <div className="container">
            <div className="row">
              <div className="col-sm-6">
                <Button
                  className="w-100 mb-3"
                  variant="primary"
                  onClick={createRoom}
                >
                  CREATE ROOM
                </Button>
              </div>
              <div className="col-sm-6">
                <Button
                  className="w-100 mb-3"
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
    </>
  );
};

export default CreateRoomEdition;
