import React, { useContext, useState, useEffect } from "react";
import {
  Button,
  Modal,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import {
  MdAccountCircle,
  MdCode,
  MdOutlineKeyboard,
  MdOutlineTagFaces,
} from "react-icons/md";
import { CirclePicker } from "react-color";
import { useRouter } from "next/router";
import { Role } from "../pages/api/model/user";
import { UserContext } from "../context/UserContext";

type JoinRoomProps = {
  roomId?: string;
};

const JoinRoom = (props: JoinRoomProps) => {
  const [roomId, setRoomId] = useState(props.roomId);
  const [isDev, setIsDev] = useState(1);
  const router = useRouter();

  const { user, setUser, setIsRoomActive } = useContext(UserContext);

  useEffect(() => {
    if (user === null) setUser({ name: "", color: "#ffffff", role: Role.DEV });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  console.log(user);

  const join = () => {
    //Activate the active header
    setIsRoomActive(true);

    if (
      (user.role === Role.SCRUM_MASTER ||
        user.role === Role.VOTING_SCRUM_MASTER) &&
      user.roomId === roomId
    ) {
      setUser({ ...user, role: user.role });
    } else {
      setUser({ ...user, role: isDev === 1 ? Role.DEV : Role.SPECTATOR });
    }
    router.push(`/room/${roomId}`);
  };

  const cancel = () => router.push("/");

  const toggle = (val: number) => {
    setIsDev(val);
  };
  return (
    <>
      <div className="d-flex align-items-center min-vh-100">
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-8 offset-sm-2 bg-dark rounded-4">
              <div className="row justify-content-center py-3">
                <h1 className="text-white text-center">JOIN ROOM</h1>
              </div>
              <div className="row py-3">
                <div className="col-sm-6 text-center">
                  <div className="col-12">
                    <MdAccountCircle
                      className="mb-3"
                      color={user ? user.color : "#ffffff"}
                      title="aze"
                      size={60}
                    />
                  </div>
                  <div className="col-12">
                    <input
                      defaultValue={user ? user.name : ""}
                      type="text"
                      className={
                        user.name ? "" : "border border-danger border-2"
                      }
                      placeholder="Username"
                      maxLength={15}
                      required={true}
                      onChange={(e) =>
                        setUser({ ...user, name: e.target.value })
                      }
                    />
                    <br />
                    <label className="text-white">(15 characters max)</label>
                  </div>
                </div>
                <div className="col-sm-6 text-center mt-3">
                  <div className="offset-3 offset-sm-2">
                    <CirclePicker
                      className="mx-0 px-0"
                      onChangeComplete={(color) =>
                        setUser({ ...user, color: color.hex })
                      }
                      width="200px"
                      colors={Array.from(colors.keys())}
                    />
                  </div>
                  <div className="col-12">
                    <p className="text-white mt-2">
                      Color: {colors.get(user?.color)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="row py-3">
                <div className="col-6 offset-3">
                  <input
                    className={
                      roomId ? "w-100" : " w-100 border border-danger border-2"
                    }
                    defaultValue={roomId || ""}
                    type="text"
                    placeholder="Room id"
                    required={true}
                    onChange={(e) => setRoomId(e.target.value)}
                  />
                </div>
              </div>
              <div className="row py-1 mx-1">
                {(user.role === Role.SCRUM_MASTER ||
                  user.role === Role.VOTING_SCRUM_MASTER) &&
                user.roomId === roomId ? (
                  <div className="text-center text-white mt-3">
                    <h3>You are the Scrum Master of this Room</h3>
                  </div>
                ) : (
                  <ToggleButtonGroup
                    type="radio"
                    name="options"
                    defaultValue={isDev}
                    onChange={toggle}
                    className="mt-3 px-0"
                  >
                    <ToggleButton
                      id="dev"
                      value={1}
                      style={
                        isDev === 1
                          ? { backgroundColor: "#0d6efd" }
                          : { backgroundColor: "transparent" }
                      }
                    >
                      <MdOutlineKeyboard className="me-3" size={28} />
                      Developer
                    </ToggleButton>
                    <MdCode className="mx-3 mt-2" size={26} color={"white"} />
                    <ToggleButton
                      id="spec"
                      value={2}
                      style={
                        isDev === 2
                          ? { backgroundColor: "#0d6efd" }
                          : { backgroundColor: "transparent" }
                      }
                    >
                      <MdOutlineTagFaces className="me-3" size={28} />
                      Spectactor
                    </ToggleButton>
                  </ToggleButtonGroup>
                )}
              </div>
              <div className="row py-3">
                <div className="col-sm-5 offset-sm-1">
                  <Button
                    className="w-100 fw-bold mb-3 btn-primary"
                    onClick={join}
                    disabled={!(roomId && user?.name)}
                  >
                    JOIN
                  </Button>
                </div>
                <div className="col-sm-5 ">
                  <Button
                    className="w-100 fw-bold mb-3 btn-danger"
                    onClick={cancel}
                  >
                    CANCEL
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JoinRoom;
