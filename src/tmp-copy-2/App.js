import { Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import './App.css'
import './program-grid.css'
import { Editor } from './Editor';
import { ProgramBlock } from './programBlock';
import useLocalStorage from './useLocalStorage';
import { TopMenu, downloadFile } from './menu';
import { toCML } from './toCml';

export const App = () => {

    const [cmlOutput, setCmlOutput] = useLocalStorage('CML', '')
    const [isNyuryokuShingou, setIsNyuryokuShingou] = useState(false)
    const [jiku, setJiku] = useState(3)
    const [tanniValue, setTanniValue] = useState(100)
    const [application, setApplication] = useState("initial")
    useEffect(() => {
        console.log(application)
    }, [application])
    // const [programData, setProgramData] = useState([[[[]]]])
    // const [programData, setProgramData] = useState([
    //     [
    //         [["位置決め", 1, [[100, "pps"], [100, "pps"], [100, "pps"]]], ["押付け", 1, [100, 100, 100]], ["位置決め", 2, [[100, "pps"], [100, "pps"], [100, "pps"]]]], 
    //         [[], [], ["トルク制限", 1, [100, 100, 100]]],
    //         [[], ["押付け", 2, [100, 100, 100]], ["トルク制限", 3, [100, 100, 100]]],
    //         [[], ["押付け", 3, [100, 100, 100]], ["トルク制限", 2, [100, 100, 100]]],
    //     ],
    //     [
    //         [[], ["タイマ", 2, [100, 100, 100]], []]
    //     ]
    // ])
    const [programData, setProgramData] = useState([
        [
            [["位置決め", 1, [[98899898, "pps"], [100, "pps"], [100, "pps"]]], [], ["位置決め", 2, [[100, "pps"], [100, "pps"], [100, "pps"]]]], 
            [[], [], []],
            [[], [], []],
            [[], [], []],
        ],
        [
            [[], [], []]
        ]
    ])

    // const [loopData, setLoopData] = useState([])
    const [loopData, setLoopData] = useState([[["0","0"], ["0","2"], 4]])
    const [currentDraggedCommand, setCurrentDraggedCommand] = useState("位置決め")

    const expCopy = useRef()
    const expCopyDone = useRef()
    const layerRef = useRef()
    const commandSelectorRef = useRef()

    const popMessage = (message) => {
        const id = "pop-message-"+Date.now()
        document.innerHTML += 
        <div id={id} className="pop-message message-success">
            <p className="message-text">{message}</p>
            <i className="fas fa-times">agdsfdgfhkgjfhkdgsfa</i>
        </div>
        
        setTimeout(() => {
            document.querySelector(`#${id}`).remove()
        }, 4000)
    }

    const getIndex = (document) => {
        let res = document.id.split('-')
        res.shift()
        return res
    }

    // const commandDragStart = (e) => {
    const commandHover = (e) => {
        switch(e.target.id) {
            case "ichigime-selector":
                setCurrentDraggedCommand("位置決め")
                break
            case "oshituke-selector":
                setCurrentDraggedCommand("押付け")
                break
            case "toruku-selector":
                setCurrentDraggedCommand("トルク制限")
                break
            case "taima-selector":
                setCurrentDraggedCommand("タイマ")
                break
            case "kurikaeshi-selector":
                setCurrentDraggedCommand("繰り返し")
                break
            case "dousaGroup-selector":
                setCurrentDraggedCommand("動作グループを追加")
                break
            default:
                setCurrentDraggedCommand("NOPE")
                break
        }
        // this.className += ' hold';
        // setTimeout(() => (this.className = 'invisible'), 0);
    }
    // function dragEnd() {
    //     this.className = 'fill';
    // }

    const copyCML = (cml) => {
        navigator.clipboard.writeText(cml);
        expCopy.current.style.display = "none"
        expCopyDone.current.style.display = "block"
        setTimeout(() => {
            expCopyDone.current.style.display = "none"
        }, 2000)
    }

    const display = (ref) => {
        ref.current.classList.add("shown")
        ref.current.classList.remove("hidden")
        setTimeout(() => {
            if (!ref.current.classList.contains("hidden")) {
                ref.current.style.display = "block"
            }
        }, 500)
    }

    const hide = (ref) => {
        ref.current.classList.remove('shown')
        ref.current.classList.add('hidden')
        ref.current.style.display = "none"
    }

    const handleFileExport = () => {
        const data = cmlOutput
        const filename = "CML-保存"
        const type = ".txt"
        downloadFile(data, filename, type)
    }
    
    return (
        <div className="main">
            <div ref={layerRef} className="layer"></div>
            <div className="command-list-width-box"></div>
            <div className="command-list">
                <div onMouseEnter={(e) => commandHover(e)} className="command-selector" id="dousaGroup-selector" draggable="true"><i className="fas fa-grip-vertical"></i>動作グループを追加</div>
                <div ref={commandSelectorRef} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="ichigime-selector" draggable="true"><i className="fas fa-grip-vertical"></i>位置決め</div>
                <div ref={commandSelectorRef} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="oshituke-selector" draggable="true"><i className="fas fa-grip-vertical"></i>押付け</div>
                <div ref={commandSelectorRef} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="toruku-selector" draggable="true"><i className="fas fa-grip-vertical"></i>トルク制限</div>
                <div ref={commandSelectorRef} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="taima-selector" draggable="true"><i className="fas fa-grip-vertical"></i>タイマ</div>
                <div ref={commandSelectorRef} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="kurikaeshi-selector" draggable="true"><i className="fas fa-grip-vertical"></i>繰り返し</div>
            </div>
            <div className="center-section">
                <TopMenu application={application} setApplication={setApplication} tanniValue={tanniValue} setTanniValue={setTanniValue} programData={programData} setProgramData={setProgramData} loopData={loopData} setLoopData={setLoopData} layerRef={layerRef} cmlOutput={cmlOutput} setCmlOutput={setCmlOutput} isNyuryokuShingou={isNyuryokuShingou} setIsNyuryokuShingou={setIsNyuryokuShingou} jiku={jiku} setJiku={setJiku}/>
                <ProgramBlock application={application} setApplication={setApplication} tanniValue={tanniValue} setTanniValue={setTanniValue} isNyuryokuShingou={isNyuryokuShingou} setCmlOutput={setCmlOutput} loopData={loopData} setLoopData={setLoopData} programData={programData} setProgramData={setProgramData} jiku={jiku} setJiku={setJiku} currentDraggedCommand={currentDraggedCommand} setCurrentDraggedCommand={setCurrentDraggedCommand}/>
            </div>
            <div className="cml-output-section">
                <h3 onClick={() => popMessage("FUCK OFF")}>CML</h3>
                <Editor value={cmlOutput} onChange={setCmlOutput} />
                <div className="jikkou-button">
                    <Button variant="contained" onClick={() => handleFileExport()}>
                        テキストファイルにエクスポート
                    </Button>
                    <div className="copy-cml-container">
                        <div className="copy-cml" onMouseEnter={() => display(expCopy)} onMouseLeave={() => hide(expCopy)} onClick={() => copyCML(cmlOutput)}><i className="fas fa-copy"></i></div>
                        <div ref={expCopy} className="exp-copy hidden">コピー</div>
                        <div ref={expCopyDone} className="exp-copy-done hidden">コピーされました</div>
                    </div>
                </div>
            </div>
        </div>
    )
}