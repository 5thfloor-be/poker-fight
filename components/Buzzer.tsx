import {Modal} from "react-bootstrap";
import {useEffect, useState} from "react";
import User, {Role} from "../pages/api/model/user";
import Room from "../pages/api/model/room";
import {BsSpeedometer2} from "react-icons/bs";
import {TbTruckDelivery} from "react-icons/tb";

export interface BuzzerProps {
    user:User,
    socket: any,
    room: Room
}

const Buzzer = ({
    user,
    socket,
    room
                     }:BuzzerProps) => {
    const [show, setShow] = useState(false);
    const [buzzerVoted, setBuzzerVoted] = useState(false)
    const canClose = user.role === Role.SCRUM_MASTER || user.role === Role.VOTING_SCRUM_MASTER;


    const cancel = () => {
        socket.emit("buzzer_canceled", {
            roomId: room.id
        })
    };

    const reveal = () => {
        socket.emit("reveal", {
            roomId: room.id
        })
    };

    const vote =() => {
        socket.emit("buzzer_vote", {
            userId :user.id,
            roomId: room.id
        })
        setBuzzerVoted(!buzzerVoted);
    }

    useEffect(() =>{
        if(show !== room.buzzerActive){
            setShow(room.buzzerActive);
            if(!show) {
                setBuzzerVoted(false);
            }
        }
    }, [room])

    return (
        <div>
            {user.role !== Role.SPECTATOR
                &&<button id="buzzerButton" onClick={() => vote()} className="btn btn-dark text-white">
                {buzzerVoted && <BsSpeedometer2 className="text-danger"/>}
                {!buzzerVoted && <BsSpeedometer2/>}

            </button>}

            <Modal
                size="lg"
                centered={true}
                contentClassName="bg-dark"
                show={show}
                onHide={() =>setBuzzerVoted(false)}
                className="text-center text-white "
            >
                <Modal.Header style={{ border: "none" }}>

                </Modal.Header>
                <Modal.Body>
                    <div className="container bg-dark  ">
                            <h1>LET'S MOVE !!!</h1>
                            Ok, it's time to accelarate the debate or to reveal the vote.
                    </div>
                    <TbTruckDelivery size={100} />
                </Modal.Body>
                <Modal.Footer style={{ border: "none" }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-lg-6">
                                {canClose && <button onClick={reveal} className="btn btn-primary fw-bold mb-3 w-100">REVEAL</button>}
                            </div>
                            <div className="col-12 col-lg-6">
                                {canClose && <button onClick={cancel} className="btn btn-danger fw-bold mb-3 w-100">CANCEL</button>}

                            </div>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Buzzer;