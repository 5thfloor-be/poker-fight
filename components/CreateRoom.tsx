import React, { useState, useContext, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { MdAccountCircle, MdCheckCircle, MdCancel } from "react-icons/md";
import { CirclePicker } from "react-color";
import { Role } from "../pages/api/model/user";
import { UserContext } from "../context/UserContext";
import { io } from "socket.io-client";
import { useRouter } from "next/router";

type CreateRoomProps = {
  showCreateRoom: boolean;
  setShowCreateRoom: (val: any) => void;
};

const CreateRoom = (props: CreateRoomProps) => {
  const showCreateRoom = props.showCreateRoom;
  const { user, setUser, setIsRoomActive } = useContext(UserContext);
  const [checkedVoter, setCheckedVoter] = useState(false);
  const [addCard, setAddCard] = useState(false);
  const [valueNewCard, setValueNewCard] = useState("");
  const [errorLetters, setErrorLetters] = useState("");
  const router = useRouter();

  const socket = io();

  /* All params of the future Room */
  const [roomSettings, setRoomSettings] = useState({
    cardValues: ["1", "2", "3", "5", "8", "13"],
    targetPoints: "",
    coffeeBreakAllowed: false,
    revealTimer: "",
    buzzerAllowed: false,
  });

  const colors = new Map<string, string>([
    ["#0000ff", "blue"],
    ["#ffffff", "white"],
    ["#008000", "green"],
    ["#ffff00", "yellow"],
    ["#ffc0cb", "pink"],
    ["#ff0000", "red"],
    ["#ffa500", "orange"],
    ["#808080", "grey"],
  ]);

  useEffect(() => {
    if (user === null) setUser({ ...user, color: "#ffffff" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeCheckbox = () => {
    setCheckedVoter(!checkedVoter);
  };

  const deleteCard = (index: any) => {
    setRoomSettings({
      ...roomSettings,
      cardValues: roomSettings.cardValues.filter((o, i) => index !== i),
    });
  };

  const createRoom = () => {
    socket.emit("create_room", roomSettings, (data: any) => {
      console.log("data", data);

      /* Fermeture de la Modal */
      props.setShowCreateRoom(false);

      setUser({
        ...user,
        roomId: data.id,
        role: checkedVoter ? Role.VOTING_SCRUM_MASTER : Role.SCRUM_MASTER,
      });

      router.push(`room/${data.id}`);

      setIsRoomActive(true);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const cancel = () => props.setShowCreateRoom(false);

  return (
    <>
      <Modal
        size="lg"
        className="text-white"
        centered={true}
        contentClassName="bg-dark"
        show={showCreateRoom}
        onHide={cancel}
      >
        <Modal.Header style={{ border: "none" }}>
          <Modal.Title className="w-100 text-center">CREATE ROOM</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            {/* Début du bloc message erreur Letters */}
            {errorLetters.length > 0 && (
              <div className="row mb-3">
                <div className="bg-warning pt-1 text-center">
                  {errorLetters}
                  <MdCancel
                    className="ms-3"
                    color="red"
                    size={"26"}
                    onClick={() => setErrorLetters("")}
                  />
                </div>
              </div>
            )}
            {/* Début du bloc User */}
            <div className="row">
              <div className="col-sm-4 offset-sm-2">
                <div className="col-12 text-center">
                  <MdAccountCircle
                    className="mb-3"
                    color={user ? user.color : "#ffffff"}
                    title="aze"
                    size={60}
                  />
                </div>
                <div className="col">
                  <input
                    className="form-control"
                    defaultValue={user ? user.name : ""}
                    type="text"
                    placeholder="Username (15 characters max)"
                    maxLength={15}
                    onChange={(e) => {
                      setUser({ ...user, name: e.target.value });
                    }}
                  />
                </div>
                <div className="col mt-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={checkedVoter}
                      onChange={handleChangeCheckbox}
                    ></input>
                    <label className="form-check-label text-white ps-2">
                      Can vote (check the box if the Scrum Master can vote too)
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 text-center mt-3">
                <div className="offset-3 offset-sm-3">
                  <CirclePicker
                    className="mx-0 px-0"
                    onChangeComplete={(color) => {
                      setUser({ ...user, color: color.hex });
                    }}
                    width="200px"
                    colors={Array.from(colors.keys())}
                  />
                </div>
                <div className="col-12">
                  <p className="text-white mt-2">
                    Color: {colors.get(user && user.color)}
                  </p>
                </div>
              </div>
            </div>
            {/* Début du block des cartes à ajouter */}
            <div className="row mt-3 ms-sm-2 text-center">
              <div>Choose cards values</div>
              {roomSettings.cardValues.map((card, key) => (
                <div
                  className="col-2 bg-light text-primary fw-bold fs-1 mx-2 my-2 rounded"
                  key={key}
                >
                  {card}
                  {roomSettings.cardValues.length > 3 && (
                    <>
                      <br />
                      <MdCancel
                        color="red"
                        size={"26"}
                        onClick={() => deleteCard(key)}
                      />
                    </>
                  )}
                </div>
              ))}
              <div className="col-2 bg-light text-primary fw-bold mx-2 my-2 rounded">
                {!addCard ? (
                  <div
                    className="fs-1 pt-3"
                    onClick={() => setAddCard(!addCard)}
                  >
                    +
                  </div>
                ) : (
                  <div className="fs-1 pt-3">
                    <input
                      type="text"
                      className="form-control"
                      autoFocus
                      placeholder="..."
                      pattern="[A-Za-z0-9-?_]{1,2}"
                      title="Letters, numbers, and ? only"
                      maxLength={2}
                      size={1}
                      onChange={(e) => {
                        setValueNewCard(e.target.value);
                      }}
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                          setErrorLetters("Only numbers accepted");
                        } else {
                          setErrorLetters("");
                        }
                      }}
                    />

                    {/* On teste si au moins un caractère est rentré */}
                    {valueNewCard.length > 0 && (
                      <MdCheckCircle
                        className="me-sm-2"
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
                      className="ms-sm-2"
                      color="red"
                      size={"26"}
                      onClick={() => setAddCard(!addCard)}
                    />
                  </div>
                )}
              </div>
            </div>
            {/* Début du block de settings de la Room */}
            <div className="row pt-3">
              <div className="col-3 col-sm-2 offset-sm-3 text-end">
                <input
                  id="pointsachieved"
                  className="rounded p-2"
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
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                      setErrorLetters("Only numbers accepted");
                    } else {
                      setErrorLetters("");
                    }
                  }}
                />
                {roomSettings.targetPoints.length > 0 && (
                  <MdCancel
                    className="ms-2"
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
              </div>
              <div className="col-9 col-sm-6 text-start pt-2">
                <label className="form-label ps-2">
                  Number of points to achieve
                </label>
              </div>
            </div>
            <div className="row pt-3">
              <div className="col-3 col-sm-2 offset-sm-3 text-end">
                <input
                  id="timer"
                  className="rounded p-2"
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
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                      setErrorLetters("Only numbers accepted");
                    } else {
                      setErrorLetters("");
                    }
                  }}
                />
                {roomSettings.revealTimer.length > 0 && (
                  <MdCancel
                    className="ms-2"
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
              </div>
              <div className="col-9 col-sm-6 text-start">
                <span className="form-label ps-2">
                  Automatically reveal the votes after X seconds. If empty no
                  countdown
                </span>
              </div>
            </div>
            <div className="row pt-3">
              <div className="col-3 col-sm-2 offset-sm-3 form-switch text-end">
                <input
                  className="form-check-input p-2"
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
              </div>
              <div className="col-9 col-sm-6 text-start">
                <label
                  className="form-label ps-2"
                  htmlFor="flexSwitchCheckDefault"
                >
                  Allow players to initiate a break
                </label>
              </div>
            </div>
            <div className="row pt-3">
              <div className="col-3 col-sm-2 offset-sm-3 form-switch text-end">
                <input
                  className="form-check-input p-2"
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
              </div>
              <div className="col-9 col-sm-6 text-start">
                <label className="form-label ps-2" htmlFor="flexSwitchBuzzer">
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
                {user && user.name && user.name.length > 0 ? (
                  <Button
                    className="btn-lg w-100 fw-bold mb-3"
                    variant="primary"
                    onClick={createRoom}
                  >
                    CREATE ROOM
                  </Button>
                ) : (
                  <Button
                    className="btn-lg w-100 fw-bold mb-3"
                    disabled
                    variant="primary"
                  >
                    CREATE ROOM
                  </Button>
                )}
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
    </>
  );
};

export default CreateRoom;
