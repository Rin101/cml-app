import { Button } from '@mui/material';
import React, { useRef, useState } from 'react';

// Function to download data to a file
export const downloadFile = (data, filename, type) => {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        let a = document.createElement("a"),
        url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

export const TopMenu = (props) => {

    const topMenuRef = useRef()

    const handleFileImport = (e) => {
        const reader = new FileReader()
        reader.onload = async (e) => { 
            // const obj = JSON.parse(e.target.result)
            const obj = JSON.parse(reader.result)
            try {
                props.setProgramData(obj.data.programData)
                props.setLoopData(obj.data.loopData)
            } catch (err) {
                alert('ファイルが間違っています')
            }
        };
        reader.readAsText(e.target.files[0], "utf-8")
    }

    // Function to download data to a file
    const downloadFile = (data, filename, type) => {
        var file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
        }
    }

    const handleFileSave = () => {
        let obj = {"name":"cml-import","data":{"programData":props.programData,"loopData":props.loopData}}
        const data = JSON.stringify(obj)
        const filename = "CML-途中保存"
        const type = ".txt"
        downloadFile(data, filename, type)
    }

    const openTanni = () => {
        topMenuRef.current.querySelector('.tannikannsann-popup').style.display = "flex"
        props.layerRef.current.style.display = "block"
    }

    const closeTanni = (topMenuRef,　layerRef) => {
        topMenuRef.current.querySelector('.tannikannsann-popup').style.display = "none"
        layerRef.current.style.display = "none"
    }

    const toggleNyuryokuShingou = (e) => {
        const nyuryokuText = 
        `K81=1
        K82=1
        L1.1
        I1.1,JL2.1,T0.1
        I2.1,JL3.1,T0.1
        I3.1,JL4.1,T0.1
        I4.1,].1:].1,T0.1
        L2.1
        [1.1
        I1.1,W0.1,JL1.1
        L3.1
        [2.1
        I2.1,W0.1,JL1.1
        L4.1
        [3.1
        I3.1,W0.1,JL1.1
        END`
        let isPressed = e.currentTarget.classList.contains("pressed-nyuryoku-shingou")
        if (isPressed) {
            if (props.cmlOutput.includes(nyuryokuText)) {
                let tmpstr = props.cmlOutput
                props.setCmlOutput(tmpstr.replace(nyuryokuText,''))
            }
            e.target.classList.remove("pressed-nyuryoku-shingou")
            e.target.classList.add("unpressed-nyuryoku-shingou")
            props.setIsNyuryokuShingou(false)
        } else {
            if (!props.cmlOutput.includes(nyuryokuText)) {
                let tmpstr = props.cmlOutput
                props.setCmlOutput(tmpstr+"\n"+nyuryokuText)
            }
            e.target.classList.remove("unpressed-nyuryoku-shingou")
            e.target.classList.add("pressed-nyuryoku-shingou")
            props.setIsNyuryokuShingou(true)
        }
    }

    const isNyuryoku = props.isNyuryokuShingou ? "オン" : "オフ"

    return (
        <div ref={topMenuRef} className="top-menu">
            <div className="top-menu-button save-file unselectable" onClick={() => handleFileSave()}>
                プロジェクトファイルを保存
            </div>
            <div className="top-menu-button import-file unselectable">
                <label htmlFor="top-menu-file-upload">
                    プロジェクトファイルを開く
                    <input id="top-menu-file-upload" accept=".txt" type="file" onChange={(e) => handleFileImport(e)}/>
                </label>
            </div>
            <div className="top-menu-button tannikannsann" onClick={() => openTanni()}>単位換算</div>
            <Tannikannsann layerRef={props.layerRef} topMenuRef={topMenuRef} closeTanni={closeTanni}/>
            <div className="top-menu-button unpressed-nyuryoku-shingou" onClick={(e) => toggleNyuryokuShingou(e)}>入力信号: {isNyuryoku}</div>
        </div>
    )
}

const Tannikannsann = (props) => {
    const [application, setApplication] = useState("ねじリード")
    const [bunkainou, setBunkainou] = useState(300)

    const nyuryokuInput = useRef()
    const shuturyokuInput = useRef()
    const susumiInput = useRef()
    const pulseText = useRef()

    const getPulse = () => {
        let kyori = 100
        let nyuryoku = parseInt(nyuryokuInput.current.value.trim())
        let shuturyoku = parseInt(shuturyokuInput.current.value.trim())
        let susumiryou = parseInt(susumiInput.current.value.trim())
        switch(application) {
            case "ねじリード":
                break;
            default:
                susumiryou = parseInt(susumiInput.current.value.trim()) * Math.PI
        }
        let pulse = kyori * (1/susumiryou) * parseInt(bunkainou) * (nyuryoku/shuturyoku)

        // pulseText.current.innerText = pulse
        props.closeTanni(props.topMenuRef, props.layerRef)
    }

    const getApplicationType = () => {
        switch (application) {
            case "ボールねじ":
                return ["ねじリード", "ねじリード"]
            case "タイミングベルト":
                return ["ブーリ直径", "ブーリ直径xπ"]
            case "ラック&ピニオン":
                return ["ピニオン直径", "ピニオン直径xπ"]
            default:
                return ["ねじリード", "ねじリード"]
        }
    }

    return (
        <div className="tannikannsann-popup">
            <div className="close-popup close-tannikannsann" onClick={() => props.closeTanni(props.topMenuRef, props.layerRef)}><i className="fas fa-times-circle"></i></div>
            <div className="tannikannsann-main">
                <div>
                    <div className="select-bunnkainou">
                        <p>分解能: </p>
                        <Dropdown setItem={setBunkainou} itemArr={[300, 600, 1000, 1200, 2000, 3000, 5000, 6000, 10000, 12000]} />
                        <p>ppr</p>
                    </div>
                    <div className="type-gensoku-hiritu">
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>入力</th>
                                    <th> : </th>
                                    <th>出力</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>減速比率: </td>
                                    <td><input ref={nyuryokuInput} type="text" className="nyu-shutu-input"/></td>
                                    <td></td>
                                    <td><input ref={shuturyokuInput} type="text" className="nyu-shutu-input"/></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    <div className="select-application">
                        <p>アプリケーション: </p>
                        <Dropdown setItem={setApplication} itemArr={["ボールねじ", "タイミングベルト", "ラック&ピニオン"]} />
                    </div>
                    <div className="type-susumi-ryou">
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th>モータ1回転の進み量</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{getApplicationType()[0]}: </td>
                                    <td><input ref={susumiInput} type="text" className="susumi-ryou-input"/></td>
                                    <td>mm</td>
                                    <td>{getApplicationType()[1]}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Button className="tannikannsann-ok" variant="contained" onClick={() => getPulse()}>OK</Button>
            {/* <div>パルス　=　<p ref={pulseText}></p></div> */}
            {/* <div className="pulse-formula-box"> */}
                {/* <p>パルス　=　距離[𝑚𝑚] × (1/進み量[𝑚𝑚⁄回転]) × 分解能[パルス/回転] × (入力/出力)</p> */}
            {/* </div> */}
        </div>
    )
}

const Dropdown = (props) => {
    const itemArr = props.itemArr
    const setItem = props.setItem

    const [selectedItem, setSelectedItem] = useState(itemArr[0])

    const dropdownItems = useRef()
    const selectedItemRef = useRef()

    const dropdowns = () => {
        return itemArr.map(item => {
            return (
                <div className="dropdown-item unselectable" onClick={(e) => clickItem(e)} key={item}>{item}</div>
            )
        })
    }

    const showItems = () => {
        dropdownItems.current.style.display = "block"
    }
    
    const clickItem = (e) => {
        setSelectedItem(e.target.innerText)
        dropdownItems.current.style.display = "none"
        setItem(e.target.innerText)
    }


    return (
        <div className="dropdown-selector">
            <div ref={selectedItemRef} className="selected-item unselectable" onClick={() => showItems()}>{selectedItem}<i className="fas fa-angle-down"></i></div>
            <div ref={dropdownItems} className="dropdown-items unselectable">
                {dropdowns()}
            </div>
        </div>
    )
}