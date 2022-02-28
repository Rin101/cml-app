import { Button } from '@mui/material';
import React, { useRef, useState } from 'react';
import './App.css'
import './program-grid.css'
import { Editor } from './Editor';
import { ProgramBlock, TypeDataInDousa, LoopInputBox } from './programBlock';
import useLocalStorage from './useLocalStorage';
import { TopMenu, downloadFile } from './menu';

export const App = () => {

    const [cmlOutput, setCmlOutput] = useLocalStorage('CML', '')
    const [isNyuryokuShingou, setIsNyuryokuShingou] = useState(false)
    // const [isNyuryokuShingou, setIsNyuryokuShingou] = useLocalStorage("nyuryokushingou", false)
    const [isMute, setIsMute] = useState(false)
    const [jiku, setJiku] = useState(3)
    let initialTannikannsannData = []
    for (let i=0; i < jiku; i++) {
        initialTannikannsannData.push({kikou: "initial", susumiryou: [1,1], gensoku: [1,1], bunkai: 300, tanniValue:1})
    }
    const [tannikannsannData, setTannikannsannData] = useState(initialTannikannsannData)
    // const [programData, setProgramData] = useState([[[[]]]])
    const [programData, setProgramData] = useState([[[["位置決め", 1, [[98899898, "pps"], [100, "pps"], [100, "pps"]]],[],[]],[[],[],[]],[[],[],[]]]])
    const [loopData, setLoopData] = useState([])
    const [currentDraggedCommand, setCurrentDraggedCommand] = useState("位置決め")

    // typeDataObj: [jiku, parentId, dousaType, dousaNum, isInitial]
    // loopInputObj: [parentId, isInitial]
    const [typeDataObj, setTypeDataObj] = useState(new Array(5))
    const [loopInputObj, setLoopInputObj] = useState(new Array(2))
    const [inputBoxType, setInputBoxType] = useState("none")

    const typeDataRef = useRef()
    const loopInputRef = useRef()
    const expCopy = useRef()
    const expCopyDone = useRef()
    const layerRef = useRef()
    const commandSelectorRef = useRef()

    // const popMessage = (message) => {
    //     const id = "pop-message-"+Date.now()
    //     document.innerHTML += 
    //     <div id={id} className="pop-message message-success">
    //         <p className="message-text">{message}</p>
    //         <i className="fas fa-times">agdsfdgfhkgjfhkdgsfa</i>
    //     </div>
        
    //     setTimeout(() => {
    //         document.querySelector(`#${id}`).remove()
    //     }, 4000)
    // }

    // const getIndex = (document) => {
    //     let res = document.id.split('-')
    //     res.shift()
    //     return res
    // }

    const commandDragStart = (e) => {
        if (!isMute) {
            let audio = new Audio('https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3');
            audio.play();
        }
    }

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

    const DataInputBox = (props) => {
        switch (props.inputBoxType) {
            case "typedata":
                return <TypeDataInDousa tkData={tannikannsannData} setInputBoxType={setInputBoxType} isInitial={typeDataObj[4]} jiku={typeDataObj[0]} parentId={typeDataObj[1]} dousaType={typeDataObj[2]} dousaNum={typeDataObj[3]} programData={programData} setProgramData={setProgramData}/>
            case "loop":
                return <LoopInputBox setInputBoxType={setInputBoxType} isInitial={loopInputObj[1]} parentId={loopInputObj[0]} loopData={loopData} setLoopData={setLoopData} />
            default:
                return <></>
        }
    }

    return (
        <div className="main">
            <DataInputBox inputBoxType={inputBoxType} />
            <div ref={layerRef} className="layer"></div>
            <div className="command-list-width-box"></div>
            <div className='command-list-container'>
                <div className="command-list">
                    <div onMouseEnter={(e) => commandHover(e)} className="command-selector" id="dousaGroup-selector" draggable="true"><i className="fas fa-grip-vertical"></i>動作グループを追加</div>
                    <div ref={commandSelectorRef} onDragStart={(e) => commandDragStart(e)} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="ichigime-selector" draggable="true"><i className="fas fa-grip-vertical"></i>位置決め</div>
                    <div ref={commandSelectorRef} onDragStart={(e) => commandDragStart(e)} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="oshituke-selector" draggable="true"><i className="fas fa-grip-vertical"></i>押付け</div>
                    <div ref={commandSelectorRef} onDragStart={(e) => commandDragStart(e)} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="toruku-selector" draggable="true"><i className="fas fa-grip-vertical"></i>トルク制限</div>
                    <div ref={commandSelectorRef} onDragStart={(e) => commandDragStart(e)} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="taima-selector" draggable="true"><i className="fas fa-grip-vertical"></i>タイマ</div>
                    <div ref={commandSelectorRef} onDragStart={(e) => commandDragStart(e)} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="kurikaeshi-selector" draggable="true"><i className="fas fa-grip-vertical"></i>繰り返し</div>
                </div>
            </div>
            <div className="center-section">
                <div className='top-menu-container'>
                    <TopMenu isMute={isMute} setIsMute={setIsMute} tannikannsannData={tannikannsannData} setTannikannsannData={setTannikannsannData} programData={programData} setProgramData={setProgramData} loopData={loopData} setLoopData={setLoopData} layerRef={layerRef} cmlOutput={cmlOutput} setCmlOutput={setCmlOutput} isNyuryokuShingou={isNyuryokuShingou} setIsNyuryokuShingou={setIsNyuryokuShingou} jiku={jiku} setJiku={setJiku}/>
                </div>
                <div className='main-interface-section'>
                    <div className='program-block-container'>
                        <ProgramBlock isMute={isMute} tkData={tannikannsannData} setInputBoxType={setInputBoxType} inputBoxType={inputBoxType} loopInputObj={loopInputObj} setLoopInputObj={setLoopInputObj} typeDataObj={typeDataObj} setTypeDataObj={setTypeDataObj} typeDataRef={typeDataRef} loopInputRef={loopInputRef} isNyuryokuShingou={isNyuryokuShingou} setCmlOutput={setCmlOutput} loopData={loopData} setLoopData={setLoopData} programData={programData} setProgramData={setProgramData} jiku={jiku} setJiku={setJiku} currentDraggedCommand={currentDraggedCommand} setCurrentDraggedCommand={setCurrentDraggedCommand}/>
                    </div>
                    <div className='cml-output-container'>
                        <div className="cml-output-section">
                            <h3 className='unselectable'>CML</h3>
                            <Editor value={cmlOutput} onChange={setCmlOutput} />
                            <div className="jikkou-button">
                                <Button variant="contained" onClick={() => handleFileExport()}>
                                    テキストファイルに<br/>エクスポート
                                </Button>
                                <div className="copy-cml-container">
                                    <div className="copy-cml" onMouseEnter={() => display(expCopy)} onMouseLeave={() => hide(expCopy)} onClick={() => copyCML(cmlOutput)}><i className="fas fa-copy"></i></div>
                                    <div ref={expCopy} className="exp-copy hidden">コピー</div>
                                    <div ref={expCopyDone} className="exp-copy-done hidden">コピーされました</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="center-section">
                <TopMenu tannikannsannData={tannikannsannData} setTannikannsannData={setTannikannsannData} programData={programData} setProgramData={setProgramData} loopData={loopData} setLoopData={setLoopData} layerRef={layerRef} cmlOutput={cmlOutput} setCmlOutput={setCmlOutput} isNyuryokuShingou={isNyuryokuShingou} setIsNyuryokuShingou={setIsNyuryokuShingou} jiku={jiku} setJiku={setJiku}/>
                <ProgramBlock tkData={tannikannsannData} setInputBoxType={setInputBoxType} inputBoxType={inputBoxType} loopInputObj={loopInputObj} setLoopInputObj={setLoopInputObj} typeDataObj={typeDataObj} setTypeDataObj={setTypeDataObj} typeDataRef={typeDataRef} loopInputRef={loopInputRef} isNyuryokuShingou={isNyuryokuShingou} setCmlOutput={setCmlOutput} loopData={loopData} setLoopData={setLoopData} programData={programData} setProgramData={setProgramData} jiku={jiku} setJiku={setJiku} currentDraggedCommand={currentDraggedCommand} setCurrentDraggedCommand={setCurrentDraggedCommand}/>
            </div>
            <div className="cml-output-section">
                <h3 className='unselectable'>CML</h3>
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
            </div> */}
        </div>
    )
}