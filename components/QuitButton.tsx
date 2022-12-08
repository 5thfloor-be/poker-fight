import {useRouter} from "next/router";
import {useContext, useState} from "react";
import {UserContext} from "../context/UserContext";
import {IoExitOutline} from "react-icons/io5";
import {io} from "socket.io-client";
import {Modal} from "react-bootstrap";
import {Role} from "../pages/api/model/user";
import {AiOutlineAlert} from "react-icons/ai";

const QuitButton = () => {

    const { setIsRoomActive, user, setUser, room } =
        useContext(UserContext);
    const router = useRouter();
    const [show, setShow] = useState(false);

    const quit = () => {
        let socket = io({transports: ["websocket"]});
        socket.emit("remove_user", {
            userId: user.id,
            roomId: room?.id
        });
    };

    const quitButton = () =>{
        if([Role.SCRUM_MASTER, Role.VOTING_SCRUM_MASTER].includes(user.role)){
            setShow(true);
        }else{
            quit();
        }
    }

    return (
        <>
        <button onClick={quitButton} className="btn btn-danger mt-1 d-none d-sm-block">
            <IoExitOutline color="white" size={30} />
        </button>
        <div onClick={quitButton} className="w-100 h-100 d-md-none">
            QUIT ROOM <IoExitOutline color="white" size={30} />
        </div>

            <Modal
                size="lg"
                centered={true}
                contentClassName="bg-dark"
                show={show}
                className="text-center text-white "
            >
                <Modal.Header style={{ border: "none" }}></Modal.Header>
                <Modal.Body>
                    <div className="container bg-dark  ">
                        <h1>Goodbye :)</h1>
                        You are going to close the room for everyone.
                    </div>
                    <AiOutlineAlert size={100} className="mt-3" />
                </Modal.Body>
                <Modal.Footer style={{ border: "none" }}>
                    <div className="container mx-auto">
                            <button
                                onClick={quit}
                                className="btn btn-primary fw-bold mb-3 w-25"
                            >VALIDATE</button>
                        <button
                            onClick={() => setShow(false)}
                            className="btn btn-danger fw-bold mb-3 w-25"
                        >CANCEL</button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default QuitButton;