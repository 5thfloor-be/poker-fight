import { Button, Modal } from "react-bootstrap";
import { GiPartyPopper } from "react-icons/gi";
import User, { Role } from "../pages/api/model/user";

type ModalGoalScoreProps = {
  showModalGoalScore: boolean;
  setShowModalGoalScore: () => void;
  user: User;
};

const ModalGoalScore = ({
  showModalGoalScore,
  setShowModalGoalScore,
  user,
}: ModalGoalScoreProps) => {
  const canClose =
    user.role === Role.SCRUM_MASTER || user.role === Role.VOTING_SCRUM_MASTER;

  const cancel = () => setShowModalGoalScore();

  return (
    <div>
      <Modal
        size="lg"
        centered={true}
        contentClassName="bg-dark"
        show={showModalGoalScore}
        onHide={cancel}
      >
        <Modal.Header style={{ border: "none" }}>
          <Modal.Title className="w-100">
            <h1 className="text-white text-center">GOOOOOOOAL !!!</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col text-center">
                <p className="text-white">
                  Congratulations, you have reached the score goal you fixed.
                </p>
                <GiPartyPopper color="white" size={100} className="mt-3" />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ border: "none" }}>
          <div className="container">
            <div className="row">
              <div className="col-sm-6 offset-sm-3">
                {canClose && (
                  <Button
                    className="w-100 fw-bold mb-3 btn-danger"
                    onClick={cancel}
                  >
                    CLOSE
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalGoalScore;
