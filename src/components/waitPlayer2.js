import styles from '../../styles/Home.module.css';
import { useEffect } from "react";
import axios from 'axios';

export default function WaitPlayer2({ nickname, socket, room, setRoom, setOtherSocketId }) {
    useEffect(() => {
        socket.on("player2Enter", (obj) => {
            if (obj.enter) {
                setOtherSocketId(obj.player2);
            }
        });
    }, [])

    const getOut = () => {
        axios.post(process.env.NEXT_PUBLIC_API_DISCONNECT, {
            roomId: room,
            myTurn: "second"
          })
          .then(() => {
          })
          .catch(err => {
            console.log(err);
          })
        setRoom();
    }

    return (
        <div className={styles.container}>
            <div className={styles.otherBoxAndButton}>
                <div className={styles.otherBox}>
                    <div className={styles.otherNickname}>
                    </div>
                </div>
                <div
                    className={styles.getOutButton}
                    onClick={() => getOut()}
                >
                    나가기
                </div>
            </div>
            <div className={styles.waitingPlayer2}>
                Player 2의 입장을 기다리시오.
            </div>
            <div className={styles.myBox}>
                <div className={styles.myNickname}>
                    {nickname}
                </div>
            </div>
        </div>
    )
}