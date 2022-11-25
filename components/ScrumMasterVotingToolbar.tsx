import Room, { States } from "../pages/api/model/room";
import { Role } from "../pages/api/model/user";

interface ScrumMasteVotingToolbalProps {
  room: Room;
  role: Role;
  startVoting: () => void;
  redoVote: () => void;
  reveal: () => void;
  validate: () => void;
}

const ScrumMasterVotingToolbar = ({
  room,
  role,
  startVoting,
  redoVote,
  reveal,
  validate,
}: ScrumMasteVotingToolbalProps) => {
  if (![Role.VOTING_SCRUM_MASTER, Role.SCRUM_MASTER].includes(role)) {
    return <></>;
  }

  return (
    <div className="container ">
      <div className="row my-1 justify-content-center align-content-center">
        {room.state === States.STARTING &&
          room.users.filter(
            (u) => u?.role === Role.DEV || u?.role === Role.VOTING_SCRUM_MASTER
          ).length > 1 && (
            <div className="col-6 col-sm-4 text-center">
              <button
                type="button"
                className="btn btn-primary  btn-lg fw-bold"
                onClick={startVoting}
              >
                START VOTING
              </button>
            </div>
          )}
        {room.state === States.VOTING && (
          <div className="col-6 col-sm-4 text-center">
            <button
              type="button"
              className="btn btn-primary  btn-lg fw-bold "
              onClick={reveal}
            >
              REVEAL
            </button>
          </div>
        )}

        {room.state === States.WONDROUS && (
          <div className="col-6 col-sm-4 text-center">
            <button
              type="button"
              className="btn btn-primary  btn-lg fw-bold "
              onClick={validate}
            >
              VALIDATE
            </button>
          </div>
        )}

        {room.state === States.WONDROUS ||
          (room.state === States.VOTING && (
            <div className="col-6 col-sm-4 text-center">
              <button
                type="button"
                className="btn btn-danger  btn-lg fw-bold "
                onClick={redoVote}
              >
                REDO VOTE
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ScrumMasterVotingToolbar;
