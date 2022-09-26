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
    coffeebreak: "",
    timer: "",
    buzzer: "",
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
                <>
                  <div className="col-2" key={key}>
                    {card}
                    {roomSettings.deck.length > 3 && (
                      <>
                        <MdCancel
                          color="red"
                          size={"26"}
                          onClick={() => deleteCard(key)}
                        />
                      </>
                    )}
                  </div>
                </>
              ))}
              <div className="col-2">
                {!addCard ? (
                  <div onClick={() => setAddCard(!addCard)}>Card +</div>
                ) : (
                  <div>
                    <input
                      type="text"
                      placeholder="Value"
                      pattern="[A-Za-z0-9-?_]{1,3}"
                      title="Letters, numbers, and ? only"
                      maxLength={3}
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
