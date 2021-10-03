import { Button } from '@mui/material';
import React, { useRef, useState } from 'react';
import './App.css'
import { BunkiInput, BunkiVInput, IchigimeInput, inputToIchigimeCML, inputToOshitukeCML, inputToTimerCML, OshitukeInput, TimerInput } from './commands';
import { Editor } from './Editor';
import useLocalStorage from './useLocalStorage';

export const App = () => {

    const [cmlOutput, setCmlOutput] = useLocalStorage('CML', '')
    const [userInputArr, setUserInputArr] = useState([])

    const userInputArea = useRef()

    const addCommand = (document) => {
        let tmp = [...userInputArr]
        tmp.push(document)
        setUserInputArr(tmp)
    }

    const inputToCML = () => {
        const commands = userInputArea.current.querySelectorAll('div')
        let res = cmlOutput
        Array.from(commands).map(command => {
            switch (command.className) {
                case 'ichigime-input input-block':
                    res += inputToIchigimeCML(command)
                    break;
                case 'oshituke-input input-block':
                    res += inputToOshitukeCML(command)
                    break;
                case 'timer-input input-block':
                    res += inputToTimerCML(command)
                    break;
                default:
                    break;
            }
            return 0
        })
        setCmlOutput(res)
    } 

    const trashInput = (e) => {
        let tmp = [...userInputArr]

        const index = tmp.indexOf(e.target);
        if (index > -1) {
            tmp.splice(index, 1);
        }

        setUserInputArr(tmp)
    }

    return (
        <div className="main">
            <section className="command-selector-section">
                <div className="command-selector unselectable" onClick={() => addCommand(<IchigimeInput trashInput={trashInput} key={new Date().getTime()}/>)}><p>位置決め</p><i className="fas fa-plus-circle"></i></div>
                <div className="command-selector unselectable" onClick={() => addCommand(<OshitukeInput trashInput={trashInput} key={new Date().getTime()}/>)}><p>押し付け</p><i className="fas fa-plus-circle"></i></div>
                <div className="command-selector unselectable" onClick={() => addCommand(<TimerInput trashInput={trashInput} key={new Date().getTime()}/>)}><p>タイマー</p><i className="fas fa-plus-circle"></i></div>
                <div className="command-selector unselectable" onClick={() => addCommand(<BunkiInput trashInput={trashInput} key={new Date().getTime()}/>)}><p>分岐(入力信号)</p><i className="fas fa-plus-circle"></i></div>
                <div className="command-selector unselectable" onClick={() => addCommand(<BunkiVInput trashInput={trashInput} key={new Date().getTime()}/>)}><p>分岐(V変数)</p><i className="fas fa-plus-circle"></i></div>
                <div className="command-selector unselectable" onClick={() => addCommand(<IchigimeInput trashInput={trashInput} key={new Date().getTime()}/>)}><p>繰り返し</p><i className="fas fa-plus-circle"></i></div>
                <div className="command-selector unselectable" onClick={() => addCommand(<IchigimeInput trashInput={trashInput} key={new Date().getTime()}/>)}><p>停止</p><i className="fas fa-plus-circle"></i></div>
            </section>
            <section className="user-input-section">
                <div className="user-input-area" ref={userInputArea}>
                    {userInputArr}
                </div>
                <div className="enter-button">
                    <Button variant="contained" onClick={() => inputToCML()}>入力</Button>
                </div>
            </section>
            <section className="cml-output-section">
                <h3>CML</h3>
                <Editor value={cmlOutput} onChange={setCmlOutput} />
                <div className="jikkou-button">
                    <Button variant="contained" onClick={() => alert("実行されました")}>実行</Button>
                </div>
            </section>
        </div>
    )
}
