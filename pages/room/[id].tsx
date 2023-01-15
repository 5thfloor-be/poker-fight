import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Card from "../../components/Card";
import User, { Role } from "../api/model/user";
import RoomModel, { States } from "../api/model/room";
import { Deck } from "../../components/Deck";
import { UserContext } from "../../context/UserContext";
import { io, Socket } from "socket.io-client";
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
import ModalGoalScore from "../../components/ModalGoalScore";
import { matomo } from "../_app";
import perfect from "../../public/images/perfect.webp";

type RoomProps = {
  roomId: any;
};
let MINUTES_MS = 180000;

const roomStateText = new Map([
  [States.STARTING, "Waiting for the next round..."],
  [States.VOTING, "Time to vote !"],
  [States.FIGHTING, "Looks like we don't agree... "],
]);

const Room = ({ roomId }: RoomProps) => {
  if (typeof window !== "undefined") {
    matomo("analyticsRoom");
  }

  const router = useRouter();
  const { user, setUser, setRoom, room, setIsRoomActive } =
    useContext(UserContext);
  const [cardValues, setCardValues] = useState<any>([]);
  const [stateSocket, setStateSocket] = useState<Socket>();
  const [selectedVote, setSelectedVote] = useState(-1);
  const [showSpectators, setShowSpectators] = useState(false);
  const [widthScreen, setWidthScreen] = useState(0);

  useEffect(() => {
    setWidthScreen(window.innerWidth);
  }, []);

  /* Dans le cas si pas d'utilisateur redirect vers la Join Room */
  useEffect(() => {
    if (!user.name) {
      router.push(`/join/${roomId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!stateSocket && user.name.length > 0) {
      joinRoomFunction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      stateSocket?.disconnect();
    }, MINUTES_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [stateSocket]);

  const joinRoomFunction = () => {
    const socket = io();
    setStateSocket(socket);
    socket?.emit(
      "join_room",
      { roomId, userInfo: user },
      (data: JoinRoomReturn) => {
        if (data.error !== null) {
          router.push(`/error-page/${data.error}`);
        }
        setUser({ ...user, id: data.id });
        socket?.emit("get_room", { roomId }, (room: RoomModel) => {
          setRoom(room);
          setCardValues(room?.roomOptions.cardValues);
        });
      }
    );
  };
  useEffect(() => {
    if (stateSocket) {
      stateSocket.on("ping", () => stateSocket?.emit("pong", {}));

      stateSocket.on("connect", () => {
        stateSocket.emit("join_socket", { roomId });
      });

      stateSocket.on("disconnect", (err: string) => {
        if (
          err === "io server disconnect" ||
          "transport error" ||
          "transport close" ||
          "io client disconnect"
        ) {
          stateSocket.connect();
        }
      });
      stateSocket.on("reconnect", () => {
        stateSocket.emit("join_socket", { roomId });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateSocket]);

  useEffect(() => {
    if (stateSocket) {
      stateSocket.on("reveal", (data: any) => {
        setRoom(data);
        if (data?.state === States.FIGHTING) {
          <Versus socket={stateSocket} />;
        }
      });
      stateSocket.on("start_voting", (data: any) => {
        setSelectedVote(-1);
        setRoom(data);
      });
      stateSocket.on("room_state_update", (r: RoomModel) => {
        setRoom(r);
        if (r?.state === States.STARTING || r?.state === States.VOTING) {
          router.push("/room/" + roomId);
        }
      });
      stateSocket.on("user_removed", (data: any) => {
        if (data.userId === user.id) {
          stateSocket.emit("leave_room", { roomId });
          setIsRoomActive(false);
          setUser({ ...user, role: "", id: "" });
          router.push("/");
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateSocket, user]);

  const updateSelection = (chosenVote: number) => {
    setSelectedVote(chosenVote);
    stateSocket?.emit("vote", { roomId, userId: user?.id, vote: chosenVote });
  };

  // get room from server
  const startVoting = () => {
    stateSocket?.emit("start_voting", { roomId }, (r: any) => setRoom(r));
  };

  const reveal = () => {
    stateSocket?.emit("reveal", { roomId }, (r: any) => {
      setRoom(r);
    });
  };

  const redoVote = () => {
    stateSocket?.emit("redo_vote", { roomId }, (r: any) => {
      setRoom(r);
    });
  };

  const validate = () => {
    stateSocket?.emit(
      "validate",
      { roomId, finalVote: room?.wondrousVote },
      (r: any) => {
        setRoom(r);
      }
    );
  };

  const getVoteByUserId = (userId: string) => {
    return room?.currentVotes.find((userVote) => userVote.userId === userId)
      ?.vote;
  };

  if (room?.state === States.FIGHTING) {
    return <Versus socket={stateSocket} />;
  }

  if (!room) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
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
    stateSocket?.emit("remove_user", {
      roomId: room.id,
      userId: userToRemove.id,
    });
  };

  const getStatusText = () => {
    let voters = getVoters().length;
    if (voters < 2) {
      return `Waiting for at least ${2 - voters} voter(s)`;
    }
    return roomStateText.get(room.state);
  };

  const getVoters = () => {
    return room.users.filter(
      (u) => u.role === Role.VOTING_SCRUM_MASTER || u.role === Role.DEV
    );
  };

  const finishScoreGoal = () => {
    stateSocket?.emit("score_goal_over", {
      roomId: room.id,
    });
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
      <div
        className="container"
        style={widthScreen < 576 ? { paddingBottom: 80 } : { paddingBottom: 0 }}
      >
        {room.users?.length > 1 && (
          <div
            className={
              room.users.length > 3
                ? "row p-3 m-2 mt-2 mt-sm-5 playingMat justify-content-center"
                : "row p-3 m-2 mt-5 playingMat justify-content-center"
            }
          >
            {room.state !== States.WONDROUS ? (
              room.users
                .filter((u) => u?.id !== user?.id)
                .filter(
                  (u) =>
                    u?.role !== Role.SCRUM_MASTER && u?.role !== Role.SPECTATOR
                )
                .map((userMap, key) => (
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
                      selected={!!userMap.id && !!getVoteByUserId(userMap.id)}
                      onRemoveUser={() => removeUser(userMap)}
                    />
                  </div>
                ))
            ) : (
              <Image
                src={perfect}
                alt="Poker Planning"
                width={333}
                height={85}
                loading="eager"
              />
            )}
          </div>
        )}

        {/* Partie Perfect */}
        <div className="row">
          <div className="col text-center text-xl-center m-3 p-1 roomStatus">
            <h3>{getStatusText()}</h3>
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

        {/* Affichage de la popup du Goal Score */}
        {room &&
          room.roomOptions.targetPoints > 0 &&
          room.scoreGoalActive &&
          room.currentPoints > 0 &&
          room.currentPoints >= room.roomOptions.targetPoints &&
          room.state === States.STARTING && (
            <ModalGoalScore
              user={user}
              showModalGoalScore={room.scoreGoalActive}
              setShowModalGoalScore={() => finishScoreGoal()}
            />
          )}

        <div className="row my-3 mx-1 actionsArea">
          <>
            {/* Version PC du Deck */}
            <div className="row justify-content-center mb-3 pb-3">
              <div className="col-1 d-none d-sm-block px-0 my-auto">
                {room.roomOptions.coffeeBreakAllowed &&
                  getVoters().length > 1 && (
                    <CoffeBreak user={user} socket={stateSocket} room={room} />
                  )}

                {room.roomOptions.buzzerAllowed &&
                  room.state === States.VOTING && (
                    <Buzzer user={user} socket={stateSocket} room={room} />
                  )}
              </div>

              <div className="col-10 d-none d-sm-block justify-content-center mt-3">
                {user?.role !== Role.SCRUM_MASTER &&
                  user?.role !== Role.SPECTATOR &&
                  room.state !== States.WONDROUS &&
                  showBottomDeck()}
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

        <FooterActiveMobile />
      </div>
    </div>
  );
};

export default Room;

export async function getServerSideProps(context: any) {
  const { id } = context.query;
  console.debug("RoomId server side props ", id);
  return { props: { roomId: id } };
}
