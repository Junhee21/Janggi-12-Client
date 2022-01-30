import styles from '../../styles/Home.module.css';
import { useState } from "react"

export default function MakeNickname ({setNickname}) {
    const [input, setInput] = useState();
    
    const click = () => {
        if (!input) {
            alert("닉네임을 입력하세요!");
        } else {
            setNickname(input);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.title}>
                십이장기
            </div>
            <div className={styles.info}>
                닉네임을 입력하세요
            </div>
            <textarea
                value= {input}
                onChange={(e) => setInput(e.target.value)}
                className={styles.textarea}
                placeholder="닉네임"
            />
            <div
                onClick={() => click()}
                className={styles.button}
            >
                입장
            </div>
        </div>
    )
}