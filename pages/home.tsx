import { useEffect, useState } from 'react'
import io from 'Socket.IO-client'
let socket;
const Home = () => {
    const [roomId, setRoomId] = useState('')

    useEffect(() => () =>{
        fetch('/api/socket');
        socket = io()
        socket.emit('create_room',
            {userInfo:{name : "pol"}},
            (id: string) =>{
            console.log(id)
            setRoomId(id)
        });

        socket.on('room_state_update', (data) => {
            console.log("room state update received")
            console.log(data)
        })

    }, [])


    return (
        <div>
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