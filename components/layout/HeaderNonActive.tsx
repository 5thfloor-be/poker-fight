import Image from "next/image";
import { useEffect, useState, useContext } from "react";
import { MdAccountCircle } from "react-icons/md";
import { UserContext } from "../../context/UserContext";
import EditProfile from "../EditProfile";

const HeaderNonActive = () => {
  const [widthScreen, setWidthScreen] = useState(0);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const { user } = useContext(UserContext);

  useEffect(() => {
    setWidthScreen(window.innerWidth);
  }, []);

  return (
    <>
      <div className="container mx-0 mw-100">
        <div
          className="row text-center"
          style={widthScreen < 576 ? { paddingTop: 0 } : { paddingTop: 40 }}
        >
          <div className="col-10 col-sm-10">
            <Image
              src="/images/logo-project.png"
              width={widthScreen / 2}
              height="100%"
              alt="logo"
            />
          </div>
          <div className="col-2 col-sm-2 px-1 text-center">
            <MdAccountCircle
              color={user ? user.color : "#ffffff"}
              onClick={() => {
                setShowEditProfile(!showEditProfile);
              }}
              size={60}
            />
            {showEditProfile && (
              <EditProfile
                showEditProfile={showEditProfile}
                setShowEditProfile={() => setShowEditProfile(true)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderNonActive;
