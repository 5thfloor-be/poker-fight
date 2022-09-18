import { NextPage } from "next";
import { FaLinkedinIn } from "react-icons/fa";
import Image from "next/image";

const Footer: NextPage = () => {
  return (
    <footer className="text-bg-dark pt-2 mx-0 ps-2">
      <div className="container">
        <div className="row">
          <div className="col-2 col-sm-6 text-start">
            <div className="row">
              <div className="d-none d-sm-block">
                <p>
                  Rue des Wallons 238 - 4000 Liège - info@5thfloor.be -{" "}
                  <a
                    className="text-decoration-none text-reset"
                    href="https://www.linkedin.com/company/5th-floor-software"
                    target="_blank"
                  >
                    <span
                      className="p-1"
                      style={{ backgroundColor: "#0A66C2" }}
                    >
                      <FaLinkedinIn size={20} />
                    </span>{" "}
                  </a>
                </p>
              </div>
              <div className="d-block d-sm-none">
                <p>
                  <a
                    className="text-decoration-none text-reset"
                    href="https://www.linkedin.com/company/5th-floor-software"
                    target="_blank"
                  >
                    <span
                      className="p-1"
                      style={{ backgroundColor: "#0A66C2" }}
                    >
                      <FaLinkedinIn size={20} />
                    </span>{" "}
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="col-10 col-sm-6">
            <div className="row">
              <div className="col-11 text-end ">
                <p>Open Source Project powered by</p>
              </div>
              <div
                className="col-1"
                style={{ position: "relative", height: "30px" }}
              >
                <a href="https://5thfloor.be/poker-fight" target="_blank">
                  <Image
                    className="text-white"
                    src="/images/5thFloor-logo-white.png"
                    layout="fill"
                    objectFit="contain"
                    alt="logo"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
