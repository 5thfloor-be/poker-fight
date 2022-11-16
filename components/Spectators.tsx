import React from "react";
import { BsEyeglasses } from "react-icons/bs";
import User from "../pages/api/model/user";

type SpectatorsProps = {
  roomSpectators: User[];
};

const Spectators = (props: SpectatorsProps) => {
  return (
    <>
      {props?.roomSpectators.length > 0 && (
        <div className="container text-center">
          <div className="row">
            <BsEyeglasses size={80} color="white" />
          </div>

          <div className="row mb-3">
            {props?.roomSpectators.map((spectator, index) => (
              <>
                <div key={index} className="fw-bold fs-4 text-white">
                  {spectator.name}
                </div>
              </>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Spectators;
