import { useEffect, useState, useCallback } from 'react'
import io from 'Socket.IO-client'
import { setStorageValue } from "../components/UseLocalStorage";
//import SocketContext from './shared/context/SocketContext'


const Home = () => {
    const [roomId, setRoomId] = useState('')
    const [socket, setSocket] = useState(io())

    //console.log("socket 2 ", {socket})

    useEffect(() => {
        console.log(`useEffect ${socket.id}`)
        socket.on('room_state_update', (data) => {
            console.log("room state update received")
            console.log(data)
            setStorageValue("ROOM", data);
        });
        socket.emit('create_room',
            {userInfo: {name: "pol"}},
            (id: string) => {
                console.log(id)
                setRoomId(id)
            });

    }, [])

    const createRoom = useCallback(() => {
        socket.emit('create_room',
            {userInfo: {name: "pol"}},
            (id: string) => {
                console.log(id)
                setRoomId(id)
            });
    }, [])

    //console.log("socket ", {socket})
    return (
        <div className="bg-light">
            <button onClick={createRoom}></button>
            <p >
                Room id : {roomId}
            </p>
            <p >
            Share this link : localhost:3000/room/{roomId}
            </p>
        </div>
)
}

export default Home;


export async function getServerSideProps(){
    console.log('xxxxxxxxx');
    await fetch('http://localhost:3000/api/socket');
    //let socket = io()
    //console.log("socket ", {socket})
    return {
        props: {
            //socket: socket
        }
    }
}