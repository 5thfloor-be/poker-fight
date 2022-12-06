import { ErrorCode } from "../api/model/ErrorCode";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { matomo } from '../_app';

const errorMessages = new Map<ErrorCode, String>([
  [ErrorCode.TOO_MANY_VOTERS, "Sorry, the room is full (already 9 voters)."],
  [ErrorCode.ROOM_NOT_EXISTS, "Sorry, the room number doesn't exist."],
]);

const ErrorPage = () => {
  if (typeof window !== "undefined") {
    matomo();
  }

  const router = useRouter();
  const errorCode = router.query.code as string;
  const { setIsRoomActive, user, setUser } = useContext(UserContext);
  setIsRoomActive(false);
  setUser({ ...user, role: "", id: "" });

  const goHome = () => {
    router.push("/");
  };

  const errorMessage = errorMessages.get(Number(errorCode));
  return (
    <div className="container bg-dark p-5 h-100">
      <div className="row align-content-center justify-content-center mt-3">
        <div className="col-12 text-white text-center">
          <a onClick={() => goHome()}>
            <Image
              src="/images/logo-project.png"
              width={300}
              height={60}
              alt="logo"
            />
          </a>
        </div>
      </div>
      <div className="row align-content-center justify-content-center mt-3">
        <div className="col-sm-8 col-12 text-white text-center">
          <h1 className="text-white">
            Oops, it seems like there was an error...
          </h1>
        </div>
      </div>
      {errorMessage && (
        <div className="row align-content-center justify-content-center mt-5 ">
          <div className="col-sm-8 col-12 text-bg-secondary text-white p-sm-5 p-3 rounded-3 text-center">
            <h3>{errorMessage}</h3>
          </div>
        </div>
      )}
      <div className="row align-content-center justify-content-center mt-5 ">
        <div className="col-sm-8 col-12 text-center">
          <button
            onClick={() => goHome()}
            className="btn btn-primary btn-lg fw-bold"
          >
            BACK TO HOME PAGE
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
