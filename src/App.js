import { Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import './App.css'
import './program-grid.css'
import { Editor } from './Editor';
import { ProgramBlock, TypeDataInDousa, LoopInputBox } from './programBlock';
import useLocalStorage from './useLocalStorage';
import { TopMenu, downloadFile, Tannikannsann } from './menu';
import soundfile1 from './sounds/決定、ボタン押下38.mp3'
import soundfile2 from './sounds/決定、ボタン押下44.mp3'
import instructionImg from './image/popup-instruction.png'
import { toCML } from './toCml';
import { pressRun } from './serialPort';
import { SettingsPanel } from './settingsPanel/settingsPanel';

export const App = () => {

    // const [cmlOutput, setCmlOutput] = useLocalStorage('CML', '')
    const [cmlOutput, setCmlOutput] = useState('')
    const [isNyuryokuShingou, setIsNyuryokuShingou] = useState(false)
    const [settings, setSettings] = useLocalStorage('kNum', {
        'kNum5': 5, 'kNum11': 0, 'kNum12': 30, 'kNum13': 200, 'kNum14': 0, 'kNum22': 0,
        'kNum23': 10, 'kNum24': 10, 'kNum25': 1, 'kNum26': 0, 'kNum28': 30
    })
    const [isMute, setIsMute] = useState(false)
    const [jiku, setJiku] = useState(1)
    let initialTannikannsannData = []
    for (let i=0; i < jiku; i++) {
        initialTannikannsannData.push({kikou: "initial", susumiryou: [1,1], gensoku: [1,1], bunkai: "1000", tanniValue:1})
    }
    const [tannikannsannData, setTannikannsannData] = useState(initialTannikannsannData)
    // const [programData, setProgramData] = useState([[[["位置決め", 1, [[100, "pps"], [100, "pps"], [100, "pps"]]],[],[]],[[],[],[]],[[],[],[]]]])
    const [programData, setProgramData] = useState(
        [
            [
                [["位置決め", 1, [[100, "pps"], [100, "pps"], [100, "pps"]]]],
                [[]],
                [[]]
            ], [[[]]], [[[]]]
        ]
    )
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
    const instructionPopupRef = useRef()
    const jikkouNumPopupRef = useRef()

    // const getIndex = (document) => {
    //     let res = document.id.split('-')
    //     res.shift()
    //     return res
    // }

    const commandDragStart = (e) => {
        if (!isMute) {
            let audio = new Audio(soundfile1);
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
            case "taima-selector":
                setCurrentDraggedCommand("タイマ")
                break
            case "incremental-ichigime-selector":
                setCurrentDraggedCommand("位置決め+")
                break
            case "incremental-oshituke-selector":
                setCurrentDraggedCommand("押付け+")
                break
            case "nyuryokuten-selector":
                setCurrentDraggedCommand("入力点からの実行")
                break
            case "shutsuryoku1":
                setCurrentDraggedCommand("出力点1へ出力")
                break
            case "shutsuryoku2":
                setCurrentDraggedCommand("出力点2へ出力")
                break
            case "shutsuryoku3":
                setCurrentDraggedCommand("出力点3へ出力")
                break            
            case "shutsuryokuOff":
                setCurrentDraggedCommand("出力点を全てOFF")
                break   
            case "gentenfukki":
                setCurrentDraggedCommand("原点復帰")
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

    const showPopUpOfInstruction = () => {
        // instructionPopupRef.current.style.display = "flex"
        handleFileExport()
    }

    const handleFileExport = () => {
        const data = cmlOutput
        // 日付と時刻
        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes()
        let currentDate = `${year}_${month}_${day}_${hour}_${minute}`

        const filename = "CML_" + currentDate
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

    const PopUpOfInstruction = () => {
        const close = () => {
            instructionPopupRef.current.style.display = "none"
        }

        return (
            <div className='popup-instruction' ref={instructionPopupRef}>
                <div className='popup-container'>
                    <div id="close-instruction-popup" onClick={() => close()}><i className="fas fa-times-circle"></i></div>
                    <div className='popup-content'>
                        <p>モータへの書き込みが完了しました。<br/>モータの電源を再投入すると、入力点からの制御が可能になります。</p>
                    </div>
                    {/* export to text file instruction */}
                    {/* <img src={instructionImg} alt="instruction" /> */}
                </div>
            </div>
        )
    }

    const PopUpOfJikkouNum = () => {

        const [jikkouNum, setJikkouNum] = useState(0);

        const close = () => {
            jikkouNumPopupRef.current.style.display = "none"
            layerRef.current.style.display = "none"
        }

        const sendJikkou = () => {
            if (jikkouNum === 0) {
                alert("番号を選択してください")
            } else {
                let jikkouCml = "["+jikkouNum.toString() + ".1\n"
                pressRun(jikkouCml)
            }
        }

        return (
            <div className='popup-instruction' ref={jikkouNumPopupRef}>
                <div className='popup-container'>
                    <div id="close-instruction-popup" onClick={() => close()}><i className="fas fa-times-circle"></i></div>
                    <div className='popup-jikkou-content'>
                        <p>入力点を選択</p>
                        <div style={{marginTop: "30px"}}></div>
                        <select id="jikkou-dropdown" 
                            defaultValue={jikkouNum}
                            onChange={(e) => setJikkouNum(e.target.value)}
                            >
                            <option value="0">番号を選択</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                        <div style={{marginTop: "30px"}}></div>
                        <p id='jikkou-popup-text'>*実行コマンドを送信すると現在モータ内に書き込まれている<br/>プログラムを実行し、モータが回転します。</p>
                        <div style={{marginTop: "15px"}}></div>
                        <Button color='warning' variant="contained" onClick={() => sendJikkou()}>
                            動作開始
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    async function jikkou() {
        // setCmlOutput(toCML(programData, loopData, isNyuryokuShingou, tannikannsannData, settings))
        // pressRun(toCML(programData, loopData, isNyuryokuShingou, tannikannsannData, settings))
        if (cmlOutput.length > 0) {
            await pressRun(cmlOutput)
            setTimeout(() => {
                instructionPopupRef.current.style.display = "flex"
            }, 500);   
        } else {
            alert("CMLに変換してください。")
        }
    }

    const openJikkouNumPopup = () => {
        jikkouNumPopupRef.current.style.display = "flex"
        layerRef.current.style.display = "flex"
    }

    const closeTanni = () => {
        document.querySelector('.tannikannsann-popup').style.display = "none"
        // topMenuRef.current.querySelector('.tannikannsann-popup').style.display = "none"
        layerRef.current.style.display = "none"
    }

    const closeSettingsPanel = () => {
        document.querySelector('#settings-panel').style.display = "none"
        // topMenuRef.current.querySelector('#settings-panel').style.display = "none"
        layerRef.current.style.display = "none"
    }


    return (
        <div className="main">
            <PopUpOfInstruction />
            <PopUpOfJikkouNum />
            <DataInputBox inputBoxType={inputBoxType} />
            <div ref={layerRef} className="layer"></div>
            <Tannikannsann jiku={jiku} tannikannsannData={tannikannsannData} setTannikannsannData={setTannikannsannData} application={"hi"} setApplication={"hi"} tanniValue={"hi"} setTanniValue={"hi"} topMenuRef={"hi"} closeTanni={closeTanni}/>
            <SettingsPanel closePanel={closeSettingsPanel} settings={settings} setSettings={setSettings} />
            <div className='top-menu-container'>
                <TopMenu settings={settings} setSettings={setSettings} isMute={isMute} setIsMute={setIsMute} tannikannsannData={tannikannsannData} setTannikannsannData={setTannikannsannData} programData={programData} setProgramData={setProgramData} loopData={loopData} setLoopData={setLoopData} layerRef={layerRef} cmlOutput={cmlOutput} setCmlOutput={setCmlOutput} isNyuryokuShingou={isNyuryokuShingou} setIsNyuryokuShingou={setIsNyuryokuShingou} jiku={jiku} setJiku={setJiku}/>
            </div>
            <div className='top-menu-spacer'></div>
            <div className="center-section">
                <div className="command-list-width-box"></div>
                <div className='command-list-container'>
                    <div className="command-list">
                        <div className='command-list-wrapper'>
                            {/* <div onMouseEnter={(e) => commandHover(e)} className="command-selector" id="dousaGroup-selector" draggable="true"><i className="fas fa-grip-vertical"></i>動作グループを追加</div> */}
                            <div ref={commandSelectorRef} onDragStart={(e) => commandDragStart(e)} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="ichigime-selector" draggable="true"><i className="fas fa-grip-vertical"></i>位置決め</div>
                            <div ref={commandSelectorRef} onDragStart={(e) => commandDragStart(e)} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="oshituke-selector" draggable="true"><i className="fas fa-grip-vertical"></i>押付け</div>
                            <div ref={commandSelectorRef} onDragStart={(e) => commandDragStart(e)} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="incremental-ichigime-selector" draggable="true"><i className="fas fa-grip-vertical"></i>位置決め+</div>
                            <div ref={commandSelectorRef} onDragStart={(e) => commandDragStart(e)} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="incremental-oshituke-selector" draggable="true"><i className="fas fa-grip-vertical"></i>押付け+</div>
                            <div ref={commandSelectorRef} onDragStart={(e) => commandDragStart(e)} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="taima-selector" draggable="true"><i className="fas fa-grip-vertical"></i>タイマ</div>
                            <div ref={commandSelectorRef} onDragStart={(e) => commandDragStart(e)} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="shutsuryoku1" draggable="true"><i className="fas fa-grip-vertical"></i>出力点1へ出力</div>
                            <div ref={commandSelectorRef} onDragStart={(e) => commandDragStart(e)} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="shutsuryoku2" draggable="true"><i className="fas fa-grip-vertical"></i>出力点2へ出力</div>
                            <div ref={commandSelectorRef} onDragStart={(e) => commandDragStart(e)} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="shutsuryoku3" draggable="true"><i className="fas fa-grip-vertical"></i>出力点3へ出力</div>
                            <div ref={commandSelectorRef} onDragStart={(e) => commandDragStart(e)} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="shutsuryokuOff" draggable="true"><i className="fas fa-grip-vertical"></i>出力点を全てOFF</div>
                            <div ref={commandSelectorRef} onDragStart={(e) => commandDragStart(e)} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="gentenfukki" draggable="true"><i className="fas fa-grip-vertical"></i>原点復帰</div>
                            <div ref={commandSelectorRef} onDragStart={(e) => commandDragStart(e)} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="kurikaeshi-selector" draggable="true"><i className="fas fa-grip-vertical"></i>繰り返し</div>
                            {/* <div ref={commandSelectorRef} onDragStart={(e) => commandDragStart(e)} onMouseEnter={(e) => commandHover(e)} className="command-selector" id="nyuryokuten-selector" draggable="true"><i className="fas fa-grip-vertical"></i>入力点からの実行</div> */}
                        </div>
                    </div>
                </div>
                <div className='main-interface-section'>
                    <div className='program-block-container'>
                        <ProgramBlock settings={settings} isMute={isMute} tkData={tannikannsannData} setTkData={setTannikannsannData} setInputBoxType={setInputBoxType} inputBoxType={inputBoxType} loopInputObj={loopInputObj} setLoopInputObj={setLoopInputObj} typeDataObj={typeDataObj} setTypeDataObj={setTypeDataObj} typeDataRef={typeDataRef} loopInputRef={loopInputRef} isNyuryokuShingou={isNyuryokuShingou} setCmlOutput={setCmlOutput} loopData={loopData} setLoopData={setLoopData} programData={programData} setProgramData={setProgramData} jiku={jiku} setJiku={setJiku} currentDraggedCommand={currentDraggedCommand} setCurrentDraggedCommand={setCurrentDraggedCommand}/>
                    </div>
                    <div className='cml-output-container'>
                        <div className="cml-output-section">
                            <div className='cml-output-content'>
                                <h3 className='unselectable'>CML</h3>
                                <Editor value={cmlOutput} onChange={setCmlOutput} />
                            </div>
                            <div className="jikkou-button">
                                <Button variant="contained" onClick={() => showPopUpOfInstruction()}>
                                    {/* テキストファイルに<br/>エクスポート */}
                                    テキストファイルを出力
                                </Button>
                                <div className="copy-cml-container">
                                    <div className="copy-cml" onMouseEnter={() => display(expCopy)} onMouseLeave={() => hide(expCopy)} onClick={() => copyCML(cmlOutput)}><i className="fas fa-copy"></i></div>
                                    <div ref={expCopy} className="exp-copy hidden">コピー</div>
                                    <div ref={expCopyDone} className="exp-copy-done hidden">コピーされました</div>
                                </div>
                            </div>
                            <div className='spacer'></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='bottom-menu-container'>
                <div className='bottom-menu' id="bottom-menu-main-button" onClick={() => jikkou()}>
                    {/* <Button variant="contained" onClick={() => jikkou()}>モータに書き込む</Button> */}
                    <p className='bottom-menu-button-text'>CMLをモータに書き込む</p>
                </div>
                <div style={{marginLeft: "10px"}}></div>
                <div className='bottom-menu' id="bottom-menu-jikkou-button" onClick={() => openJikkouNumPopup()}>
                    <p className='bottom-menu-button-text'>動作開始</p>
                </div>
            </div>
            <div className='bottom-menu-spacer'></div>
        </div>
    )
}