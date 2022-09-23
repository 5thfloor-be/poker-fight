import {NextPage} from 'next';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {io} from 'socket.io-client';
import Card from '../../components/Card';
import User, {Role} from '../api/model/user';
import RoomModel, {States} from '../api/model/room';
import {GiCardRandom} from 'react-icons/Gi';
import {Deck} from "../../components/Deck";
import Modal from 'react-bootstrap/Modal';
import {Button} from "react-bootstrap";

const Room: NextPage = () => {
  const socket = io();
  const router = useRouter();
  const roomId = router.query.id;

  const me = new User('20', {name: 'Gab', color: '#008000', role: Role.SCRUM_MASTER});

  const pedro = new User('10', {name: 'Pedro', color: '#ffff00', role: Role.DEV});
  const estef = new User('30', {name: 'Estef', color: '#ffc0cb', role: Role.DEV});
  const tbo = new User('40', {name: 'Tbo', color: '#ffa500', role: Role.DEV});
  const alex = new User('50', {name: 'Alex', color: '#ffc0cb', role: Role.DEV});
  const mathieu = new User('60', {name: 'Mathieu', color: '#808080', role: Role.DEV});
  const renaud = new User('70', {name: 'Renaud', color: '#0000ff', role: Role.DEV});
  const rachel = new User('80', {name: 'Rachel', color: '#808080', role: Role.DEV});
  const michou = new User('90', {name: 'Michou', color: '#ff0000', role: Role.DEV});
  const jerry = new User('100', {name: 'Jerry', color: '#0000ff', role: Role.DEV});

  const [room, setRoom] = useState<RoomModel>();
  console.log('roomId', roomId);

  if (roomId !== '' && !room) {
    console.log(`joining ${roomId}`)
    socket.emit('join_room', {roomId, userInfo: me});
  }

  useEffect(() => {
    socket.on('reveal', (data) => {
      console.log('reveeeeeeeal', data);

    });
    socket.on('start-voting', data => {
      console.log('startVotiiiiing', data);
      setRoom(data);
    });
    socket.on('room_state_update', r =>{
      console.log('room state update received ', r)
      setRoom(r);
    })
  }, [socket]);

  const cardValues: any = [1, 2, 3, 5, 8, 13];


  const [selecedIndex, setSelectedIndex] = useState(-1);
  const updateSelection = (newIndex: number) => {
    console.log('room ' + newIndex);
    setSelectedIndex(newIndex)
    setShow(false)
  }
  // get room from server
  const startVoting = () => {
    console.log('start voting: Change status room to voting');
    socket.emit('start-voting', { roomId }, (r) => setRoom(r));
  }

  const reveal = () => {
    console.log('reveal: Change status room to voted');
    socket.emit('reveal', {roomId}, (r) => {
      console.log('room', r);
      setRoom(r);
    });
  }

  const redoVote = () => {
    console.log('redo vote: Change status vote to voting');
  }

  const validate = () => {
    console.log('Validate: Add points and change status room to voting');
  }

  //modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  if(!room){
    return (
        <div className="bg-light"> <h1>Room does not exist</h1></div>
    );
  }

  return (

      <div className="container">
        <div className="row">
          {
            room.users.map((user, key) =>
                <div key={key} className="col">
                  <Card value={undefined}
                        canClose={(me.userInfo.role === Role.SCRUM_MASTER || me.userInfo.role === Role.VOTING_SCRUM_MASTER)} color={user.userInfo.color}
                        name={user.userInfo.name}/>
                </div>
            )
          }
        </div>
        <div className="row my-3">
          {(me.userInfo.role === Role.SCRUM_MASTER || me.userInfo.role === Role.VOTING_SCRUM_MASTER)
              && room.state === States.STARTING
              && <div className='offset-3 col-6 offset-sm-5 col-sm-2'>
                <button type='button' className='btn btn-primary fw-bold w-100'
                        onClick={startVoting}>VOTE
                </button>
              </div>}
        </div>
        <div className="row my-3">
          {(me.userInfo.role === Role.SCRUM_MASTER || me.userInfo.role === Role.VOTING_SCRUM_MASTER)
              && room.state === States.VOTING
              && <>
                <div className='offset-1 col-5 offset-sm-4 col-sm-2'>
                  <button type='button' className='btn btn-primary fw-bold w-100'
                          onClick={reveal}>REVEAL
                  </button>

                </div>
                <div className='col-5 col-sm-2'>
                  <button type='button' className='btn btn-primary fw-bold w-100'
                          onClick={redoVote}>REDO VOTE
                  </button>
                </div>
              </>}
          {(me.userInfo.role === Role.SCRUM_MASTER || me.userInfo.role === Role.VOTING_SCRUM_MASTER) && room.state === States.VOTED &&
              <>
                <div className='offset-1 col-5 offset-sm-4 col-sm-2'>
                  <button type='button' className='btn btn-primary fw-bold w-100'
                          onClick={validate}>VALIDATE
                  </button>

                </div>
                <div className='col-5 col-sm-2'>
                  <button type='button' className='btn btn-primary fw-bold w-100'
                          onClick={redoVote}>REDO VOTE
                  </button>
                </div>
              </>
          }
          <div className="row">
            <div className="col text-center text-xl-center mt-sm-5 mb-sm-5">
              <button className="btn btn-lg btn-primary">
                <h1>{selecedIndex != -1 ? selecedIndex : 'Waiting for votes ...'}</h1>
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col d-none d-sm-block">
              {
                <Deck deck={cardValues} updateSelection={updateSelection}/>
              }
            </div>
          </div>
          <div className="row d-sm-none mt-5 mt-sm-0 ">
            {
              <div className="col text-center h-100">
                <button className="btn btn-lg btn-light rounded-5 fw-bold" onClick={handleShow}>
                  <h1><GiCardRandom/></h1>
                </button>
              </div>
            }
          </div>
        </div>
        <Modal
            centered={true}
            contentClassName="bg-dark"
            show={show}
        >
          <Modal.Header style={{border: "none"}}>
            <Modal.Title className="w-100">
              <p className="text-white text-center">CHOOSE CARD</p>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="container">
              <div className="row">
                <Deck deck={cardValues} updateSelection={updateSelection}/>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer style={{border: "none"}}>
            <div className="container">
              <div className="row">
                <div className="sm-6">
                  <Button
                      className="w-100 mb-3"
                      variant="danger"
                      onClick={handleClose}
                  >
                    CANCEL
                  </Button>
                </div>
              </div>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
  )
}


export default Room;


