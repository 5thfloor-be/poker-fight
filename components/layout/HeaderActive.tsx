import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { MdAccountCircle, MdOutlineCheck } from "react-icons/md";
import { UserContext } from "../../context/UserContext";
import EditProfile from "../EditProfile";
import { getStorageValue } from "../UseLocalStorage";

const HeaderActive = () => {
  const { isRoomActive, setIsRoomActive, user, setUser } =
    useContext(UserContext);
  const path = useRouter();
  const router = path.query;

  /*   const [user, setUser] = useState(
    getStorageValue("USER", { name: "", color: "#ffffff" })
  ); */

  const [showEditProfile, setShowEditProfile] = useState(false);

  const [widthScreen, setWidthScreen] = useState(0);
  const [urlValue, setUrlValue] = useState(
    "http://poker-fight.be/room/aid777jdjfdhjkds_"
  );
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
    <div>
      <div className="container mx-0 mw-100">
        <div
          className="row text-center"
          style={widthScreen < 576 ? { paddingTop: 0 } : { paddingTop: 40 }}
        >
          <div className="col-10 ps-1 pt-2 pt-sm-0 col-sm-3 ">
            <Image
              src="/images/logo-project.png"
              width={300}
              height={60}
              alt="logo"
            />
          </div>
          <div className="col-2 d-sm-none px-1 text-center">
            <MdAccountCircle size={60} color={user ? user.color : "#ffffff"} />
          </div>
          <div className="col-12 col-sm-4 mx-0 px-0 pt-2">
            {isRoomActive && (
              <div className="input-group w100">
                <input
                  disabled
                  className="rounded-5 form-control mx-1 mx-sm-3"
                  type="text"
                  value={urlValue}
                />

                {!showAlert ? (
                  <button
                    className=" btn btn-primary rounded-5 px-sm-3"
                    onClick={() => {
                      navigator.clipboard.writeText(urlValue);
                      setShowAlert(!showAlert);
                    }}
                  >
                    Copy
                  </button>
                ) : (
                  <button
                    disabled
                    className=" btn btn-success rounded-5 px-sm-3 opacity-100"
                  >
                    <MdOutlineCheck color="white" className="me-1" />
                    Copied
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="d-none d-sm-block col-sm-3 ps-5  pt-2">
            {isRoomActive && (
              <div className="text-center">
                <button
                  className=" btn btn-success rounded-5 form-control fw-bold opacity-100"
                  disabled
                >
                  Nombre de points: 20/60
                </button>
              </div>
            )}
          </div>
          <div
            className="d-none d-sm-block px-3 col-sm-1"
            style={{ textAlign: "right" }}
          >
            <div className="col-sm-6">
              <EditProfile
                showEditProfile={showEditProfile}
                setShowEditProfile={() => setShowEditProfile(true)}
              />
              {isRoomActive && (
                <button onClick={quitHandler} className="btn btn-danger mt-1">
                  Quit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderActive;