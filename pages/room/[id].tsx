import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Card from "../../components/Card";
import User, { Role } from "../api/model/user";
import RoomModel, { States } from "../api/model/room";
import { GiCardRandom } from "react-icons/gi";
import { Deck } from "../../components/Deck";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import { UserContext } from "../../context/UserContext";
import { io } from "socket.io-client";
import CoffeBreak from "../../components/CoffeBreak";
import Spectators from "../../components/Spectators";
import { BsEyeglasses } from "react-icons/bs";
import ModalSpectators from "../../components/ModalSpectators";
import Buzzer from "../../components/Buzzer";
import FooterActiveMobile from "../../components/layout/FooterActiveMobile";
import Versus from "../../components/Versus";
import ScrumMasterVotingToolbar from "../../components/ScrumMasterVotingToolbar";
import { JoinRoomReturn } from "../api/socket";
import Image from "next/image";

type RoomProps = {
  roomy: any;
};

const roomStateText = new Map([
  [States.STARTING, "Waiting for the next round..."],
  [States.VOTING, "Time to vote !"],
  [States.FIGHTING, "Looks like we don't agree... "],
]);

const Room = (props: RoomProps) => {
  const router = useRouter();
  const roomId = router.query.id;
  const { user, setUser, setRoom, room } = useContext(UserContext);
  const [cardValues, setCardValues] = useState<any>([]);
  const [stateSocket, setStateSocket] = useState();
  const [selectedVote, setSelectedVote] = useState(-1);
  const [showSpectators, setShowSpectators] = useState(false);
  const [widthScreen, setWidthScreen] = useState(0);

  useEffect(() => {
    setWidthScreen(window.innerWidth);
  }, []);

  //modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let socket: any;

  // Le reload asynchrone de la page remet à any la Socket
  if (stateSocket) {
    socket = stateSocket;
  }

  /* Dans le cas si pas d'utilisateur redirect vers la Join Room */
  useEffect(() => {
    if (!user.name) {
      router.push(`/join/${props.roomy}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!socket && user.name.length > 0) {
      socket = io({ reconnectionDelayMax: 3600000 });

      setStateSocket(socket);

      socket.emit(
        "join_room",
        { roomId, userInfo: user },
        (data: JoinRoomReturn) => {
          console.log("emit : join room user : ", user);
          if (data.error !== null) {
            router.push(`/error-page/${data.error}`);
          }
          setUser({ ...user, id: data.id });
        }
      );

      socket.emit("get_room", { roomId: roomId }, (room: RoomModel) => {
        console.log("emit : get room user : ", user);
        setRoom(room);
        setCardValues(room?.roomOptions.cardValues);
      });
    }

    if (socket) {
      socket.on("connect", () => {
        console.log("connected");
      });

      socket.on("disconnect", (err: string) => {
        console.log("server disconnected: ", err);
        if (err === "io server disconnect" || "transport error") {
          // Reconnect manually if the disconnection was initiated by the server
          socket.connect();
        }
      });
      socket.on("reconnect", () => {
        socket.emit(
          "join_room",
          { roomId, userInfo: user },
          (data: JoinRoomReturn) => {
            console.log("emit : reconnection user : ", user);
            if (data.error !== null) {
              router.push(`/error-page/${data.error}`);
            }
            setUser({ ...user, id: data.id });
          }
        );
        // ...
      });
      socket.on("reveal", (data: any) => {
        console.log("received : reveal", data);
        setRoom(data);
        setShow(false);
        if (data?.state === States.FIGHTING) {
          <Versus />;
        }
      });
      socket.on("start_voting", (data: any) => {
        console.log("received : start voting", data);
        setSelectedVote(-1);
        setRoom(data);
      });
      socket.on("room_state_update", (r: RoomModel) => {
        console.log("received : room state update received ", r);
        setRoom(r);
        if (r?.state === States.STARTING || r?.state === States.VOTING) {
          router.push("/room/" + roomId);
        }
      });
      socket.on("user_removed", (data: any) => {
        console.log("received : user removed", data);
        if (data.userId === user.id) {
          socket.emit("emit : leave front", { roomId: roomId });
        }
      });
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

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
  // get room from server
  const startVoting = () => {
    console.log("emit : start voting: Change status room to voting", socket);
    socket.emit("start_voting", { roomId }, (r: any) => setRoom(r));
  };

  const reveal = () => {
    console.log("emit : reveal: Change status room to voted");
    socket.emit("reveal", { roomId }, (r: any) => {
      setRoom(r);
    });
  };

  const redoVote = () => {
    console.log("emit : redo vote: Change status vote to voting");
    socket.emit("redo_vote", { roomId }, (r: any) => {
      setRoom(r);
    });
  };

  const validate = () => {
    socket.emit(
      "validate",
      { roomId: roomId, finalVote: room?.wondrousVote },
      (r: any) => {
        setRoom(r);
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

  if (room?.state === States.FIGHTING) {
    return <Versus />;
  }

  if (!room) {
    return (
      <div className="bg-warning text-center">
        <h1>Wait please, the room is charging</h1>
      </div>
    );
  }

  const showBottomDeck = () => {
    return (
      <>
        {room.state === States.WONDROUS && (
          <Card selected={false} canClose={false} value={selectedVote} />
        )}
        {room.state === States.VOTING && (
          <Deck
            deck={cardValues}
            updateSelection={updateSelection}
            currentVote={getVoteByUserId(user.id)}
          />
        )}
      </>
    );
  };

  const removeUser = (userToRemove: User) => {
    socket.emit("remove_user", { roomId: room.id, userId: userToRemove.id });
  };

  return (
    /* Rajouter un espace pour centrer le bloc si le User en cours est Spectateur ou Scrum Master non votant */
    <div
      style={
        (user.role === Role.SPECTATOR || user.role === Role.SCRUM_MASTER) &&
        widthScreen > 576
          ? { paddingTop: 60 }
          : { paddingTop: 0 }
      }
    >
      <div className="container">
        {room.users?.length > 1 && (
          <div className="row p-3 m-2 mt-5 playingMat justify-content-center">
            {room.state !== States.WONDROUS ? (
              room.users
                .filter((u) => u?.id !== user?.id)
                .map((userMap, key) => (
                  <>
                    {userMap.role !== Role.SCRUM_MASTER &&
                      userMap.role !== Role.SPECTATOR && (
                        <div key={key} className="col-4 col-sm-2">
                          <Card
                            value={
                              room?.state === States.WONDROUS && !!userMap.id
                                ? getVoteByUserId(userMap.id)
                                : undefined
                            }
                            canClose={
                              user.role === Role.SCRUM_MASTER ||
                              user.role === Role.VOTING_SCRUM_MASTER
                            }
                            color={userMap.color}
                            name={userMap.name}
                            selected={
                              !!userMap.id && !!getVoteByUserId(userMap.id)
                            }
                            onRemoveUser={() => removeUser(userMap)}
                          />
                        </div>
                      )}
                  </>
                ))
            ) : (
              <Image
                src="/images/perfect.png"
                alt="Poker Planning"
                width={333}
                height={85}
              />
            )}
          </div>
        )}

        {/* Partie Perfect */}
        <div className="row">
          <div className="col text-center text-xl-center m-3 p-1 roomStatus">
            <h3>{roomStateText.get(room.state)}</h3>
            {room.state == States.WONDROUS && (
              <h1 className="fw-bold" style={{ fontSize: "60px" }}>
                {room.wondrousVote}
              </h1>
            )}
          </div>
        </div>

        <ScrumMasterVotingToolbar
          room={room}
          role={user?.role}
          startVoting={startVoting}
          redoVote={redoVote}
          reveal={reveal}
          validate={validate}
        />

        <div className="row my-3">
          <>
            {/* Version PC du Deck */}
            <div
              className="row"
              style={
                widthScreen < 576 ? { paddingBottom: 0 } : { paddingBottom: 40 }
              }
            >
              <div className="col-2 d-none d-sm-block">
                {room.roomOptions.coffeeBreakAllowed && (
                  <CoffeBreak user={user} socket={socket} room={room} />
                )}

                {room.roomOptions.buzzerAllowed &&
                  room.state === States.VOTING && (
                    <Buzzer user={user} socket={socket} room={room} />
                  )}
              </div>

              <div className="col-8 d-none d-sm-block justify-content-center mt-3">
                {user?.role !== Role.SCRUM_MASTER &&
                  user?.role !== Role.SPECTATOR &&
                  room.state !== States.WONDROUS &&
                  showBottomDeck()}
              </div>

              <div className="col-12 d-sm-none mx-auto text-center">
                {getVoteByUserId(user.id) && (
                  <button
                    className="btn fw-bold bg-white py-0 ms-3"
                    onClick={handleShow}
                    style={{ fontSize: "50px" }}
                  >
                    {getVoteByUserId(user.id)}
                  </button>
                )}
              </div>

              {/* Version PC des Spectateurs */}
              <div className="col-2 d-none d-sm-block justify-content-center">
                <Spectators
                  roomSpectators={room.users.filter(
                    (u) => u?.role === Role.SPECTATOR
                  )}
                />
              </div>
            </div>

            {/* Version Mobile des Spectateurs */}
            <div className="d-sm-none text-center">
              {room.users.filter((u) => u?.role === Role.SPECTATOR).length >
                0 && (
                <BsEyeglasses
                  size={70}
                  color="white"
                  onClick={() => setShowSpectators(!showSpectators)}
                />
              )}
              {showSpectators && (
                <ModalSpectators
                  showSpectators={showSpectators}
                  setShowSpectators={(val) => setShowSpectators(val)}
                  roomSpectators={room.users.filter(
                    (u) => u?.role === Role.SPECTATOR
                  )}
                />
              )}
            </div>
          </>
        </div>

        <Modal size="lg" centered={true} contentClassName="bg-dark" show={show}>
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
        <FooterActiveMobile />
      </div>
    </div>
  );
};

export default Room;

export async function getServerSideProps(context: any) {
  const { id } = context.query;
  console.log("ROOMYYYYY", id);
  return { props: { roomy: id } };
}
