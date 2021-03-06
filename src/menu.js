import React, { useEffect, useRef, useState } from 'react';
import { WizardGensoku, WizardKikou, WizardSusumiryou, WizardBunkai, WizardJiku } from './tanni-funcs';
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
    const muteIconRef = useRef()

    const handleFileImport = (e) => {
        const reader = new FileReader()
        reader.onload = async (e) => { 
            // const obj = JSON.parse(e.target.result)
            const obj = JSON.parse(reader.result)
            // try {
                props.setJiku(obj.data.jiku)
                props.setTannikannsannData(obj.data.tannikannsannData)
                props.setProgramData(obj.data.programData)
                props.setLoopData(obj.data.loopData)
                props.setCmlOutput(toCML(obj.data.programData, obj.data.loopData, obj.data.isNyuryokuShingou, obj.data.tannikannsannData))
            // } catch (err) {
            //     alert('ファイルが間違っています')
            // }
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
        let obj = {"name":"cml-import","data":{"jiku":props.jiku,"tannikannsannData":props.tannikannsannData,"programData":props.programData,"loopData":props.loopData,"isNyuryokuShingou":props.isNyuryokuShingou}}
        const data = JSON.stringify(obj)
        const filename = "CML-途中保存"
        const type = ".txt"
        downloadFile(data, filename, type)
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

    const openTanni = () => {
        topMenuRef.current.querySelector('.tannikannsann-popup').style.display = "flex"
        props.layerRef.current.style.display = "block"
    }

    const closeTanni = (topMenuRef, layerRef) => {
        topMenuRef.current.querySelector('.tannikannsann-popup').style.display = "none"
        layerRef.current.style.display = "none"
    }

    const toggleNyuryokuShingou = (e) => {
        const nyuryokuText = `\nK81=1\nK82=1\nL1.1\nI1.1,JL2.1,T0.1\nI2.1,JL3.1,T0.1\nI3.1,JL4.1,T0.1\nI4.1,].1:].1,T0.1\nL2.1\n[1.1\nI1.1,W0.1,JL1.1\nL3.1\n[2.1\nI2.1,W0.1,JL1.1\nL4.1\n[3.1\nI3.1,W0.1,JL1.1\nEND`

        let isPressed = e.currentTarget.classList.contains("pressed-nyuryoku-shingou")
        if (isPressed) {
            if (props.cmlOutput.includes(nyuryokuText)) {
                let tmpstr = props.cmlOutput
                props.setCmlOutput(tmpstr.replace(nyuryokuText,''))
            }
            e.currentTarget.classList.remove("pressed-nyuryoku-shingou")
            e.currentTarget.classList.add("unpressed-nyuryoku-shingou")
            props.setIsNyuryokuShingou(false)
        } else {
            if (!props.cmlOutput.includes(nyuryokuText)) {
                let tmpstr = props.cmlOutput
                props.setCmlOutput(tmpstr+nyuryokuText)
            }
            e.currentTarget.classList.remove("unpressed-nyuryoku-shingou")
            e.currentTarget.classList.add("pressed-nyuryoku-shingou")
            props.setIsNyuryokuShingou(true)
        }
    }

    const toggleIsMute = (e) => {
        let isPressed = muteIconRef.current.classList.contains("fa-volume-xmark")
        if (isPressed) {
            muteIconRef.current.classList.remove("fa-volume-xmark")
            muteIconRef.current.classList.add("fa-volume-high")
            props.setIsMute(false)
        } else {
            muteIconRef.current.classList.remove("fa-volume-high")
            muteIconRef.current.classList.add("fa-volume-xmark")
            props.setIsMute(true)
        }
    }

    const isNyuryoku = props.isNyuryokuShingou ? "実行" : "停止"
    const muteIcon = props.isMute ? "volume-xmark" : "volume-high"
    // --
    const expSave = useRef() 
    const expImp = useRef() 
    const expTanni = useRef() 
    const expNyuryoku = useRef() 

    return (
        <div ref={topMenuRef} className="top-menu">
            <div className="top-menu-button save-file unselectable" onMouseEnter={() => display(expSave)} onMouseLeave={() => hide(expSave)} onClick={() => handleFileSave()}>
                <i className="fa-solid fa-floppy-disk"></i>プロジェクトファイルを保存
                <div ref={expSave} className="exp-box hidden">作成途中のプロジェクトを保存します</div>
            </div>
            
            <div className="top-menu-button import-file unselectable" onMouseEnter={() => display(expImp)} onMouseLeave={() => hide(expImp)}>
                <label htmlFor="top-menu-file-upload">
                    <i className="fa-solid fa-folder-open"></i>プロジェクトファイルを開く
                    <input id="top-menu-file-upload" accept=".txt" type="file" onChange={(e) => handleFileImport(e)}/>
                </label>
                <div ref={expImp} className="exp-box hidden">保存したプロジェクトを開きます</div>
            </div>
            <div className="top-menu-button tannikannsann unselectable" onMouseEnter={() => display(expTanni)} onMouseLeave={() => hide(expTanni)} onClick={() => openTanni()}>
                <i className="fa-solid fa-gears"></i>単位換算
                <div ref={expTanni} className="exp-box hidden">表示単位と分解能を設定します</div>
            </div>
            <Tannikannsann jiku={props.jiku} tannikannsannData={props.tannikannsannData} setTannikannsannData={props.setTannikannsannData} application={props.application} setApplication={props.setApplication} tanniValue={props.tanniValue} setTanniValue={props.setTanniValue} layerRef={props.layerRef} topMenuRef={topMenuRef} closeTanni={closeTanni}/>
            <div className="top-menu-button unpressed-nyuryoku-shingou unselectable" onMouseEnter={() => display(expNyuryoku)} onMouseLeave={() => hide(expNyuryoku)} onClick={(e) => toggleNyuryokuShingou(e)}>
            {/* <div className={"top-menu-button unpressed-nyuryoku-shingou "+} onMouseEnter={() => display(expNyuryoku)} onMouseLeave={() => hide(expNyuryoku)} onClick={(e) => toggleNyuryokuShingou(e)}> */}
                <i className="fa-solid fa-rotate"></i>入力点からの{isNyuryoku}
                <div ref={expNyuryoku} className="exp-box hidden">入力点1～3の機能を動作グループ1～3の実行に、入力点4を停止に割付けます。</div>
            </div>
            <div className='top-menu-button mute-button unselectable' onClick={(e) => toggleIsMute(e)}>
                <i ref={muteIconRef} className={"fa-solid fa-"+muteIcon}></i>
            </div>
        </div>
    )
}

const Tannikannsann = (props) => {
    // props: tanniValue, setTanniValue, application, setApplication, tannikannsannData, setTannikannsannData
    
    const close = () => {
        props.closeTanni(props.topMenuRef, props.layerRef)
    }
    
    const WizardController = (props) => {
        const [history, setHistory] = useState([])
        const [wizardInput, setWizardInput] = useState(["jiku", []])

        const inputForm = () => {
            const params = {
                wizardInput: wizardInput[1], 
                history, setHistory, setWizardInput,
                tannikannsannData: props.tannikannsannData, setTannikannsannData: props.setTannikannsannData,
                jiku: props.jiku
            }
        
            switch (wizardInput[0]) {
                case "jiku":
                    return <WizardJiku params={params} />
                case "kikou":
                    return <WizardKikou params={params} />
                case "susumiryou":
                    return <WizardSusumiryou params={params} />
                case "gensoku":
                    return <WizardGensoku params={params} />
                case "bunkai":
                    return <WizardBunkai close={props.close} params={params} />
                default:
                    return <WizardKikou params={params}/>
            }
        }

        return (
            <div className='wizard-controller'>
                    {inputForm()}
            </div>
        )
    } 

    return (
        <div className="tannikannsann-popup">
            <div className="close-popup close-tannikannsann" onClick={() => close()}><i className="fas fa-times-circle"></i></div>
            <WizardController close={close} jiku={props.jiku} tannikannsannData={props.tannikannsannData} setTannikannsannData={props.setTannikannsannData} />
        </div>
    )
}
