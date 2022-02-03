import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'
import { io } from "socket.io-client"
import axios from 'axios';
import MakeNickname from '../src/components/makeNickname'
import Room from '../src/components/room'
import WaitPlayer2 from '../src/components/waitPlayer2'
import Chat from '../src/components/chat'
import Janggi12Game from '../src/components/janggi12Game'

export default function Home() {
  const [socket, setSocket] = useState();
  const [nickname, setNickname] = useState();
  const [otherSocketId, setOtherSocketId] = useState();
  const [otherNickname, setOtherNickname] = useState();
  const [room, setRoom] = useState();
  const [myTurn, setMyTurn] = useState();
  const [allReady, setAllReady] = useState(false);

  useEffect(() => {
    const _socket = io(process.env.NEXT_PUBLIC_SERVER);
    _socket.on("connect", () => {
      setSocket(_socket);
    })

    return (() => {
      setSocket();
      setNickname();
    })
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on("disconnectReply", (obj) => {
        if (otherSocketId === obj.socketId) {
          setOtherNickname();
          setOtherSocketId();
          setAllReady(false);
          if (myTurn === "first") {
            axios.post(process.env.NEXT_PUBLIC_API_DISCONNECT, {
              roomId: room,
              myTurn: "first"
            })
            .then(() => {
            })
            .catch(err => {
              console.log(err);
            })
          } else if (myTurn === "second") {
            setMyTurn();
            setRoom();
            axios.post(process.env.NEXT_PUBLIC_API_DISCONNECT, {
              roomId: room,
              myTurn: "second"
            })
            .then(() => {
            })
            .catch(err => {
              console.log(err);
            })
          }
        }
      })
    }
  }, [otherSocketId])

  return (
    <div className = {styles.main}>
      <Head>
        <title>Board Game</title>
        <meta name="description" content="12 Janggi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!nickname && <MakeNickname setNickname={setNickname}/>}

      {nickname && !room &&
        <Room
          socket={socket}
          setRoom={setRoom}
          setMyTurn={setMyTurn}
          setOtherSocketId={setOtherSocketId}
          roomFresher = {room}
        />
      }

      {nickname && room && !otherSocketId &&
        <WaitPlayer2
          nickname={nickname}
          socket={socket}
          setOtherSocketId={setOtherSocketId}
          room={room}
          setRoom={setRoom}
        />
      }

      {nickname && room && otherSocketId && !allReady &&
        <Chat
          otherNickname={otherNickname}
          setOtherNickname={setOtherNickname}
          nickname={nickname}
          socket={socket}
          otherSocketId={otherSocketId}
          setOtherSocketId={setOtherSocketId}
          setAllReady={setAllReady}
          setRoom={setRoom}
          myTurn={myTurn}
        />
      }

      {nickname && room && otherSocketId && allReady &&
        <Janggi12Game
          allReady
          nickname={nickname}
          otherNickname={otherNickname}
          setOtherNickname={setOtherNickname}
          socket={socket}
          otherSocketId={otherSocketId}
          myTurn={myTurn}
          setAllReady={setAllReady}
        />
      }
    </div>
  )
}
