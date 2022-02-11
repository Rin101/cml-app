import { Button } from "@mui/material"
import { useRef, useState } from "react"

export const WizardKikou = (props) => {
    const params = props.params

    const [input, setInput] = useState(params.wizardInput)

    const goNext = () => {
        if (input !== "インデックステーブル") {
            let tmp = [...params.history]
            tmp.push(["kikou", input])
            params.setHistory(tmp)
            params.setWizardInput(["susumiryou", input])
        } else {
            let tmp = [...params.history]
            tmp.push(["kikou", input])
            params.setHistory(tmp)
            params.setWizardInput(["gensoku", input])
        }
    }

    return (
        <div className="tanni-wizard unselectable">
            <p className="tanni-wizard-title">機構の選択</p>
            <div className="tanni-wizard-selector tanni-kikou">
                <div>
                    <input type="radio" onClick={(e) => setInput(e.currentTarget.value)} id="kikou-1" name="kikou-sentaku" value="ボールねじ"/>
                    <label htmlFor="kikou-1">ボールねじ</label>
                </div>
                <div>
                    <input type="radio" onClick={(e) => setInput(e.currentTarget.value)} id="kikou-2" name="kikou-sentaku" value="ベルト駆動" />
                    <label htmlFor="kikou-2">ベルト駆動</label>
                </div>
                <div>
                    <input type="radio" onClick={(e) => setInput(e.currentTarget.value)} id="kikou-3" name="kikou-sentaku" value="ラックアンドピニオン" />
                    <label htmlFor="kikou-3">ラックアンドピニオン</label>
                </div>
                <div>
                    <input type="radio" onClick={(e) => setInput(e.currentTarget.value)} id="kikou-4" name="kikou-sentaku" value="インデックステーブル" />
                    <label htmlFor="kikou-4">インデックステーブル</label>
                </div>
            </div>
            <div className="tanni-wizard-buttons">
                <Button className="tanni-next" variant="contained" onClick={() => goNext()}>NEXT</Button>
            </div>
        </div>
    )
}

export const WizardSusumiryou = (props) => {
    const params = props.params
    const mode = params.wizardInput
    let susumiryouText = ""
    let susumiryouVar = 3.1415926535 // or Math.PI
    const [input, setInput] = useState(0)

    switch (mode) {
        case "ボールねじ":
            susumiryouText = "ボールねじリード"
            susumiryouVar = 1
            break
        case "ベルト駆動":
            susumiryouText = "プーリ直径"
            break
        case "ラックアンドピニオン":
            susumiryouText = "ピニオン直径"
            break
        default:
            susumiryouText = "ボールねじリード"
            break
    }

    const goNext = () => {
        let tmp = [...params.history]
        tmp.push(["susumiryou", parseInt(input)*susumiryouVar])
        params.setHistory(tmp)
        params.setWizardInput(["gensoku", input])
        params.setValueArr([parseInt(input)*susumiryouVar, params.valueArr[1], params.valueArr[2]])
    }

    const goBack = () => {
        let tmp = [...params.history]
        let kikouValue = tmp[0][1]
        params.setHistory([])
        params.setWizardInput(["kikou", kikouValue])
    }

    return (
        <div className="tanni-wizard">
            <p className="tanni-wizard-title unselectable">モータ1回転あたりの進み量</p>
            <div className="tanni-wizard-selector tanni-susumi">
                <div className="susumi-1">
                    <p className='tanni-susumi-p'>{susumiryouText} : </p>
                    <input type="number" placeholder={0} onChange={(e) => setInput(e.currentTarget.value)}/>
                    <p className='tanni-susumi-tanni'> mm</p>
                </div>
                <div className="susumi-2">
                    <p className='tanni-susumi-p'>進み量 : <span>{parseInt(input)*susumiryouVar}</span> mm</p>
                </div>
            </div>
            <div className="tanni-wizard-buttons unselectable">
                <Button className="tanni-back" variant="contained" onClick={() => goBack()}>BACK</Button>
                <Button className="tanni-next" variant="contained" onClick={() => goNext()}>NEXT</Button>
            </div>
        </div>
    )
}

export const WizardGensoku = (props) => {
    const params = props.params
    const [input, setInput] = useState([1, 1])
    const selectorRef = useRef()

    const goNext = () => {
        let tmp = [...params.history]
        tmp.push(["gensoku", input])
        params.setHistory(tmp)
        params.setWizardInput(["bunkai", input])
        params.setValueArr([params.valueArr[0], params.valueArr[1], input])
    }

    const goBack = () => {
        let tmp = [...params.history]
        let index = tmp.length - 1
        const previousMove = tmp[index][0]
        if (index > -1) {
            tmp.splice(index, 1)
        }
        params.setHistory(tmp)
        params.setWizardInput([previousMove, 0])
    }

    const changeInput = (e, index) => {
        let tmp = [...input]
        tmp[index-1] = parseInt(e.currentTarget.value)
        setInput(tmp)
    }

    const handleToggle = (e) => {
        if (e.currentTarget.checked) {
            selectorRef.current.style.opacity = "1"
            selectorRef.current.querySelectorAll("input").forEach(input => {
                input.readOnly = false
            })
        } else {
            selectorRef.current.style.opacity = "0.4"
        }
    }

    return (
        <div className="tanni-wizard unselectable">
            <div className="tanni-wizard-title gensoku-title"><input type="checkbox" onChange={(e) => handleToggle(e)} />減速比率</div>
            <div ref={selectorRef} className="tanni-wizard-selector gensoku-selector">
                <table>
                    <thead>
                        <tr>
                            <th>入力</th>
                            <th></th>
                            <th>出力</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="number" readOnly value={input[0]} onChange={(e) => changeInput(e, 1)}/></td>
                            <td>  :  </td>
                            <td><input type="number" readOnly value={input[1]} onChange={(e) => changeInput(e, 2)}/></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="tanni-wizard-buttons">
                <Button className="tanni-back" variant="contained" onClick={() => goBack()}>BACK</Button>
                <Button className="tanni-next" variant="contained" onClick={() => goNext()}>NEXT</Button>
            </div>
        </div>
    )
}

export const WizardBunkai = (props) => {
    const params = props.params
    const mode = params.history[0][1]
    let bunkaiText = ""
    let bunkaiVar = 1
    const [input, setInput] = useState(1)

    switch (mode) {
        case "インデックステーブル":
            bunkaiText = "°"
            bunkaiVar = 360 / (params.history[1][1][0]/params.history[1][1][1])
            break
        default:
            bunkaiText = "mm"
            bunkaiVar = params.history[1][1] / (params.history[2][1][0]/params.history[2][1][1])
            break
    }

    const goOK = () => {
        let tmp = [...params.history]
        tmp.push(["bunkai", bunkaiVar/parseInt(input)])
        params.setHistory(tmp)
        params.setWizardInput(["bunkai", bunkaiVar/parseInt(input)])
        let valueArr = [...params.valueArr]
        valueArr[1] = input
        props.getTanniValue(props.setTanniValue, valueArr)
        params.setValueArr(valueArr)
        params.setApplication(params.history[0][1])
    }

    const goBack = () => {
        let tmp = [...params.history]
        let index = tmp.length - 1
        const previousMove = tmp[index][0]
        if (index > -1) {
            tmp.splice(index, 1)
        }
        params.setHistory(tmp)
        params.setWizardInput([previousMove, 0])
    }

    return (
        <div className="tanni-wizard unselectable">
            <p className="tanni-wizard-title">最小位置決め単位</p>
            <div className="tanni-wizard-selector tanni-bunkai">
                <div className="bunkai-1">
                    <p className="tanni-bunkai-text">モータ分解能: </p>
                    <Dropdown setItem={setInput} itemArr={[300, 600, 1000, 1200, 2000, 3000, 5000, 6000, 10000, 12000]} />
                    <p className="tanni-bunkai-text">パルス/回転</p>
                </div>
                <div className="bunkai-2">
                    <p className="tanni-bunkai-text">最小位置決め単位: <span>{bunkaiVar/parseInt(input)}</span> {bunkaiText}</p>
                </div>
            </div>
            <div className="tanni-wizard-buttons">
                <Button className="tanni-back" variant="contained" onClick={() => goBack()}>BACK</Button>
                <Button className="tanni-ok" variant="contained" onClick={() => goOK()}>OK</Button>
            </div>
        </div>
    )
}

export const Dropdown = (props) => {
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
        setItem(e.target.innerText)
        dropdownItems.current.style.display = "none"
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