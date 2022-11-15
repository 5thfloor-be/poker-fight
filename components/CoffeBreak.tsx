import {Modal} from "react-bootstrap";
import {useEffect, useState} from "react";
import {bool} from "prop-types";
import User, {Role} from "../pages/api/model/user";
import Room from "../pages/api/model/room";

export interface CoffeBreakProps {
    user:User,
    socket: any,
    room: Room
}

const CoffeeBreak = ({
    user,
    socket,
    room
                     }:CoffeBreakProps) => {
    const [show, setShow] = useState(false);
    const canClose = user.role === Role.SCRUM_MASTER;


    const finish = () => {
        socket.emit("coffee_break_over", {
            roomId: room.id
        })
    };

    const vote =() => {
        socket.emit("cofee_break_vote", {
            userId :user.id,
            roomId: room.id
        })
    }

    useEffect(() =>{
      setShow(room.coffeeBreakActive);
    }, [room])

    return (
        <div>
            <button id = "coffeeButton" onClick={() => vote()}>
                coffee-icon
            </button>

            <Modal
                size="lg"
                centered={true}
                contentClassName="bg-dark"
                show={show}
                className="text-center text-white "
            >
                <Modal.Header style={{ border: "none" }}>

                </Modal.Header>
                <Modal.Body>
                    <div className="container bg-dark  ">
                            <h1>IT'S COFFEE TIME !!!</h1>
                            A short break to refresh the brain.
                    </div>
                </Modal.Body>
                <Modal.Footer style={{ border: "none" }}>
                    <div className="container">
                        {canClose && <button onClick={finish}>FINISH</button>}
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CoffeeBreak;