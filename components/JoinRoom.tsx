import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { MdAccountCircle } from "react-icons/md";
import { CirclePicker } from "react-color";
import { setStorageValue } from "./UseLocalStorage";

type JoinRoomProps = {
  showJoinRoom: boolean;
  setShowJoinRoom: (val: any) => void;
};

const JoinRoom = (props: JoinRoomProps) => {
  const [user, setUser] = useState({
    username: "",
    color: "#ffffff",
  });
  const [showJoinRoom, setShowJoinRoom] = useState(props.showJoinRoom);

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

  const save = () => {
    setShowJoinRoom(false);
    setStorageValue("USER", user);
  };

  const cancel = () => setShowJoinRoom(false);

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
                    defaultValue={user && user.username}
                    type="text"
                    placeholder="Username"
                    onChange={(e) =>
                      setUser({ ...user, username: e.target.value })
                    }
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
                    Color: {colors.get(user && user.color)}
                  </p>
                </div>
              </div>
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
