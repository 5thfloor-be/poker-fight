import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { MdOutlineCheck } from "react-icons/md";
import { UserContext } from "../../context/UserContext";
import { IoExitOutline } from "react-icons/io5";

const HeaderActive = () => {
  const { isRoomActive, setIsRoomActive, user, setUser, room } =
    useContext(UserContext);
  const path = useRouter();
  const router = useRouter();
  const [widthScreen, setWidthScreen] = useState(0);
  const urlValue = "https://www.poker-fight.com/room/" + router.query.id;
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setWidthScreen(window.innerWidth);
  }, []);

  const quitHandler = () => {
    setIsRoomActive(false);
    setUser({ ...user, role: "" });
    path.push("/");
  };

  return (
    <>
      {room && room.id && (
        <div className="container mx-0 mw-100 mb-2">
          <div
            className="row text-center"
            style={widthScreen < 576 ? { paddingTop: 0 } : { paddingTop: 30 }}
          >
            <div className="col-8 offset-2 ps-1 pt-2 pt-sm-1 col-sm-3 offset-sm-0">
              <Image
                src="/images/logo-project.png"
                width={300}
                height={60}
                alt="logo"
              />
            </div>

            <div className="col-12 col-sm-4 mx-0 px-0 pt-sm-2 d-none d-sm-block">
              {isRoomActive && (
                <div className="input-group w100">
                  <input
                    disabled
                    className="text-center rounded-2 form-control mx-1 mx-sm-3"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
                    type="text"
                    value={urlValue.substring(12)}
                  />

                  {!showAlert ? (
                    <button
                      className=" btn btn-primary rounded-2 px-sm-3 fw-bold"
                      onClick={() => {
                        navigator.clipboard.writeText(urlValue);
                        setShowAlert(!showAlert);
                      }}
                    >
                      COPY URL
                    </button>
                  ) : (
                    <button
                      disabled
                      className=" btn btn-success rounded-2 px-sm-3 opacity-100 fw-bold"
                    >
                      <MdOutlineCheck color="white" className="me-1" />
                      COPIED
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="d-none d-sm-block col-sm-3 ps-5  pt-2">
              {isRoomActive && room && room.roomOptions.targetPoints && (
                <div className="text-center">
                  <button
                    className={
                      room.currentPoints >= room.roomOptions.targetPoints
                        ? "btn btn-success rounded-2 form-control fw-bold opacity-100"
                        : "btn btn-outline-success text-white rounded-2 form-control fw-bold opacity-100"
                    }
                    disabled
                  >
                    SCORE : {room.currentPoints ? room.currentPoints : 0} /{" "}
                    {room.roomOptions.targetPoints}
                  </button>
                </div>
              )}
            </div>
            <div className="d-none d-sm-block px-3 col-sm-1">
              {isRoomActive && (
                <button onClick={quitHandler} className="btn btn-danger mt-1">
                  <IoExitOutline color="white" size={30} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderActive;
