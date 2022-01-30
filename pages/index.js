import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'
import { io } from "socket.io-client"
import MakeNickname from '../src/components/makeNickname'
import Room from '../src/components/room'
import WaitPlayer2 from '../src/components/waitPlayer2'
import Chat from '../src/components/chat'
import Janggi12Game from '../src/components/janggi12Game'

export default function Home() {
  const [socket, setSocket] = useState();
  const [nickname, setNickname] = useState();
  const [otherNickname, setOtherNickname] = useState();
  const [room, setRoom] = useState();
  const [myTurn, setMyTurn] = useState();
  const [otherSocketId, setOtherSocketId] = useState();
  const [allReady, setAllReady] = useState(false);

  // const [player1, setPlayer1] = useState();
  // const [player2, setPlayer2] = useState();
  // other player

  useEffect(() => {
    const _socket = io(process.env.NEXT_PUBLIC_SERVER);
    _socket.on("connect", () => {
      setSocket(_socket);
    })
  }, [])

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
        />
      }

      {nickname && room && !otherSocketId &&
        <WaitPlayer2
          nickname={nickname}
          socket={socket}
          setOtherSocketId={setOtherSocketId}
        />
      }

      {nickname && room && otherSocketId && !allReady &&
        <Chat
          otherNickname={otherNickname}
          setOtherNickname={setOtherNickname}
          nickname={nickname}
          socket={socket}
          otherSocketId={otherSocketId}
          setAllReady={setAllReady}
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
