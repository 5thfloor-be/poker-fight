import { useState } from "react";
import { Modal } from "react-bootstrap";
import { Deck } from "./Deck";

export interface ScrumMasterActionsProps {
  minValue: number;
  maxValue: number;
  deck: number[];
}

const ScrumMasterActions = ({
  minValue,
  maxValue,
  deck,
}: ScrumMasterActionsProps) => {
  const [showActions, setShowActions] = useState(false);
  const [showOtherScores, setShowOtherScores] = useState(false);

  const toggleShowActions = () => setShowActions(!showActions);
  const toggleShowOtherScores = () => setShowOtherScores(!showOtherScores);

  const redoVote = () => {};

  return (
    <div>
      <Modal
        size="lg"
        centered={true}
        contentClassName="bg-dark"
        show={showActions}
        onHide={toggleShowActions}
      >
        <Modal.Header style={{ border: "none" }}>
          <Modal.Title className="w-100">
            <h1 className="text-white text-center">ACTIONS</h1>
            <h6 className="text-white text-center">
              The creator can choose different actions to close the vote
            </h6>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <button
              type="button"
              className="btn btn-primary w-100 fw-bold mb-3"
            >
              GO FOR {minValue}
            </button>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-primary w-100 fw-bold mb-3"
            >
              GO FOR {maxValue}
            </button>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-primary w-100 fw-bold mb-3"
              onClick={() => {
                toggleShowActions();
                toggleShowOtherScores();
              }}
            >
              OTHER SCORE
            </button>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-primary w-100 fw-bold mb-3"
              onClick={redoVote}
            >
              REDO VOTE
            </button>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-danger w-100 fw-bold my-3"
              onClick={toggleShowActions}
            >
              CANCEL
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal centered={true} contentClassName="bg-dark" show={showOtherScores}>
        <Modal.Header style={{ border: "none" }}>
          <Modal.Title className="w-100">
            <h1 className="text-white text-center">OTHER SCORE</h1>
            <h6 className="text-white text-center">
              Choose another vote and finish this round
            </h6>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Deck deck={deck} updateSelection={() => []} />
            <button
              type="button"
              className="btn btn-danger w-100 fw-bold my-3"
              onClick={() => {
                toggleShowActions();
                toggleShowOtherScores();
              }}
            >
              CANCEL
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <button
        type="button"
        className="btn btn-primary fw-bold w-100"
        onClick={toggleShowActions}
      >
        ACTIONS
      </button>
    </div>
  );
};

export default ScrumMasterActions;
