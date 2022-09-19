import Image from "next/image";
import { useEffect, useState } from "react";
import EditProfile from "./EditProfile";

const HeaderNonActive = () => {
  const [widthScreen, setWidthScreen] = useState(0);

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
            <EditProfile />
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderNonActive;
