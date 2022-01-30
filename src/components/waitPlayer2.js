import styles from '../../styles/Home.module.css';
import { useEffect } from "react";

export default function WaitPlayer2 ({nickname, socket, setOtherSocketId}) {
    useEffect(() => {
        socket.on("player2Enter", (obj) => {
            if (obj.enter) {
                setOtherSocketId(obj.player2);
            }
        });
    }, [])

    return (
        <div className={styles.container}>
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