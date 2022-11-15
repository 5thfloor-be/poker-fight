import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Card from '../../../components/Card';
import { getStorageValue } from '../../../components/UseLocalStorage';
import Image from 'next/image';
import RoomModel, { States } from '../../api/model/room';
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import User from "../../api/model/user";
import ScrumMasterActions from '../../../components/ScrumMasterActions';

const Versus: NextPage = () => {
    const [widthScreen, setWidthScreen] = useState(0);
    let socket: any;
    const [stateSocket, setStateSocket] = useState();
    const router = useRouter();
    const roomId = router.query.id;
    const [room, setRoom] = useState<RoomModel>();
    const [myUser, setMyUser] = useState<User>(getStorageValue('USER', null));
    const [reload, setReload] = useState(false);

    if (stateSocket) {
        socket = stateSocket;
    } else {
        socket = io();
        setStateSocket(socket);
    }
    console.log('reload ' + roomId + '  ' + socket.id);
    if (roomId) {
		console.log(`displaying room ${roomId}`)
		socket.emit('get_room', {roomId: roomId}, (room: RoomModel) => {
            setRoom(room);
            if (room.state !== States.FIGHTING) {
                let a = router.asPath.split("/")
                a.pop();
                router.push(a.join("/"));
            }
        });
    }
    useEffect(() => {
        socket.on("room_state_update", (r: any) => {
            console.log("room state update received versus ", r);
            if (r?.state === States.STARTING) {
                router.push('/room/'+ roomId);
            }
        });
    }, [socket]);



    const lowest = () => {
        let cards = room?.currentVotes.filter(vote => vote.vote !== -1);
        let ordered = cards ? Array.from(cards?.sort((a, b) => Number(b.vote) - Number(a.vote))) : [];
        return ordered[ordered.length - 1]?.vote;
    }

    const highest = () => {
        let cards = room?.currentVotes.filter(vote => vote.vote !== -1);
        let ordered = cards ? Array.from(cards?.sort((a, b) => Number(b.vote) - Number(a.vote))) : [];
        return ordered[0]?.vote;
    }

    const forceHigh = () => {
        console.log('Force highest : ', highest());
        socket.emit(
            "validate",
            { roomId: roomId, finalVote: highest() }
        );
        console.log("Validate: Add points and change status room to voting");
        setReload(true);
    }

    const forceLow = () => {
        console.log('Force lowest : ', lowest());
            socket.emit(
                "validate",
                { roomId: roomId, finalVote: lowest() }
            );
            console.log("Validate: Add points and change status room to voting");
        };

    const redoVote = () => {
        console.log('Redo vote : ');
        socket.emit('redo_vote', {roomId});
    }

    useEffect(() => {
        // TODO implement callback
    });

    function getCards(side: String, mobile: boolean = false) {
        //TODO get room and user from local storage

        let cards = room?.currentVotes.filter(vote => vote.vote !== -1);

        let highVal = highest();
        let lowVal = lowest();

        let leftCards = cards?.filter(it => it.vote == highVal);
        let rightCards = cards?.filter(it => it.vote == lowVal);

        if (side == 'right') {
            return (
                <>
                    <div className="d-none d-sm-block">
                        <div className="d-flex flex-wrap justify-content-center gap-5">
                            {rightCards?.map((item, index) => <Card key={index} value={item.vote} name={item.userId} canClose={false}/>)}
                        </div>
                    </div>
                    <div className="d-sm-none d-block">
                        <div className="d-flex flex-wrap justify-content-center gap-5">
                            <Card value={highVal} canClose={false} badgeConfig={{
                                badgeText: '' + rightCards?.length,
                                popupText: rightCards?.map((item, index) => <div key={index}>{item.userId}</div>),
                                position: "left",
                                popupTitle: "Voters"
                            }}/>
                        </div>
                    </div>
                </>
            )
        } else {
            return (
                <>
                    <div className="d-none d-sm-block">
                        <div className="d-flex flex-wrap justify-content-center gap-5">
                            {leftCards?.map((item, index) => <Card key={index} value={item.vote} name={item.userId} canClose={false}/>)}
                        </div>
                    </div>
                    <div className="d-sm-none d-block">
                        <div className="d-flex flex-wrap justify-content-center gap-5">
                            <Card value={lowVal} canClose={false} badgeConfig={{
                                badgeText: '' + leftCards?.length,
                                popupText: leftCards?.map((item, index) => <div key={index}>{item.userId}</div>),
                                position: "right",
                                popupTitle: "Voters"}}/>
                        </div>
                    </div>
                </>
            )
        }
    }

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main>
                <div className="text-center">
                    <div className="d-sm-block d-none">
                        <h1 style={{fontSize: '50px', fontWeight: 'bold'}} className="mx-0">
                            LET&apos;S FIGHT !
                        </h1>
                    </div>
                    <h4 className="pt-2 d-sm-block d-none">Hey, it seems like we&apos;re not all aligned. Let&apos;s talk about it.</h4>
                    <h4 className="pt-5 pb-5 d-block d-sm-none">Hey, it seems like we&apos;re not all aligned. Let&apos;s talk about it.</h4>
                </div>
                <div className="container" style={{marginTop: '5%'}}>
                    <div className="row">
                        <div className="col-4">
                            <div>
                                {getCards('left')}
                            </div>
                        </div>
                        <div className="col-4">
                            <Image
                                className="text-white"
                                src="/images/versus.png"
                                layout="responsive"
                                objectFit="contain"
                                alt="logo"
                                height="200px"
                                width="400px"
                            />
                        </div>
                        <div className="col-4">
                            <div>
                                {getCards('right')}
                            </div>
                        </div>
                    </div>
                    <div className="row mt-5">
                        <div className="d-sm-none d-block offset-4 col-4">
                            <ScrumMasterActions minValue={lowest()} maxValue={highest()} deck={[1, 3, 5, 8]} />
                        </div>
                        <div className="d-none d-sm-block offset-sm-2 col-sm-2">
                            <button type='button' className='btn btn-primary fw-bold w-100' onClick={forceLow}>GO FOR {lowest()}</button>
                        </div>
                        <div className="d-none d-sm-block col-sm-2">
                            <button type='button' className='btn btn-primary fw-bold w-100' onClick={forceHigh}>GO FOR {highest()}</button>
                        </div>
                        <div className="d-none d-sm-block col-sm-2">
                            <button type='button' className='btn btn-primary fw-bold w-100' onClick={() => ''}>OTHER SCORE</button>
                        </div>
                        <div className="d-none d-sm-block col-sm-2">
                            <button type='button' className='btn btn-primary fw-bold w-100' onClick={redoVote}>REDO VOTE</button>
                        </div>
                    </div>
                </div>
                <div></div>
            </main>
        </>
    );
};

export default Versus;
