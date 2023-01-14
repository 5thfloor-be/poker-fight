import { ErrorCode } from "../api/model/ErrorCode";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { matomo } from "../_app";
import logoProject from "../../public/images/logo-project-happy.webp";

const errorMessages = new Map<ErrorCode, String>([
  [ErrorCode.TOO_MANY_VOTERS, "Sorry, the room is full (already 9 voters)."],
  [ErrorCode.ROOM_NOT_EXISTS, "Sorry, the room number doesn't exist."],
  [ErrorCode.ROOM_CLOSED, "The room has been closed."],
  [ErrorCode.ROOM_ALREADY_EXISTS, "The room alreday exists."],
]);

const ErrorPage = () => {
  if (typeof window !== "undefined") {
    matomo("analyticsError");
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
    <div className="d-flex align-items-center min-vh-100">
      <div className="container bg-dark p-5 h-100 rounded-4">
        <div className="row align-content-center justify-content-center mt-3">
          <div className="col-12 text-white text-center">
            <a onClick={() => goHome()}>
              <Image
                loading="eager"
                src={logoProject}
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
            <a
              href="https://www.poker-fight.com"
              className="btn btn-primary btn-lg fw-bold"
            >
              BACK TO HOME PAGE
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
