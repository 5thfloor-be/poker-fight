import { useEffect, useState } from 'react'
import io from 'Socket.IO-client'
let socket;

const Home = () => {
    const [input, setInput] = useState('')

    useEffect(() => () =>{
        fetch('/api/socket');
        socket = io()
        socket.emit('create_room', (id: string) =>{
            console.log(id)
        });

        socket.on('connect', () => {
            console.log('connected')
        })

        socket.on('room_created', (data) => {

        })

        socket.on('update-input', msg => {
            setInput(msg)
        })
    }, [])


    const onChangeHandler = (e) => {
        setInput(e.target.value)
        socket.emit('input-change', e.target.value)
    }

    return (
        <input
            placeholder="Type something"
    value={input}
    onChange={onChangeHandler}
    />
)
}

export default Home;