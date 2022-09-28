import { useState, useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import { MdAccountCircle } from "react-icons/md";
import { CirclePicker } from "react-color";
import { getStorageValue, setStorageValue } from "./UseLocalStorage";
import { Role } from "../pages/api/model/user";
import { UserContext } from "../context/UserContext";

type CreateRoomProps = {
  showCreateRoom: boolean;
  setShowCreateRoom: (val: any) => void;
  setShowCreateRoomEdition: (val: any) => void;
};

const CreateRoom = (props: CreateRoomProps) => {
  const [showCreateRoom, setShowCreateRoom] = useState(props.showCreateRoom);

  const [checked, setChecked] = useState(false);

  const { user, setUser } = useContext(UserContext);

  const handleChangeCheckbox = () => {
    setChecked(!checked);
  };

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
    setUser({
      ...user,
      role: checked ? Role.VOTING_SCRUM_MASTER : Role.SCRUM_MASTER,
    });
    setShowCreateRoom(false);
    props.setShowCreateRoomEdition(true);
  };

  const cancel = () => setShowCreateRoom(false);

  return (
    <>
      <Modal
        size="lg"
        centered={true}
        contentClassName="bg-dark"
        show={showCreateRoom}
        onHide={cancel}
      >
        <Modal.Header style={{ border: "none" }}>
          <Modal.Title className="w-100">
            <p className="text-white text-center">CREATE ROOM</p>
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
                    onChange={(e) => {
                      setUser({ ...user, name: e.target.value });
                    }}
                  />
                </div>
              </div>
              <div className="col-sm-6 text-center mt-3">
                <div className="offset-3 offset-sm-2">
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
              <div className="col">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={handleChangeCheckbox}
                ></input>
                <label className="text-white ps-2">Can vote</label>
                <p>
                  <span className="text-white">
                    (check the box if the Scrum Master can vote too)
                  </span>
                </p>
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

export default CreateRoom;
