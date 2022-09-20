import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Card from '../../components/Card';
import { States } from '../api/model/room';
import User, { Role } from '../api/model/user';

const Room: NextPage = () => {
    const socket = io();

    const pedro = new User('10', { name: 'Pedro', color: '#ffff00', role: Role.DEV });
    const estef = new User('30', { name: 'Estef', color: '#ffc0cb', role: Role.DEV });
    const tbo = new User('40', { name: 'Tbo', color: '#ffa500', role: Role.DEV });
    const alex = new User('50', { name: 'Alex', color: '#ffc0cb', role: Role.DEV });
    const mathieu = new User('60', { name: 'Mathieu', color: '#808080', role: Role.DEV });
    const renaud = new User('70', { name: 'Renaud', color: '#0000ff', role: Role.DEV });
    const rachel = new User('80', { name: 'Rachel', color: '#808080', role: Role.DEV });
    const michou = new User('90', { name: 'Michou', color: '#ff0000', role: Role.DEV });
    const jerry = new User('100', { name: 'Jerry', color: '#0000ff', role: Role.DEV });
    
    const [room, setRoom] = useState({
        users: [pedro, estef, tbo, alex, mathieu, renaud, rachel, michou, jerry],
        modified: new Date(),
        coffeBreak: new Map([]),
        buzzer: new Map([]),
        currentVotes: new Map([]),
        state: States.STARTING,
        currentPoints: 0,
        callback: {}
    });

    const router = useRouter();
    const roomId = router.query.id;

    const me = new User('20', { name: 'Gab', color: '#008000', role: Role.SCRUM_MASTER });
    console.log('roomId', roomId);
    
    if (roomId !== '') {
        socket.emit('join_room', {roomId, userInfo: me});
    }

    useEffect(() => {
        socket.on('reveal', (data) => {
          console.log('reveeeeeeeal', data);
          
        });
        socket.on('start-voting', data => {
            console.log('startVotiiiiing', data);
            setRoom(data);
        })
      }, [socket]);

    const cardValues = [1, 2, 3, 5, 8, 13];

    const startVoting = () => {
        console.log('start voting: Change status room to voting');
        socket.emit('start-voting', { roomId }, (r) => setRoom(r));
    }
    
    const reveal = () => {
        console.log('reveal: Change status room to voted');
        socket.emit('reveal', { roomId }, (r) => {
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

    return (
        <div className="container">
            <div className="row">
                {
                    room.users.map((user, key) =>
                        <div key={key} className="col">
                            <Card value={undefined} canClose={false} color={user.userInfo.color} />
                            <h1>{user.userInfo.name}</h1>
                        </div>
                    )
                }
            </div>
            <div className="row my-3">
                {(me.userInfo.role === Role.SCRUM_MASTER || me.userInfo.role === Role.VOTING_SCRUM_MASTER) 
                    && room.state === States.STARTING 
                    && <div className='offset-3 col-6 offset-sm-5 col-sm-2'>
                        <button type='button' className='btn btn-primary fw-bold w-100'
                            onClick={startVoting}>VOTE</button>
                </div>}
            </div>
            <div className="row my-3">
                {(me.userInfo.role === Role.SCRUM_MASTER || me.userInfo.role === Role.VOTING_SCRUM_MASTER) 
                    && room.state === States.VOTING 
                    && <>
                        <div className='offset-1 col-5 offset-sm-4 col-sm-2'>
                            <button type='button' className='btn btn-primary fw-bold w-100'
                                onClick={reveal}>REVEAL</button>
                            
                        </div>
                        <div className='col-5 col-sm-2'>
                            <button type='button' className='btn btn-primary fw-bold w-100'
                                    onClick={redoVote}>REDO VOTE</button>
                        </div>
                    </>}
                {(me.userInfo.role === Role.SCRUM_MASTER || me.userInfo.role === Role.VOTING_SCRUM_MASTER) && room.state === States.VOTED && 
                <>
                     <div className='offset-1 col-5 offset-sm-4 col-sm-2'>
                        <button type='button' className='btn btn-primary fw-bold w-100'
                            onClick={validate}>VALIDATE</button>
                        
                    </div>
                    <div className='col-5 col-sm-2'>
                        <button type='button' className='btn btn-primary fw-bold w-100'
                                onClick={redoVote}>REDO VOTE</button>
                    </div>
                </>
                }
            </div>
            <div className="row d-none d-sm-inline-flex">
                {
                    cardValues.map((cardValue, key) =>
                        <div key={key} className="col">
                            <Card value={cardValue} canClose={false} color={""} />
                        </div>
                    )
                }
            </div>
            <div className="row d-sm-none">
                {
                    <div className="col text-center h-100">
                        <button className="btn btn-light rounded-5 fw-bold">
                            {/*<GiCardRandom />*/}
                        </button>

                    </div>
                }
            </div>
            <br /><br /><br /><br /><br /><br />
        </div>
    )
}

export default Room;