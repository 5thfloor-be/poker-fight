import { useState } from "react";
import { Modal } from "react-bootstrap";
import { Deck } from "./Deck";

export interface ScrumMasterActionsProps {
  minValue: number;
  maxValue: number;
  deck: number[];
  forceLow: () => void;
  forceHigh: () => void;
  redoVote: () => void;
  otherScore: () => void;
}

const ScrumMasterActions = ({
  minValue,
  maxValue,
  deck,
  forceLow,
  forceHigh,
  redoVote,
  otherScore,
}: ScrumMasterActionsProps) => {
  const [showActions, setShowActions] = useState(false);

  const toggleShowActions = () => setShowActions(!showActions);
  // const toggleShowOtherScores = () => setShowOtherScores(!showOtherScores);

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
              onClick={forceLow}
            >
              GO FOR {minValue}
            </button>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-primary w-100 fw-bold mb-3"
              onClick={forceHigh}
            >
              GO FOR {maxValue}
            </button>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-secondary w-100 fw-bold mb-3"
              onClick={() => {
                toggleShowActions();
                otherScore();
              }}
            >
              OTHER
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
