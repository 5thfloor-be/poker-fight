import { NextPage } from "next";
import { FaLinkedinIn } from "react-icons/fa";
import Image from "next/image";
import styles from "../../styles/Footer.module.css";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import logo from "../../public/images/5thFloor-logo-white.webp";
import ModalPrivacy from "../ModalPrivacy";

const Footer: NextPage = () => {
  const { isRoomActive } = useContext(UserContext);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div className={isRoomActive ? `d-none d-sm-block` : ""}>
      <footer className={styles.container}>
        <div className="text-bg-dark pt-2 mx-0 ps-2">
          <div className="container">
            <div className="row">
              <div className="col-2 col-sm-6 text-start">
                <div className="row">
                  <div className="d-none d-sm-block">
                    <p>
                      poker-fight@5thfloor.be -{" "}
                      <span onClick={() => setShowPrivacy(!showPrivacy)}>
                        Privacy Policy
                      </span>{" "}
                      -{" "}
                      <a
                        className="text-decoration-none text-reset"
                        href="https://www.linkedin.com/company/5th-floor-software"
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => {
                          if (typeof window._paq !== "undefined") {
                            window._paq.push([
                              "trackEvent",
                              "Bouton",
                              "PC LinkedIn",
                            ]);
                          }
                        }}
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
              <div className="col-12 col-sm-6">
                <div className="row">
                  <div className="col-9 text-end px-0">
                    <p>
                      <span
                        className="d-sm-none"
                        onClick={() => setShowPrivacy(!showPrivacy)}
                      >
                        Privacy Policy -{" "}
                      </span>
                      <span className="d-none d-sm-block">
                        Open Source Project powered by
                      </span>
                      <span className="d-sm-none">Open Source Project</span>
                    </p>
                  </div>
                  <div
                    className="col-3 pe-1"
                    style={{ position: "relative", height: "30px" }}
                  >
                    <a
                      href="https://5thfloor.be/fr/poker-fight/"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => {
                        if (typeof window._paq !== "undefined") {
                          window._paq.push([
                            "trackEvent",
                            "Bouton",
                            "PC 5th Floor Link",
                          ]);
                        }
                      }}
                    >
                      <Image
                        loading="eager"
                        className="text-white"
                        src={logo}
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
        </div>
      </footer>
      {showPrivacy && (
        <ModalPrivacy setShowPrivacy={(val) => setShowPrivacy(val)} />
      )}
    </div>
  );
};

export default Footer;
