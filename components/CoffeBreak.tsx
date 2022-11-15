import {Modal} from "react-bootstrap";
import {useEffect, useState} from "react";
import User, {Role} from "../pages/api/model/user";
import Room from "../pages/api/model/room";
import {MdCoffee, MdOutlineCoffee} from "react-icons/md";
import {CgCoffee} from "react-icons/cg";

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
    const [coffeeVoted, setCoffeeVoted] = useState(false)
    const canClose = user.role === Role.SCRUM_MASTER || user.role === Role.VOTING_SCRUM_MASTER;


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
        setCoffeeVoted(!coffeeVoted);
    }

    useEffect(() =>{
        if(show !== room.coffeeBreakActive){
            setShow(room.coffeeBreakActive);
            if(!show) {
                setCoffeeVoted(false);
            }
        }
    }, [room])

    return (
        <div>
            {user.role !== Role.SPECTATOR
                &&<button id = "coffeeButton" onClick={() => vote()} className="btn text-white">
                {coffeeVoted &&
                    <div className="bg-white rounded-circle p-2">
                        <MdCoffee color="green" size={80} />
                    </div>}
                {!coffeeVoted && 
                    <div className="bg-white rounded-circle p-2">
                        <MdOutlineCoffee color="green" size={80} />
                    </div>}

            </button>}

            <Modal
                size="lg"
                centered={true}
                contentClassName="bg-dark"
                show={show}
                onHide={() =>setCoffeeVoted(false)}
                className="text-center text-white "
            >
                <Modal.Header style={{ border: "none" }}>

                </Modal.Header>
                <Modal.Body>
                    <div className="container bg-dark  ">
                            <h1>IT'S COFFEE TIME !!!</h1>
                            A short break to refresh the brain.
                    </div>
                    <CgCoffee size={100} className="mt-3"/>
                </Modal.Body>
                <Modal.Footer style={{ border: "none" }}>
                    <div className="container">
                        {canClose && <button onClick={finish} className="btn btn-primary fw-bold mb-3 w-25">FINISH</button>}
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CoffeeBreak;
