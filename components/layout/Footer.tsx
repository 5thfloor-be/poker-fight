import { NextPage } from "next";
import { FaLinkedinIn } from "react-icons/fa";
import Image from "next/image";
import styles from "../../styles/Footer.module.css";

const Footer: NextPage = () => {
  return (
    <footer className={styles.container}>
      <div className="text-bg-dark pt-2 mx-0 ps-2">
        <div className="container">
          <div className="row">
            <div className="col-2 col-lg-6 text-start">
              <div className="row">
                <div className="d-none d-lg-block">
                  <p>
                    info@5thfloor.be -{" "}
                    <a
                      className="text-decoration-none text-reset"
                      href="https://www.linkedin.com/company/5th-floor-software"
                      target="_blank"
                      rel="noreferrer"
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
                <div className="d-block d-lg-none">
                  <p>
                    <a
                      className="text-decoration-none text-reset "
                      href="https://www.linkedin.com/company/5th-floor-software"
                      target="_blank"
                      rel="noreferrer"
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

            <div className="col-10 col-lg-6">
              <div className="row">
                <div className="col-11 text-end ">
                  <p>Open Source Project powered by</p>
                </div>
                <div
                  className="col-1"
                  style={{ position: "relative", height: "30px" }}
                >
                  <a
                    href="https://5thfloor.be/poker-fight"
                    target="_blank"
                    rel="noreferrer"
                  >
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
      </div>
    </footer>
  );
};

export default Footer;
