import { useContext, useState, useEffect } from "react";
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
import { getStorageValue, setStorageValue } from "./UseLocalStorage";
import { useRouter } from "next/router";
import { Role } from "../pages/api/model/user";
import { UserContext } from "../context/UserContext";

type JoinRoomProps = {
  showJoinRoom: boolean;
  setShowJoinRoom: (val: any) => void;
  roomId?: string;
};

const JoinRoom = (props: JoinRoomProps) => {
  const showJoinRoom = props.showJoinRoom;
  const [roomId, setRoomId] = useState(props.roomId);
  const [isDev, setIsDev] = useState(1);
  const router = useRouter();

  const { user, setUser, isRoomActive, setIsRoomActive } =
    useContext(UserContext);

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

  const save = () => {
    //Activate the active header
    setIsRoomActive(true);
    props.setShowJoinRoom(false);
    setStorageValue("USER", {
      ...user,
      role: isDev === 1 ? Role.DEV : Role.SPECTATOR,
    });
    router.push(`room/${roomId}`);
  };

  const cancel = () => props.setShowJoinRoom(false);

  const toggle = (val: number) => {
    setIsDev(val);
  };

  return (
    <div>
      <Modal
        size="lg"
        centered={true}
        contentClassName="bg-dark"
        show={showJoinRoom}
        onHide={cancel}
      >
        <Modal.Header style={{ border: "none" }}>
          <Modal.Title className="w-100">
            <p className="text-white text-center">JOIN ROOM</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
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
                    placeholder="Username"
                    required={true}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                  />
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
            <div className="row">
              <div>
                <input
                  className="w-100"
                  defaultValue={roomId || ""}
                  type="text"
                  placeholder="Room id"
                  required={true}
                  onChange={(e) => setRoomId(e.target.value)}
                />
              </div>
            </div>
            <div className="row">
              <ToggleButtonGroup
                type="radio"
                name="options"
                defaultValue={isDev}
                onChange={toggle}
                className="mt-3"
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
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ border: "none" }}>
          <div className="container">
            <div className="row">
              <div className="col-sm-6">
                <Button
                  className="w-100 fw-bold mb-3 btn-primary"
                  onClick={save}
                  disabled={roomId ? false : true}
                >
                  SAVE
                </Button>
              </div>
              <div className="col-sm-6">
                <Button
                  className="w-100 fw-bold mb-3 btn-danger"
                  onClick={cancel}
                >
                  CANCEL
                </Button>
              </div>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default JoinRoom;
