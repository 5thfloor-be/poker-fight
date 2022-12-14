import { Button, Modal } from "react-bootstrap";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";
import { ImProfile } from "react-icons/im";

type PrivacyProps = {
  setShowPrivacy: (val: any) => void;
};

const ModalPrivacy = (props: PrivacyProps) => {
  const cancel = () => props.setShowPrivacy(false);

  return (
    <div>
      <Modal
        size="lg"
        centered={true}
        contentClassName="bg-dark"
        show={true}
        onHide={cancel}
      >
        <Modal.Header style={{ border: "none" }}>
          <Modal.Title className="w-100">
            <h1 className="text-white text-center">
              PRIVACY POLICY OF POKER-FIGHT.COM
            </h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col text-white">
                <p>This Website collects some Personal Data from its Users.</p>
                <p className="fs-5">
                  Personal Data collected for the following purposes and using
                  the following services:
                </p>
                <p className="fs-6 ms-3">
                  <TbDeviceDesktopAnalytics size={40} className="me-2" />
                  Analytics
                </p>
                <p className="fw-bold ms-3 mb-0">Matomo - Private instance</p>
                <p className="ms-3 mb-0">
                  Anonymized audience tracking (origin of visitor, generic
                  device information, actions of visitor and geolocalisation)
                </p>
                <p className="ms-3 ">Non-commercial use data.</p>
                <p className="fs-5 pt-2">Contact information</p>
                <p className="fs-6 ms-3">
                  <ImProfile size={30} className="me-2" />
                  Owner and Data Controller
                </p>
                <p className="fs-6 ms-3">
                  5th Floor Software
                  <br />
                  rue des Wallons, 238
                  <br />
                  4000 Liège
                  <br />
                  Belgium
                  <br />
                  <br />
                  <span className="fw-bold">Owner contact email:</span>
                  <span> privacy@5thfloor.be</span>
                </p>
                <p className="fs-6 fw-lighter pt-3 mb-0">
                  Latest update: December 13, 2022
                </p>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ border: "none" }}>
          <div className="container">
            <div className="row">
              <div className="col-sm-6 offset-sm-3">
                <Button
                  className="w-100 fw-bold mb-1 mb-sm-3 btn-danger"
                  onClick={cancel}
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

export default ModalPrivacy;
