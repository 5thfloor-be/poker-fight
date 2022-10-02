import styles from "../../styles/Konami.module.css";
import { Button, Modal } from "react-bootstrap";
import Image from 'next/image';
import { FaLinkedinIn } from "react-icons/fa";

type CreditsProps = {
  showCredits: boolean;
  setShowCredits: (val: any) => void;
};

const Credits = (props: CreditsProps) => {
  const showCredits = props.showCredits;

  const close = () => props.setShowCredits(false);

  return (
    <div>
      <audio autoPlay src="/music/credits.mp3" />
      <Modal
        size="lg"
        centered={true}
        contentClassName="bg-dark"
        show={showCredits}
        onHide={close}
      >
        <Modal.Header className="py-1" style={{ border: "none" }}>
          <Modal.Title className="w-100">
            <p className="text-white text-center mb-1">Easter Credits</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col marquee text-white">
                <div className={styles.marquee}>
                  <div className={styles.credits}>
                    <p>
                      <span>
                        The Authorization team is proud to present its brand new project, Poker-Fight, we have put our hearts into it!
                      </span>
                    </p>

                    <Image alt="Team"
                           src="/images/team.png" width={100} />
                    <div className="col-12 offset-sm-4 w-100">
                      <a
                        className="text-decoration-none text-reset"
                        href="https://www.linkedin.com/in/michaeldupuy"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Image
                          alt="Michael"
                          src="/images/team/michael.png"
                          width={80}
                          height={80}
                        />
                        <span className="ms-3">
                          Michael Dupuy - Scrum Master
                        </span>

                        <span className="ms-2">
                          <FaLinkedinIn className="bg-primary" size={28} />
                        </span>
                      </a>
                      <br />
                      <br />
                      <a
                        className="text-decoration-none text-reset"
                        href="https://www.linkedin.com/in/rachel-lemon-0b75baa2/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Image
                            alt="Rachel"
                          src="/images/team/rachel.png"
                          width={80}
                          height={80}
                        />
                        <span className="ms-3">
                          Rachel Lemon - Product Owner
                        </span>
                        <span className="ms-2">
                          <FaLinkedinIn className="bg-primary" size={28} />
                        </span>
                      </a>
                      <br />
                      <br />
                      <a
                        className="text-decoration-none text-reset"
                        href="https://www.linkedin.com/in/jerry-matondo-makedika-15b19b6/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Image
                            alt="Jerry"
                          src="/images/team/jerry.png"
                          width={80}
                          height={80}
                        />
                        <span className="ms-3">
                          Jerry Matondo - Business Analyst
                        </span>
                        <span className="ms-2">
                          <FaLinkedinIn className="bg-primary" size={28} />
                        </span>
                      </a>
                      <br />
                      <br />
                      <a
                        className="text-decoration-none text-reset"
                        href="https://www.linkedin.com/in/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Image
                          alt="Thibault"
                            src="/images/team/thibault.png"
                          width={80}
                          height={80}
                        />
                        <span className="ms-3">
                          Thibault Blondeel - Developer
                        </span>
                        <span className="ms-2">
                          <FaLinkedinIn className="bg-primary" size={28} />
                        </span>
                      </a>
                      <br />
                      <br />
                      <a
                        className="text-decoration-none text-reset"
                        href="https://www.linkedin.com/in/gabriel-kaplan-0/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Image
                            alt="Gabriel"
                          src="/images/team/gabriel.png"
                          width={80}
                          height={80}
                        />
                        <span className="ms-3">Gabriel Kaplan - Developer</span>
                        <span className="ms-2">
                          <FaLinkedinIn className="bg-primary" size={28} />
                        </span>
                      </a>
                      <br />
                      <br />
                      <a
                        className="text-decoration-none text-reset"
                        href="https://www.linkedin.com/in/esthefany-astete/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Image
                            alt="Esthefany"
                          src="/images/team/esthefany.png"
                          width={80}
                          height={80}
                        />
                        <span className="ms-3">
                          Esthefany Astete - Developer
                        </span>
                        <span className="ms-2">
                          <FaLinkedinIn className="bg-primary" size={28} />
                        </span>
                      </a>
                      <br />
                      <br />
                      <a
                        className="text-decoration-none text-reset"
                        href="https://www.linkedin.com/in/mathieuraujol/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Image
                            alt="Mathieu"
                          src="/images/team/mathieu.png"
                          width={80}
                          height={80}
                        />
                        <span className="ms-3">Mathieu Raujol - Developer</span>
                        <span className="ms-2">
                          <FaLinkedinIn className="bg-primary" size={28} />
                        </span>
                      </a>
                      <br />
                      <br />
                      <a
                        className="text-decoration-none text-reset"
                        href="https://www.linkedin.com/in/alexandre-huvenne/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Image
                            alt="Alexandre"
                          src="/images/team/alexandre.png"
                          width={80}
                          height={80}
                        />
                        <span className="ms-3">
                          Alexandre Huvenne - Developer
                        </span>
                        <span className="ms-2">
                          <FaLinkedinIn className="bg-primary" size={28} />
                        </span>
                      </a>
                      <br />
                      <br />
                      <a
                        className="text-decoration-none text-reset"
                        href="https://www.linkedin.com/in/renaud-pirson-a9963aa6/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Image
                            alt="Renaud"
                          src="/images/team/renaud.png"
                          width={80}
                          height={80}
                        />
                        <span className="ms-3">Renaud Pirson - Developer</span>
                        <span className="ms-2">
                          <FaLinkedinIn className="bg-primary" size={28} />
                        </span>
                      </a>
                    </div>
                    <p className="mt-3 pt-3">
                      <span>A project made out of Pizzas...</span>
                    </p>
                    <Image alt="Pizza" src="/images/pizza.jpg" width={100} />
                    <p className="mt-3 pt-3">
                      <span>...and Retro!</span>
                    </p>
                    <Image alt="Retro" src="/images/retro.jpg" width={100} />
                    <p className="mt-3 pt-3">
                      <span>
                        We hope you will appreciate the work done and that you
                        will be able to take as much pleasure in using it as we
                        had in doing it.
                      </span>
                    </p>
                    <p className="mt-3 pt-3">
                      <span>Have fun with it !!!</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ border: "none" }}>
          <div className="container">
            <div className="row">
              <div className="col-sm-6 offset-sm-3">
                <Button
                  className="w-100 fw-bold mb-1 btn-danger"
                  onClick={close}
                >
                  CLOSE
                </Button>
              </div>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Credits;
