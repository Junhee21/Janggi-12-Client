import styles from '../../styles/Home.module.css'
import { useState, useEffect } from 'react'
import classNames from 'classnames';

export default function Chat({
        otherNickname, setOtherNickname, nickname, setRoom,
        socket, otherSocketId, setOtherSocketId, setAllReady, myTurn}) {
    const [chatList, setChatList] = useState([]);
    const [chat, setChat] = useState();
    const [myReady, setMyReady] = useState(false);
    const [otherReady, setOtherReady] = useState(false);

    useEffect(() => {
        socket.on("chat", (obj) => {
            setChatList(chatList => [...chatList, {
                sender: "other",
                msg: obj.msg
            }])
        })
        socket.on("ready", (obj) => {
            setOtherReady(obj.ready);
        })
        socket.on("allReady", (obj) => {
            setAllReady(obj.allReady);
        })
        socket.on("otherNickname", (obj) => {
            setOtherNickname(obj.nickname);
        })

        if (otherSocketId) {
            socket.emit("otherNickname", {
                receiver: otherSocketId,
                nickname: nickname
            })
        }
        return () => {
            setChatList([]);
            setMyReady(false);
            setOtherReady(false);
            setChat();
        }
    }, [otherSocketId])

    const emit = () => {
        if (!chat) {
            alert("채팅을 입력하세요!");
        } else {
            socket.emit("chat", {
                receiver: otherSocketId,
                msg: chat
            });
            setChatList(chatList => [...chatList, {
                sender: "me",
                msg: chat
            }])
            setChat("");
        }
    }

    const ready = () => {
        setMyReady(!myReady);
        socket.emit("ready", {
            receiver: otherSocketId,
            ready: !myReady
        })
    };

    const isAllReady = () => {
        if (myReady && otherReady) {            
            setAllReady(true);
            socket.emit("allReady", {
                receiver: otherSocketId,
                allReady: true
            })
        } else {
            alert("준비가 다 안됐습니다!");
        }
    };

    const getOut = () => {
        socket.emit('disconnectReply', {
            socketId: socket.id
        });
        setOtherNickname();
        setOtherSocketId();
        setRoom();
    }

    return (
        <div className={styles.container}>
            <div className={styles.otherBoxAndButton}>
                <div className={classNames(styles.otherBox, otherReady?styles.ready:"")}>
                    <div className={styles.otherNickname}>
                        {otherNickname}
                    </div>
                </div>
                <div
                    className={styles.getOutButton}
                    onClick={() => getOut()}
                >
                    나가기
                </div>
            </div>
            <div className={styles.chatList}>
                {chatList.map((chat, index) => {
                    return <div
                        key = {index}
                        className={classNames(styles.chatMsg, chat.sender!=="me"?styles.backgroundBlue:'')}
                    >
                        {chat.msg}
                    </div>
                })}
            </div>
            <div className={styles.chatSendBox}>
                <textarea
                    value={chat}
                    onChange={(e) => setChat(e.target.value)}
                    className={styles.chatTextarea}
                    placeholder='메시지'
                />
                <div
                    onClick={() => emit()}
                    className={styles.chatSendButton}
                >
                    전송
                </div>
            </div>
            <div className={classNames(styles.myBox, myReady?styles.ready:"")}>
                <div className={styles.myNickname}>
                    {nickname}
                </div>
                <div className={styles.chatButtonBox}>
                    <div
                        className={styles.chatButton}
                        onClick={() => ready()}
                    >
                        준비
                    </div>
                    {(myTurn === "first") && 
                        <div
                            className={styles.chatButton}
                            onClick={() => isAllReady()}
                        >
                            시작
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}