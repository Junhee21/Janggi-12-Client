import styles from '../../styles/Home.module.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Room({ socket, setRoom, setMyTurn, setOtherSocketId }) {
    const [title, setTitle] = useState();
    const [rooms, setRooms] = useState([]);
    const [refreshBool, setRefreshBool] = useState(false);
    const [createBool, setCreateBool] = useState(false);

    const createRoom = () => {
        if (!createBool) {
            setCreateBool(true);
        } else {
            if (!title) {
                alert("방 이름을 입력하세요!");
            } else {
                axios.post(process.env.NEXT_PUBLIC_API_CREATEROOM, {
                    title: title,
                    socketId: socket.id
                })
                .then(res => {
                    setRoom(res.data.id);
                    setMyTurn("first");
                })
                .catch(function (error) {
                        console.log(error);
                })
            }
        }
    };

    const enterRoom = (room) => {
        axios.post(process.env.NEXT_PUBLIC_API_ENTERROOM, {
            roomId: room.id,
            socketId: socket.id
        })
        .then(res => {
            if (!res.data.success) {
                alert("방이 꽉 찼습니다!");
            } else {
                setRoom(room.id);
                setMyTurn("second");
                setOtherSocketId(room.player1);
                socket.emit("player2Enter", {
                    receiver: room.player1,
                    sender: socket.id
                });
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        axios.get(process.env.NEXT_PUBLIC_API_GETROOMS)
            .then(res => {
                setRooms(res.data.rooms)
            })
            .catch(err => {
                console.log(err);
            })

        return () => {
            setRefreshBool(false);
            setCreateBool(false);
            setRooms([]);
            setTitle();
        }
    }, [refreshBool])

    return (
        <div className={styles.container}>
            {createBool && <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.textareaRoom}
                placeholder="방 제목을 입력하세요"
            />}
            <div className={styles.buttonBox}>
                <div
                    className={styles.buttonRoom}
                    onClick={() => createRoom()}
                >
                    방만들기
                </div>
                <div
                    className={styles.buttonRoom}
                    onClick={() => setRefreshBool(!refreshBool)}
                >
                    새로고침
                </div>

            </div>
            <div className={styles.roomList}>
                {rooms.map((room, index) => {
                    return <div
                        key={index}
                        onClick={() => enterRoom(room)}
                        className={styles.room}
                    >
                        {room.title}
                    </div>
                })}
            </div>
        </div>
    )
}