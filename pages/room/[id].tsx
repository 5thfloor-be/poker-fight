import {NextPage} from 'next';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {io} from 'socket.io-client';
import Card from '../../components/Card';
import User, {Role} from '../api/model/user';
import RoomModel, {States} from '../api/model/room';
import {GiCardRandom} from 'react-icons/gi';
import {Deck} from '../../components/Deck';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { getStorageValue } from '../../components/UseLocalStorage';

const Room: NextPage = () => {
  const socket = io();
  const router = useRouter();
  const roomId = router.query.id;

  const [myUser, setMyUser] = useState<User>(getStorageValue('USER', null));

  const [room, setRoom] = useState<RoomModel>();
  console.log('roomId', roomId);

  if (roomId !== '' && !room) {
    console.log(`displaying room ${roomId}`)
    socket.emit('get_room', {roomId: roomId}, (room: RoomModel) => setRoom(room));

    console.log(`joining ${roomId}`)

    if (!myUser?.id) {
      socket.emit('join_room', {roomId, userInfo: myUser},
        (id: string) => {
          console.log('my user id : ', myUser)
          setMyUser({...myUser, id: id})
        }
      );
    }
  }

  useEffect(() => {
    socket.on('reveal', (data) => {
      console.log('reveeeeeeeal', data);
      setRoom(data);
      setShow(false);
    });
    socket.on('start-voting', data => {
      console.log('startVotiiiiing', data);
      setSelectedVote(-1);
      setRoom(data);
    });
    socket.on('room_state_update', r => {
      console.log('room state update received ', r)
      setRoom(r);
      if (room?.state === States.FIGHTING) {
        // router.push(`versus/${data.roomId}`);
      }
    });
  }, [socket]);

  const cardValues: any = [1, 2, 3, 5, 8, 13];

  const [selectedVote, setSelectedVote] = useState(-1);
  const updateSelection = (chosenVote: number) => {
    console.log('my vote : ' + chosenVote);
    setSelectedVote(chosenVote);
    setShow(false);
    socket.emit('vote', {roomId: roomId, userId: myUser?.id, vote: chosenVote},
      (room: any) => {
        console.log('room in listener : ', room)
      }
    );
  }
  // get room from server
  const startVoting = () => {
    console.log('start voting: Change status room to voting');
    socket.emit('start-voting', { roomId }, (r: any) => setRoom(r));
  }

  const reveal = () => {
    console.log('reveal: Change status room to voted');
    socket.emit('reveal', {roomId}, (r: any) => {
      console.log(room?.currentVotes);
      console.log('room', r);
      setRoom(r);
    });
  }

  const redoVote = () => {
    console.log('redo vote: Change status vote to voting');
    socket.emit('redo_vote', {roomId}, (r: any) => {
      console.log('room', r);
      setRoom(r);
    });
  }

  const validate = () => {
    console.log('Validate: Add points and change status room to voting');
  }

  const getVoteByUserId = (userId: string) => {
    return room?.currentVotes.filter(userVote => userVote.userId === userId).at(0)?.vote ?
        Number(room?.currentVotes.filter(userVote => userVote.userId === userId).at(0)?.vote) :
        undefined;
  };

  //modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  if(!room){
    return (
        <div className="bg-light"> <h1>Room does not exist</h1></div>
    );
  }

  const showBottomDeck = () => {
    return (
        <>
          {
            room.state === States.WONDROUS &&
                <Card selected={false} canClose={false} value={selectedVote} />
          }
          {
            room.state === States.VOTING &&
                <Deck deck={cardValues} updateSelection={updateSelection}/>
          }
        </>
    )
  }

  return (

      <div className="container">
        <div className="row">
          {
            room.users.filter(u => u?.id !== myUser?.id).map((user, key) =>
                <div key={key} className="col">
                  <Card value={room?.state === States.WONDROUS && !!user.id ? getVoteByUserId(user.id) : undefined}
                        canClose={(myUser.role === Role.SCRUM_MASTER || myUser.role === Role.VOTING_SCRUM_MASTER)} color={user.color}
                        name={user.name}  selected={!!user.id && !!getVoteByUserId(user.id)}/>
                </div>
            )
          }
        </div>
        <div className="row my-3">
          {(myUser?.role === Role.SCRUM_MASTER || myUser?.role === Role.VOTING_SCRUM_MASTER)
              && room.state === States.STARTING
              && <div className='offset-3 col-6 offset-sm-5 col-sm-2'>
                <button type='button' className='btn btn-primary fw-bold w-100'
                        onClick={startVoting}>VOTE
                </button>
              </div>}
        </div>
        <div className="row my-3">
          {(myUser?.role === Role.SCRUM_MASTER || myUser?.role === Role.VOTING_SCRUM_MASTER)
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
          {(myUser?.role === Role.SCRUM_MASTER || myUser?.role === Role.VOTING_SCRUM_MASTER) && room.state === States.WONDROUS &&
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
                <h1>{room.state === States.WONDROUS ? room.wondrousVote : 'Waiting for votes ...'}</h1>
              </button>
            </div>
          </div>

          {(myUser?.role !== Role.SCRUM_MASTER) &&
            <>
              <div className="row">
                <div className="col d-none d-sm-block justify-content-center">
                  {showBottomDeck()}
                </div>
              </div>
              <div className="row d-sm-none mt-5 mt-sm-0 ">
                {
                  room.state === States.VOTING &&
                  <div className="col text-center h-100">
                    <button className="btn btn-lg btn-light rounded-5 fw-bold" onClick={handleShow}>
                      <h1><GiCardRandom/></h1>
                    </button>
                  </div>
                }
              </div>
            </>
          }

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


