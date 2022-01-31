import styles from '../../styles/Home.module.css';
import { useState, useEffect } from 'react';
import classNames from 'classnames';

export default function Janggi12Game({allReady, nickname, otherNickname,
    setOtherNickname, socket, otherSocketId, myTurn, setAllReady}) {
    const [turn, setTurn] = useState(false);
    const [pieces, setPieces] = useState([
        { side: "none" },
        { side: "none" },
        { side: "none" },
        { side: "none" },
        { side: "none" },
        { side: "none" },
        { side: otherSocketId, id: "Jang", image:'/otherJang.PNG' },
        { side: otherSocketId, id: "King", image:'/otherKing.PNG' },
        { side: otherSocketId, id: "Sang", image:'/otherSang.PNG' },
        { side: "none" },
        { side: "none" },
        { side: "none" },
        { side: otherSocketId, id: "Ja", image:'/otherJa.PNG' },
        { side: "none" },
        { side: "none" },
        { side: "none" },
        { side: "none" },
        { side: socket.id, id: "Ja", image:'/myJa.PNG' },
        { side: "none" },
        { side: "none" },
        { side: "none" },
        { side: socket.id, id: "Sang", image:'/mySang.PNG' },
        { side: socket.id, id: "King", image:'/myKing.PNG' },
        { side: socket.id, id: "Jang", image:'/myJang.PNG' },
        { side: "none" },
        { side: "none" },
        { side: "none" },
        { side: "none" },
        { side: "none" },
        { side: "none" }
    ]);
    const [canMove, setCanMove] = useState(new Array(30).fill(0))
    const [myPow, setMyPow] = useState([]);
    const [otherPow, setOtherPow] = useState([]);
    const [result, setResult] = useState(0);
    const [cnt, setCnt] = useState(30);
    const [timer, setTimer] = useState(false);

    const frontier = [
        true, true, true, true, true, true, false, false, false, true,
        true, false, false, false, true, true, false, false, false, true,
        true, false, false, false, true, true, true, true, true, true
    ];

    useEffect(() => {
        if (myTurn === "first") {
            setTurn(true);
        }

        socket.on("janggi12", (obj) => {
            setPieces(obj.pieces);
            setOtherPow(obj.pows);
            setTurn(true);
            for (var i = 6; i<=8; i++) {
                if ((obj.pieces[i].side === socket.id) && (obj.pieces[i].id === "King")) {
                    setResult(1);
                }
            }
        })
        
        if (allReady) {
            socket.emit("otherNickname", {
                receiver: otherSocketId,
                nickname: nickname
            })
        }

        socket.on("otherNickname", (obj) => {
            setOtherNickname(obj.nickname);
        })


        socket.on("result", (obj) => {
            setResult(obj.result)
        })

        return () => {
            setTurn(false);
            setPieces([
                { side: "none" },
                { side: "none" },
                { side: "none" },
                { side: "none" },
                { side: "none" },
                { side: "none" },
                { side: otherSocketId, id: "Jang", image:'/otherJang.PNG' },
                { side: otherSocketId, id: "King", image:'/otherKing.PNG' },
                { side: otherSocketId, id: "Sang", image:'/otherSang.PNG' },
                { side: "none" },
                { side: "none" },
                { side: "none" },
                { side: otherSocketId, id: "Ja", image:'/otherJa.PNG' },
                { side: "none" },
                { side: "none" },
                { side: "none" },
                { side: "none" },
                { side: socket.id, id: "Ja", image:'/myJa.PNG' },
                { side: "none" },
                { side: "none" },
                { side: "none" },
                { side: socket.id, id: "Sang", image:'/mySang.PNG' },
                { side: socket.id, id: "King", image:'/myKing.PNG' },
                { side: socket.id, id: "Jang", image:'/myJang.PNG' },
                { side: "none" },
                { side: "none" },
                { side: "none" },
                { side: "none" },
                { side: "none" },
                { side: "none" }
            ]);
            setCanMove(canMove => [...canMove].fill(0));
            setMyPow([]);
            setOtherPow([]);
            setCnt(30);
            setTimer(false);
        }
    }, [allReady])

    useEffect(() => {
        if (result !==0 ) {
            clearInterval(timer);
            setCnt(100);
            socket.emit("result", {
                receiver: otherSocketId,
                result: result
            })
        }
    }, [result])

    const sendTurn = (obj) => {
        const cp = new Array(30);
        for (var i = 0; i<30; i++) {
            cp[i] = {...obj[29-i]};
            if (obj[29 - i].side === socket.id) {
                cp[i].image = `other${obj[29 - i].id}.PNG`
            } else if (obj[29 - i].side === otherSocketId) {
                cp[i].image = `my${obj[29 - i].id}.PNG`
            }
        }

        socket.emit("janggi12", {
            receiver: otherSocketId,
            pieces: cp,
            pows: myPow
        })
        setTurn(false);
    }

    useEffect(() => {
        if (turn) {
            var _timer = setInterval(function () {setCnt(cnt => cnt - 1)}, 1000);
            setTimer(_timer);
        }
        clearInterval(timer);
        setCnt(30);
    }, [turn])

    useEffect(() => {
        if (cnt === 0) {
            clearInterval(timer);
            setResult(-1);
        }
    }, [cnt])

    const clickBoard = (index) => {
        if (canMove[index] === 0) {
            if (pieces[index].side === socket.id) {
                if (pieces[index].id === "Sang") {
                    whereCanMove(index, [-6, -4, 4, 6]);
                } else if (pieces[index].id === "King") {
                    whereCanMove(index, [-6, -5, -4, -1, 1, 4, 5, 6])
                } else if (pieces[index].id === "Jang") {
                    whereCanMove(index, [-5, -1, 1, 5])
                } else if (pieces[index].id === "Ja") {
                    whereCanMove(index, [-5]);
                } else {
                    whereCanMove(index, [-6, -5, -4, -1, 1, 5])
                }
            } else {
                whereCanMove(index, []);
            }
        } else if (canMove[index] <= 29){
            move(index);
        } else {
            putPow(index)
        }
    };

    const whereCanMove = (clicked, arr) => {
        const cp = new Array(30).fill(0);
        arr.map((num) => {
            if ((!frontier[clicked+num]) && (pieces[clicked+num].side !== socket.id)) {
                cp[clicked + num] = clicked;
            }
        });
        setCanMove(cp);
    }

    const move = (index) => {
        const temp = pieces[canMove[index]];
        if (pieces[index].side === otherSocketId) {
            if (pieces[index].id === "King") {
                setResult(1);
            }
            const cp1 = myPow;
            if (pieces[index].id === "Hu") {
                cp1.push("Ja");
            } else {
                cp1.push(pieces[index].id);
            }
            setMyPow(cp1);
        }
        if ((index>=6 && index<=8) && (temp.id === "Ja")) {
            temp.id = "Hu";
            temp.image = "/myHu.PNG"
        }
        const cp2 = pieces;
        pieces.splice(index, 1, temp);
        cp2[canMove[index]] = { side: "none" };
        setPieces(cp2);
        setCanMove(canMove => [...canMove].fill(0));
        sendTurn(cp2);
    }

    const clickPow = (pow) => {
        const cp = [...canMove];
        for (var i = 0; i<30; i++)
        {
            if (!frontier[i] && pieces[i].side === "none" && (i>8))
                cp[i] = pow;
        }
        setCanMove(cp);
    }

    const putPow = (index) => {
        const cp = [...pieces];
        const num = canMove[index] - 100;
        cp[index] = {
            side: socket.id,
            id: myPow[num],
            image: `/my${myPow[num]}.PNG`
        };
        setPieces(cp);
        setCanMove(canMove => [...canMove].fill(0));
        myPow.splice(num, 1);
        sendTurn(cp);
    }

    const goRoom = () => {
        setResult(0);
        setAllReady(false);
    }

    return (
        <div className={styles.container}>
             <div className={classNames(styles.backgroundBlue, styles.gameBox, turn?"":styles.ready)}>
                <div className={styles.gameNickname}>
                    {otherNickname}
                </div>
                <div className={classNames(styles.powBox, turn?styles.borderTop:styles.borderTopRed)}>
                    {otherPow.map((pow, index) => {
                        if (pow === "Hu") {
                            return <img 
                                key = {index}
                                src = "/otherJa.PNG"
                                className={styles.pow}
                            />
                        } else {
                            return <img
                                key = {index}
                                src = {`/other${pow}.PNG`}
                                className={styles.pow}
                            />
                        }
                    })}
                </div>
            </div>
            {(result === 1) &&
                <div className={styles.resultBox}>
                    <div
                        className={styles.resultButton}
                        onClick={() => goRoom()}
                        >
                        승리
                    </div>
                </div>
            }
            {(result === -1) &&
                <div className={styles.resultBox}>
                    <div
                        className={styles.resultButton}
                        onClick={() => goRoom()}
                        >
                        패배
                    </div>
                </div>
            }
            {(result === 0) && 
                <div 
                    className={styles.janggiGrid}
                    onClick={(e) => clickBoard(Number(e.target.id))}
                >
                    {frontier.map((state, index) => {
                        if (state) {
                            return <div key={index}>
                                </div>
                        } else {
                            return <div
                                key={index}
                                id={index}
                                className={classNames(
                                    styles.borderBottomRight,
                                    canMove[index]!==0 ? styles.canMove : '',
                                    !turn ? styles.clickDisabled : '',
                                    ((index>=5)&&(index<=8)) ? styles.otherSide : '',
                                    ((index>=21)&&(index<=23)) ? styles.mySide : '',
                                    ((index>=5)&&(index<=8)) ? styles.borderTop : '',
                                    (index%5===1) ? styles.borderLeft : '',
                                )}
                            >
                                {(pieces[index].side!=="none") &&
                                    <img src={pieces[index].image} id={index}/>
                                }
                            </div>
                        }
                    })}
                </div>
            }
            <div className={classNames(styles.gameBox, turn?styles.ready:"")}>
                <div className={styles.powBox}>
                    {myPow.map((pow, index) => {
                        if (pow === "Hu") {
                            return <img 
                                key = {index}
                                src = "/myJa.PNG"
                                onClick={() => clickPow(index + 100)}
                                className={styles.pow}
                            />
                        } else {
                            return <img
                                key = {index}
                                src = {`/my${pow}.PNG`}
                                onClick={() => clickPow(index +100)}
                                className={styles.pow}
                            />
                        }
                    })}
                </div>
                <div className={classNames(styles.gameNickname, turn?styles.borderTopRed:styles.borderTop)}>
                    <div style={{flex:1.1}}>
                        {nickname}
                    </div>
                    <div style={{flex:1}}>
                        타이머:{cnt}
                    </div>
                </div>
            </div>
        </div>
    )
}