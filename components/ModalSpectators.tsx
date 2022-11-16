import { Button, Modal } from "react-bootstrap";
import User from "../pages/api/model/user";
import Spectators from "./Spectators";

type SpectatorsProps = {
  roomSpectators: User[];
  showSpectators: boolean;
  setShowSpectators: (val: any) => void;
};

const ModalSpectators = (props: SpectatorsProps) => {
  const cancel = () => props.setShowSpectators(false);

  return (
    <div>
      <Modal
        size="lg"
        centered={true}
        contentClassName="bg-dark"
        show={true}
        onHide={cancel}
      >
        <Modal.Header style={{ border: "none" }}>
          <Modal.Title className="w-100">
            <h1 className="text-white text-center">WHO IS WATCHING ?</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col text-center">
                <p className="text-white">List of the spectators</p>
                <Spectators roomSpectators={props.roomSpectators} />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ border: "none" }}>
          <div className="container">
            <div className="row">
              <div className="col-sm-6 offset-sm-3">
                <Button
                  className="w-100 fw-bold mb-3 btn-danger"
                  onClick={cancel}
                >
                  CLOSE
                </Button>
              </div>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalSpectators;
