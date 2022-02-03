import { Button } from "@mui/material"
import { useRef, useState } from "react"

export const WizardKikou = (props) => {
    const params = props.params

    const [input, setInput] = useState(params.wizardInput)

    const goNext = () => {
        if (input !== "モータ単体" && input !== "テーブル") {
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
        <div className="tanni-wizard">
            <p className="tanni-wizard-title">機構の選択</p>
            <div className="tanni-wizard-selector">
                <div>
                    <input type="radio" onClick={(e) => setInput(e.currentTarget.value)} id="kikou-1" name="kikou-sentaku" value="モータ単体"/>
                    <label htmlFor="kikou-1">モータ単体</label>
                </div>
                <div>
                    <input type="radio" onClick={(e) => setInput(e.currentTarget.value)} id="kikou-2" name="kikou-sentaku" value="ボールねじ" />
                    <label htmlFor="kikou-2">ボールねじ</label>
                </div>
                <div>
                    <input type="radio" onClick={(e) => setInput(e.currentTarget.value)} id="kikou-3" name="kikou-sentaku" value="ベルト駆動" />
                    <label htmlFor="kikou-3">ベルト駆動</label>
                </div>
                <div>
                    <input type="radio" onClick={(e) => setInput(e.currentTarget.value)} id="kikou-4" name="kikou-sentaku" value="ラックアンドピニオン" />
                    <label htmlFor="kikou-4">ラックアンドピニオン</label>
                </div>
                <div>
                    <input type="radio" onClick={(e) => setInput(e.currentTarget.value)} id="kikou-5" name="kikou-sentaku" value="テーブル" />
                    <label htmlFor="kikou-5">テーブル</label>
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
    const [input, setInput] = useState([0, 0])

    switch (mode) {
        case "ボールねじ":
            susumiryouText = "ボールねじリード"
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
        tmp.push(["susumiryou", input])
        params.setHistory(tmp)
        params.setWizardInput(["gensoku", input])
        params.setValueArr([input, params.valueArr[1], params.valueArr[2]])
    }

    const goBack = () => {
        let tmp = [...params.history]
        let kikouValue = tmp[0][1]
        params.setHistory([])
        params.setWizardInput(["kikou", kikouValue])
    }

    const changeInput = (e, index) => {
        let tmp = [...input]
        tmp[index-1] = e.currentTarget.value
        setInput(tmp)
    }

    return (
        <div className="tanni-wizard">
            <p className="tanni-wizard-title">モータ1回転あたりの進み量</p>
            <div className="tanni-wizard-selector">
                <div>
                    <p className='tanni-susumi-p'>{susumiryouText} : </p>
                    <input type="text" placeholder={0} onChange={(e) => changeInput(e, 1)}/>
                    <p className='tanni-susumi-tanni'> mm</p>
                </div>
                <div>
                    <p className='tanni-susumi-p'>進み量 : </p>
                    <input type="text" placeholder={0} onChange={(e) => changeInput(e, 2)}/>
                    <p className='tanni-susumi-tanni'> mm</p>
                </div>
            </div>
            <div className="tanni-wizard-buttons">
                <Button className="tanni-back" variant="contained" onClick={() => goBack()}>BACK</Button>
                <Button className="tanni-next" variant="contained" onClick={() => goNext()}>NEXT</Button>
            </div>
        </div>
    )
}

export const WizardGensoku = (props) => {
    const params = props.params
    const [input, setInput] = useState([0, 0])

    const goNext = () => {
        let tmp = [...params.history]
        tmp.push(["gensoku", input])
        params.setHistory(tmp)
        params.setWizardInput(["hyouji", input])
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
        tmp[index-1] = e.currentTarget.value
        setInput(tmp)
    }

    return (
        <div className="tanni-wizard">
            <div className="tanni-wizard-title gensoku-title"><input type="checkbox" />減速比率</div>
            <div className="tanni-wizard-selector">
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
                            <td><input type="text" onChange={(e) => changeInput(e, 1)}/></td>
                            <td>  :  </td>
                            <td><input type="text" onChange={(e) => changeInput(e, 2)}/></td>
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

export const WizardHyouji = (props) => {
    const params = props.params
    const [input, setInput] = useState("パルス")

    const goNext = () => {
        let tmp = [...params.history]
        tmp.push(["hyouji", input])
        params.setHistory(tmp)
        params.setWizardInput(["bunkai", input])
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

    const radios = () => {
        switch (params.history[0][1]) {
            case "ボールねじ" || "ベルト駆動" || "ラックアンドピニオン":
                return (
                    <><div>
                        <input type="radio" onClick={(e) => setInput(e.currentTarget.value)} id="hyouji-1" name="hyouji-sentaku" value="パルス" defaultChecked />
                        <label htmlFor="hyouji-1">パルス</label>
                    </div>
                    <div>
                        <input type="radio" onClick={(e) => setInput(e.currentTarget.value)} id="hyouji-2" name="hyouji-sentaku" value="mm" />
                        <label htmlFor="hyouji-2">mm</label>
                    </div></>
                )
            default: 
                return (
                    <><div>
                        <input type="radio" onClick={(e) => setInput(e.currentTarget.value)} id="hyouji-1" name="hyouji-sentaku" value="パルス" defaultChecked />
                        <label htmlFor="hyouji-1">パルス</label>
                    </div>
                    <div>
                        <input type="radio" onClick={(e) => setInput(e.currentTarget.value)} id="hyouji-3" name="hyouji-sentaku" value="角度" />
                        <label htmlFor="hyouji-3">角度</label>
                    </div></>
                )
        }
    }

    return (
        <div className="tanni-wizard">
            <p className="tanni-wizard-title">表示単位</p>
            <div className="tanni-wizard-selector">
                {radios()}
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
    const mode = params.wizardInput
    let bunkaiText = ""
    const [input, setInput] = useState("0")

    switch (mode) {
        case "パルス":
            bunkaiText = "パルス"
            break
        case "mm":
            bunkaiText = "mm"
            break
        case "角度":
            bunkaiText = "°"
            break
        default:
            bunkaiText = "パルス"
            break
    }

    const goOK = () => {
        let tmp = [...params.history]
        tmp.push(["hyouji", input])
        params.setHistory(tmp)
        params.setWizardInput(["bunkai", input])
        let valueArr = [...params.valueArr]
        valueArr[1] = input
        props.getTanniValue(props.setTanniValue, valueArr)
        console.log(props.tanniValue)
        params.setValueArr(valueArr)
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
        <div className="tanni-wizard">
            <p className="tanni-wizard-title">分解能</p>
            <div className="tanni-wizard-selector">
                <Dropdown setItem={setInput} itemArr={[300, 600, 1000, 1200, 2000, 3000, 5000, 6000, 10000, 12000]} />
                <p className="tanni-bunkai-text">{bunkaiText}</p>
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
