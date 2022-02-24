import { Button } from "@mui/material"
import { useEffect, useRef, useState } from "react"

// ------------------------------------
// export const WizardJiku = (props) => {}
// ------------------------------------

export const WizardKikou = (props) => {
    const params = props.params
    const tkData = params.tannikannsannData

    const [input, setInput] = useState(params.history.length > 0 ? params.history[0][1] : (tkData.kikou !== "initial" ? tkData.kikou : params.wizardInput))
    const radioRef = useRef()

    useEffect(() => {
        if (params.history.length >= 1) {
            let arr = ["ボールねじ", "ベルト駆動", "ラックアンドピニオン", "インデックステーブル"]
            let i = arr.indexOf(input) + 1
            radioRef.current.querySelector('#kikou-'+i).checked = true
        }
    }, [input])

    const goNext = () => {
        let isCheckedArr = []
        radioRef.current.querySelectorAll('input').forEach(input => {
            if (input.checked === true) {
                isCheckedArr.push("true")
            }
        })
        if (isCheckedArr.length !== 1) {
            alert('機構を選択してください')
        } else {
            let tmp = [...params.history]
            if (params.history.length === 0) {
                tmp.push(["kikou", input])
                if (input !== "インデックステーブル") {
                    params.setWizardInput(["susumiryou", input])
                } else {
                    tmp.push(["susumiryou", 1])
                    params.setWizardInput(["gensoku", input])
                }
            } else {
                tmp[0] = ["kikou", input]
                if (input !== "インデックステーブル") {
                    params.setWizardInput(["susumiryou", input])
                } else {
                    tmp[1] = ["susumiryou", 1]
                    params.setWizardInput(["gensoku", input])
                }
            }
            params.setHistory(tmp)
        }
    }

    return (
        <div className="tanni-wizard unselectable">
            <p className="tanni-wizard-title">機構の選択</p>
            <div ref={radioRef} className="tanni-wizard-selector tanni-kikou">
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
    const tkData = params.tannikannsannData
    const mode = params.history[0][1]
    let susumiryouText = ""
    let susumiryouVar = 3.1415926535 // or Math.PI
    const [input, setInput] = useState((params.history.length > 1) ? parseFloat(params.history[1][1]) : tkData.susumiryou)

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
        if (params.history.length === 1) {
            tmp.push(["susumiryou", Math.round((parseFloat(input)*susumiryouVar + Number.EPSILON) * 100) / 100])
        } else {
            tmp[1] = ["susumiryou", Math.round((parseFloat(input)*susumiryouVar + Number.EPSILON) * 100) / 100]
        }
        params.setHistory(tmp)
        params.setWizardInput(["gensoku", input])
        params.setValueArr([parseFloat(input)*susumiryouVar, params.valueArr[1], params.valueArr[2]])
    }

    const goBack = () => {
        let tmp = [...params.history]
        let kikouValue = tmp[0][1]
        params.setWizardInput(["kikou", kikouValue])
    }

    return (
        <div className="tanni-wizard">
            <p className="tanni-wizard-title unselectable">モータ1回転あたりの進み量</p>
            <div className="tanni-wizard-selector tanni-susumi">
                <div className="susumi-1">
                    <p className='tanni-susumi-p'>{susumiryouText} : </p>
                    {(params.history.length > 1) ? 
                    <input type="text" value={input} onChange={(e) => setInput(e.currentTarget.value)}/>
                    : <input type="text" placeholder={0} onChange={(e) => setInput(e.currentTarget.value)}/>
                    }
                    <p className='tanni-susumi-tanni'> mm</p>
                </div>
                <div className="susumi-2">
                    <p className='tanni-susumi-p'>進み量 : <span>{Math.round((parseFloat(input)*susumiryouVar + Number.EPSILON) * 100) / 100}</span> mm</p>
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
    const tkData = params.tannikannsannData
    const [input, setInput] = useState((params.history.length >= 3) ? params.history[2][1] : tkData.gensoku)
    const checkBoxRef = useRef()
    const selectorRef = useRef()

    useEffect(() => {
        if (params.history.length > 2) {
            if (params.history[2][1][0] !== 1 || params.history[2][1][1] !== 1) {
                selectorRef.current.style.opacity = "1"
                checkBoxRef.current.checked = "true"
                selectorRef.current.querySelectorAll("input").forEach(input => {
                    input.readOnly = false
                })
            }
        }
    })

    const goNext = () => {
        let tmp = [...params.history]
        if (params.history.length === 2) {
            tmp.push(["gensoku", input])
        } else {
            tmp[2] = ["gensoku", input]
        }
        params.setHistory(tmp)
        params.setWizardInput(["bunkai", input])
        params.setValueArr([params.valueArr[0], params.valueArr[1], input])
    }

    const goBack = () => {
        if (params.history[0][1] !== "インデックステーブル") {
            params.setWizardInput(["susumiryou", 0])
        } else {
            params.setWizardInput(["kikou", 0])
        }
    }

    const changeInput = (e, index) => {
        let tmp = [...input]
        tmp[index-1] = parseFloat(e.currentTarget.value)
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
            <div className="tanni-wizard-title gensoku-title"><input ref={checkBoxRef} type="checkbox" onChange={(e) => handleToggle(e)} />減速比率</div>
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
                            <td><input type="text" readOnly value={input[0]} onChange={(e) => changeInput(e, 1)}/></td>
                            <td>  :  </td>
                            <td><input type="text" readOnly value={input[1]} onChange={(e) => changeInput(e, 2)}/></td>
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
    const tkData = params.tannikannsannData
    const mode = params.history[0][1]
    let bunkaiText = ""
    let bunkaiVar = 1
    const [input, setInput] = useState(params.history.length === 4 ? params.history[3][1] : tkData.bunkai)

    switch (mode) {
        case "インデックステーブル":
            bunkaiText = "°"
            bunkaiVar = 360 / (params.history[2][1][1]/params.history[2][1][0])
            break
        default:
            bunkaiText = "mm"
            bunkaiVar = params.history[1][1] / (params.history[2][1][1]/params.history[2][1][0])
            break
    }

    const goOK = () => {
        let tmp = [...params.history]
        tmp.push(["bunkai", Math.round((bunkaiVar/parseFloat(input) + Number.EPSILON) * 100) / 100])
        params.setHistory(tmp)
        params.setWizardInput(["bunkai", Math.round((bunkaiVar/parseFloat(input) + Number.EPSILON) * 100) / 100])
        let valueArr = [...params.valueArr]
        valueArr[1] = input
        props.getTanniValue(props.setTanniValue, valueArr)
        params.setValueArr(valueArr)
        params.setTannikannsannData({kikou:params.history[0][1],susumiryou:params.history[1][1],gensoku:params.history[2][1],bunkai:params.history[3][1]})
        params.setApplication(params.history[0][1])
    }

    const goBack = () => {
        params.setWizardInput(["gensoku", 0])
    }

    const changeInput = (item) => {
        setInput(item)
        let tmp = [...params.history]
        if (tmp.length < 4) {
            tmp.push(["bunkai", item])
        } else {
            tmp[3] = ["bunkai", item]
        }
        params.setHistory(tmp)
    }

    return (
        <div className="tanni-wizard unselectable">
            <p className="tanni-wizard-title">最小位置決め単位</p>
            <div className="tanni-wizard-selector tanni-bunkai">
                <div className="bunkai-1">
                    <p className="tanni-bunkai-text">モータ分解能: </p>
                    <Dropdown setItem={changeInput} defaultItem={input} itemArr={[300, 600, 1000, 1200, 2000, 3000, 5000, 6000, 10000, 12000]} />
                    <p className="tanni-bunkai-text">パルス/回転</p>
                </div>
                <div className="bunkai-2">
                    <p className="tanni-bunkai-text">最小位置決め単位: <span>{Math.round((bunkaiVar/parseFloat(input) + Number.EPSILON) * 100) / 100}</span> {bunkaiText}</p>
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

    const [selectedItem, setSelectedItem] = useState(props.defaultItem !== undefined ? props.defaultItem : itemArr[0])
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