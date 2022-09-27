import { useContext, useState } from "react";
import {
  Button,
  Modal,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import { MdAccountCircle } from "react-icons/md";
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
  const [user, setUser] = useState(
    getStorageValue("USER", { name: "", color: "#ffffff", role: Role.DEV })
  );
  const [showJoinRoom, setShowJoinRoom] = useState(props.showJoinRoom);
  const [roomId, setRoomId] = useState(props.roomId);
  const [isDev, setIsDev] = useState(1);
  const router = useRouter();

  const { isRoomActive, setIsRoomActive } = useContext(UserContext);

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
    setShowJoinRoom(false);
    setStorageValue("USER", {
      ...user,
      role: isDev === 1 ? Role.DEV : Role.SPECTATOR,
    });
    router.push(`room/${roomId}`);
  };

  const cancel = () => setShowJoinRoom(false);
  const toggle = (val: number) => {
    setIsDev(val);
  };

  return (
    <div>
      <Modal
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
                    defaultValue={user?.name}
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
                <ToggleButton id="dev" value={1}>
                  Dev
                </ToggleButton>
                <ToggleButton id="spec" value={2}>
                  Spec
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ border: "none" }}>
          <div className="container">
            <div className="row">
              <div className="sm-6">
                <Button className="w-100 mb-3" variant="primary" onClick={save}>
                  SAVE
                </Button>
              </div>
              <div className="sm-6">
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
    </div>
  );
};

export default JoinRoom;
