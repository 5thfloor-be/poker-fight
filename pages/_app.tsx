import '../styles/globals.css'
import type { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Modal, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { MdAccountCircle } from "react-icons/md";
import { getStorageValue, setStorageValue } from "./useLocalStorage";
import { CirclePicker } from 'react-color';
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return <Component {...pageProps} />
}

export default MyApp

export function EditProfile() {
    const colors = new Map<string, string>([
        ["#0000ff", "blue"],
        ["#ffffff", "white"],
        ["#008000", "green"],
        ["#ffff00", "yellow"],
        ["#ffc0cb", "pink"],
        ["#ff0000", "red"],
        ["#ffa500", "orange"],
        ["#808080", "grey"],
    ]);

    const router = useRouter();

    const [username, setUsername] = useState("");
    const [color, setColor] = useState("blue");

    const [show, setShow] = useState(false);

    const handleShow = () => {
        if (router.pathname === "/") {
            setUsername(getStorageValue("USERNAME", ""));
            setColor(getStorageValue("COLOR", "#ffffff"));
            setShow(true);
        }
    };

    const save = () => {
        setShow(false);
        setStorageValue("USERNAME", username);
        setStorageValue("COLOR", color);
    };

    const cancel = () => setShow(false);

    return (
        <>
            <MdAccountCircle color={getStorageValue("COLOR", "#ffffff")} onClick={handleShow} size={60} />

            <Modal centered={true} contentClassName="bg-dark" show={show} onHide={cancel}>
                <Modal.Header style={{ border: "none"}}>
                    <Modal.Title className="w-100">
                        <p className="text-white text-center">EDIT PROFILE</p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-6 text-center">
                                <div className="col-12">
                                    <MdAccountCircle className="mb-3" color={color} title="aze" size={60} />
                                </div>
                                <div className="col-12">
                                    <input defaultValue={username} type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                                </div>
                            </div>
                            <div className="col-sm-6 text-center mt-3">
                                <div className="offset-3 offset-sm-2">
                                    <CirclePicker className="mx-0 px-0" onChangeComplete={(color) => setColor(color.hex)} width="200px" colors={Array.from(colors.keys())} onSwatchHover={(color, event) => console.log(color)} />
                                </div>
                                <div className="col-12">
                                    <p className="text-white mt-2"> Color: { colors.get(color) }</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer style={{ border: "none"}} >
                    <Container>
                         <Row>
                             <Col sm="6">
                                 <Button className="w-100 mb-3" variant="primary" onClick={save}>SAVE</Button>
                             </Col>
                             <Col sm="6">
                                 <Button className="w-100 mb-3" variant="danger" onClick={cancel}>CANCEL</Button>
                             </Col>
                         </Row>
                     </Container>
                </Modal.Footer>
            </Modal>
        </>
    );
}
