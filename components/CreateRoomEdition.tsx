import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { MdCheckCircle, MdCancel } from "react-icons/md";

type CreateRoomEditionProps = {
  showCreateRoomEdition: boolean;
};

const CreateRoomEdition = (props: CreateRoomEditionProps) => {
  const [showCreateRoomEdition, setShowCreateRoomEdition] = useState(
    props.showCreateRoomEdition
  );

  const [addCard, setAddCard] = useState(false);
  const [valueNewCard, setValueNewCard] = useState("");

  /* All params of the future Room */
  const [roomSettings, setRoomSettings] = useState({
    deck: ["1", "2", "3", "5", "8", "13"],
    pointsachieved: "",
    coffeebreak: false,
    timer: "",
    buzzer: false,
  });

  const deleteCard = (index: any) => {
    setRoomSettings({
      ...roomSettings,
      deck: roomSettings.deck.filter((o, i) => index !== i),
    });
  };

  const save = () => {
    /* TODO LocalStorage Room */
    setShowCreateRoomEdition(false);
  };

  const cancel = () => setShowCreateRoomEdition(false);

  console.log("roomSettings", roomSettings);

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
              {roomSettings.deck.map((card, key) => (
                <div className="col-2" key={key}>
                  {card}
                  {roomSettings.deck.length > 3 && (
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
                          tempoCardValue = [...roomSettings.deck, valueNewCard];

                          setRoomSettings({
                            ...roomSettings,
                            deck: tempoCardValue,
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
                  value={roomSettings.pointsachieved}
                  pattern="[0-9]{1,3}"
                  title="Numbers only"
                  maxLength={3}
                  size={1}
                  onChange={(e) => {
                    setRoomSettings({
                      ...roomSettings,
                      pointsachieved: e.target.value,
                    });
                  }}
                />
                {roomSettings.pointsachieved.length > 0 && (
                  <MdCancel
                    color="red"
                    size={"26"}
                    onClick={() => {
                      setRoomSettings({
                        ...roomSettings,
                        pointsachieved: "",
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
                  checked={roomSettings.coffeebreak}
                  role="switch"
                  id="flexSwitchCheckDefault"
                  onChange={() => {
                    setRoomSettings({
                      ...roomSettings,
                      coffeebreak: !roomSettings.coffeebreak,
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
                  value={roomSettings.timer}
                  pattern="[0-9]{1,3}"
                  title="Numbers only"
                  maxLength={3}
                  size={1}
                  onChange={(e) => {
                    setRoomSettings({
                      ...roomSettings,
                      timer: e.target.value,
                    });
                  }}
                />
                {roomSettings.timer.length > 0 && (
                  <MdCancel
                    color="red"
                    size={"26"}
                    onClick={() => {
                      setRoomSettings({
                        ...roomSettings,
                        timer: "",
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
                  checked={roomSettings.buzzer}
                  role="switch"
                  id="flexSwitchBuzzer"
                  onChange={() => {
                    setRoomSettings({
                      ...roomSettings,
                      buzzer: !roomSettings.buzzer,
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
                <Button className="w-100 mb-3" variant="primary" onClick={save}>
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
