import { Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { WizardGensoku, WizardKikou, WizardSusumiryou, WizardHyouji, WizardBunkai } from './tanni-funcs';
import { toCML } from './toCml';

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
                props.setJiku(obj.data.jiku)
                props.setProgramData(obj.data.programData)
                props.setLoopData(obj.data.loopData)
                props.setCmlOutput(toCML(obj.data.programData, obj.data.loopData, obj.data.isNyuryokuShingou))
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
        let obj = {"name":"cml-import","data":{"jiku":props.jiku,"programData":props.programData,"loopData":props.loopData,"isNyuryokuShingou":props.isNyuryokuShingou}}
        const data = JSON.stringify(obj)
        const filename = "CML-途中保存"
        const type = ".txt"
        downloadFile(data, filename, type)
    }

    const openTanni = () => {
        topMenuRef.current.querySelector('.tannikannsann-popup').style.display = "flex"
        props.layerRef.current.style.display = "block"
    }

    const closeTanni = (topMenuRef, layerRef) => {
        topMenuRef.current.querySelector('.tannikannsann-popup').style.display = "none"
        layerRef.current.style.display = "none"
    }

    const toggleNyuryokuShingou = (e) => {
        const nyuryokuText = `K81=1\nK82=1\nL1.1\nI1.1,JL2.1,T0.1\nI2.1,JL3.1,T0.1\nI3.1,JL4.1,T0.1\nI4.1,].1:].1,T0.1\nL2.1\n[1.1\nI1.1,W0.1,JL1.1\nL3.1\n[2.1\nI2.1,W0.1,JL1.1\nL4.1\n[3.1\nI3.1,W0.1,JL1.1\nEND`

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
            <div className="top-menu-button tannikannsann unselectable" onClick={() => openTanni()}>単位換算</div>
            <Tannikannsann tanniValue={props.tanniValue} setTanniValue={props.setTanniValue} layerRef={props.layerRef} topMenuRef={topMenuRef} closeTanni={closeTanni}/>
            <div className="top-menu-button unpressed-nyuryoku-shingou unselectable" onClick={(e) => toggleNyuryokuShingou(e)}>入力信号: {isNyuryoku}</div>
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

    const getPulse = (tanniValue) => {
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

    const WizardController = () => {
        const [history, setHistory] = useState([])
        const [wizardInput, setWizardInput] = useState(["kikou", "モータ単体"])

        useEffect(() => {
            console.log(wizardInput)
        }, [wizardInput])

        const inputForm = () => {
            const params = {
                wizardInput: wizardInput[1], history, setHistory, setWizardInput
            }
        
            switch (wizardInput[0]) {
                case "kikou":
                    return <WizardKikou params={params} />
                case "susumiryou":
                    return <WizardSusumiryou params={params} />
                case "gensoku":
                    return <WizardGensoku params={params} />
                case "hyouji":
                    return <WizardHyouji params={params} />
                case "bunkai":
                    return <WizardBunkai getPulse={getPulse} setTanniValue={props.setTanniValue} params={params} />
            }
        }

        return (
            <div className='wizard-controller'>
                <div className='wizard-input'>
                    {inputForm()}
                </div>
                <div className='wizard-buttons'>
                </div>
            </div>
        )
    } 

    return (
        <div className="tannikannsann-popup">
            <div className="close-popup close-tannikannsann" onClick={() => props.closeTanni(props.topMenuRef, props.layerRef)}><i className="fas fa-times-circle"></i></div>
            <div className="tannikannsann-wrapper">
                <WizardController />
            </div>
            
            {/* <div>パルス　=　<p ref={pulseText}></p></div> */}
            {/* <div className="pulse-formula-box"> */}
                {/* <p>パルス　=　距離[𝑚𝑚] × (1/進み量[𝑚𝑚⁄回転]) × 分解能[パルス/回転] × (入力/出力)</p> */}
            {/* </div> */}
        </div>
    )
}

