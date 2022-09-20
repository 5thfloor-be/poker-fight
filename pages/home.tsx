import { useEffect, useState, useCallback } from 'react'
import io from 'Socket.IO-client'
const Home = () => {
    const [roomId, setRoomId] = useState('')
    const [socket, setSocket] = useState(io())

    useEffect(() => () =>{
        fetch('/api/socket');
        socket.on('room_state_update', (data) => {
            console.log("room state update received")
            console.log(data)
        })

    }, [])

    const createRoom = useCallback(() => {
        socket.emit('create_room',
            {userInfo: {name: "pol"}},
            (id: string) => {
                console.log(id)
                setRoomId(id)
            })
    }, [])


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