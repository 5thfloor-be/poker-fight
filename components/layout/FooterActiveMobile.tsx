import type { NextPage } from "next";
import { useContext } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../../context/UserContext";
import styles from "../../styles/Footer.module.css";
import { IoExitOutline } from "react-icons/io5";

const FooterActiveMobile: NextPage = () => {
  const { isRoomActive, setIsRoomActive, user, setUser, room } =
    useContext(UserContext);

  const path = useRouter();

  const quitHandler = () => {
    setIsRoomActive(false);
    setUser({ ...user, role: "" });
    path.push("/");
  };

  return (
    <>
      {isRoomActive && (
        <footer className={styles.containeractivefooter}>
          <div className="container d-sm-none mx-0 mw-100 pb-3">
            <div className="row">
              {room && room.roomOptions.targetPoints && (
                <div className="col-10 px-1">
                  <button
                    className="btn btn-success rounded-5 form-control fw-bold opacity-100"
                    disabled
                  >
                    Score : {room.currentPoints ? room.currentPoints : 0} /
                    {room.roomOptions.targetPoints}
                  </button>
                </div>
              )}
              <div className="col-2 px-2">
                <button onClick={quitHandler} className="btn btn-danger">
                  <IoExitOutline color="white" size={20} />
                </button>
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export default FooterActiveMobile;
