const TypeDataInDousa = (props) => {
    // let dousaType = props.dousaType
    // let dousaNum = props.dousaNum
    // let parentId = props.parentId
    const popupRef = useRef()
    // --
    let indexArr = props.parentId.split('-')
    indexArr.shift()
    // --
    let values
    let tmp
    if (props.dousaType !== "繰り返し") {
        tmp = [...props.programData]
        values = [...tmp[parseInt(indexArr[0])][parseInt(indexArr[1])][parseInt(indexArr[2])][2]]
    } else {
        tmp = [...props.loopData]
        values = [tmp[parseInt(indexArr[0])][2]]
    }

    const closeTypeData = () => {
        popupRef.current.style.display = "none"
    }

    const setTypeData = (e) => {
        let isAllNumber = true
        e.target.parentNode.querySelectorAll('.type-data-input').forEach(input => {
            if (isNaN(parseInt(input.value))) {
                isAllNumber = false
            }
        })
        if (isAllNumber) {
            closeTypeData()
        } else {
            alert('数値を入力してください') 
        }
    } 

    const DataBox = () => {
        const [valueArr, setValueArr] = useState(tmp[parseInt(indexArr[0])][parseInt(indexArr[1])][parseInt(indexArr[2])])

    }

    const DataInput = (props) => {
        // const data = [100, "pps"]
        const index = props.index
        let data = tmp[parseInt(indexArr[0])][parseInt(indexArr[1])][parseInt(indexArr[2])]
        const [value, setValue] = useState(87654325678)
        const setTanni = (tanni) => {
            data[2][index][1] = tanni
            props.setProgramData(tmp)
        }
        // const setValue = (value) => {
            // data[2][index][0] = value
            // props.setProgramData(tmp)
        // }
        const handleDataInput = (e) => {
            setValue(e.currentTarget.value)
            data[2][index][0] = value
            props.setProgramData(tmp)
        }
    
        return (
            <>
                <input className="type-data-input" onChange={(e) => handleDataInput(e)} key={1} value={value}/>
                {/* <input className="type-data-input" onChange={(e) => handleDataInput(e)} key={1} value={props.programData[parseInt(indexArr[0])][parseInt(indexArr[1])][parseInt(indexArr[2])][2][index]}/> */}
                <p className="type-data-tanni" key={2}><Dropdown setItem={setTanni} itemArr={["pps", "mm/s"]} /></p>
            </>
        )
    }

    let dousaInput

    switch (props.dousaType) {
        case "位置決め":
            dousaInput = [
                // [<p className="typedata-var" key={0}>速度データ</p>,<input className="type-data-input" onChange={() => handleDataInput()} key={1} placeholder={values[0]}/>,<p className="type-data-tanni" key={2}>mm/s<span>と</span></p>],
                // [<p className="typedata-var" key={0}>速度データ</p>,<input className="type-data-input" onChange={() => handleDataInput()} key={1} placeholder={values[0]}/>,<p className="type-data-tanni" key={2}><Dropdown setItem={setInput} itemArr={["pps", "mm/s"]} /></p>,<p>と</p>],
                [<p className="typedata-var" key={0}>速度データ</p>,<DataInput index={0} programData={props.programData} setProgramData={props.setProgramData} key={1} />,<p key={2}>と</p>],
                // [<p className="typedata-var" key={0}>加速度データ</p>,<input className="type-data-input" onChange={() => handleDataInput()} key={1} placeholder={values[1]}/>,<p className="type-data-tanni" key={2}>mm/s2<span>で</span></p>],
                // [<p className="typedata-var" key={0}>位置データ</p>,<input className="type-data-input" onChange={() => handleDataInput()} key={1} placeholder={values[2]}/>,<p className="type-data-tanni" key={2}>mm<span>へ移動する</span></p>]
            ]
            break
        // case "押付け":
        //     dousaInput = [
        //         [<p className="typedata-var" key={0}>速度データ</p>,<input className="type-data-input" onChange={() => handleDataInput()} key={1} placeholder={values[0]}/>,<p className="type-data-tanni" key={2}>mm/s<span>と</span></p>],
        //         [<p className="typedata-var" key={0}>加速度データ</p>,<input className="type-data-input" onChange={() => handleDataInput()} key={1} placeholder={values[1]}/>,<p className="type-data-tanni" key={2}>mm/s2<span>で</span></p>],
        //         [<p className="typedata-var" key={0}>位置データ</p>,<input className="type-data-input" onChange={() => handleDataInput()} key={1} placeholder={values[2]}/>,<p className="type-data-tanni" key={2}>mm<span>へ押付け動作する</span></p>]
        //     ]
        //     break
        // case "トルク制限":
        //     dousaInput = [
        //         [<p className="typedata-var" key={0}>トルク制限データ<span>を</span></p>,<input className="type-data-input" onChange={() => handleDataInput()} key={1} placeholder={values[0]}/>,<p className="type-data-tanni" key={2}>%<span>に設定する</span></p>]
        //     ]
        //     break
        // case "タイマ":
        //     dousaInput = [
        //         [<p className="typedata-var" key={0}>タイマデータ<span>を</span></p>,<input className="type-data-input" onChange={() => handleDataInput()} key={1} placeholder={values[0]}/>,<p className="type-data-tanni" key={2}>msec<span>に設定する</span></p>]
        //     ]
        //     break
        // case "繰り返し":
        //     dousaInput = [
        //        [<input className="type-data-input" onChange={() => handleDataInput()} key={0} value={0}/>,<p className="type-data-tanni" key={1}>回<span>繰り返す</span></p>]
        //     ]
        //     break
        default:
            dousaInput = [[<div>NOPE</div>]]
            break
    }

    const NumDropDown = () => {
        const tmp = [...props.programData]
        
        const [currentNum, setCurrentNum] = useState(tmp[parseInt(indexArr[0])][parseInt(indexArr[1])][parseInt(indexArr[2])][1])
        const numItemRef = useRef()
        const currentNumRef = useRef()
        
        
        const selectItem = (e) => {
            let indexArr = e.target.parentNode.parentNode.id.split('-')
            indexArr.shift()
            const value = parseInt(e.currentTarget.id.split("-")[2])
            setCurrentNum(value)
            numItemRef.current.style.display = "none"
            for (let dousa_group of tmp[parseInt(indexArr[0])]) {
                for (let dousa of dousa_group) {
                    if (dousa[1] === value) {
                        tmp[parseInt(indexArr[0])][parseInt(indexArr[1])][parseInt(indexArr[2])][2] = dousa[2]
                    }
                }
            }
            tmp[parseInt(indexArr[0])][parseInt(indexArr[1])][parseInt(indexArr[2])][1] = value
            props.setProgramData(tmp)
        }

        const getNumItems = () => {
            let res = []
            let i = 1
            while (i <= 250) {
                res.push(<div className='num-dropdown-item' key={i} id={"num-dropdown-"+i} onClick={(e) => selectItem(e)}><p>{i}</p></div>)
                i += 1
            }
            return res
        }

        const showItems = () => {
            let isItemsShown = numItemRef.current.style.display !== "block" ? false : true
            if (!isItemsShown) {
                numItemRef.current.style.display = "block"
            } else {
                numItemRef.current.style.display = "none"
            }
        }

        return (
            <div className='num-dropdown'>
                <div className='currentNum-container' onClick={() => showItems()}><p ref={currentNumRef} className='currentNum'>{currentNum}</p><i className='fas fa-caret-down'></i></div>
                <div ref={numItemRef} className='num-dropdown-item-container'>{getNumItems()}</div>
            </div>
        )
    }

    const dataNum = (props.dousaType !== "繰り返し") ? 
        <div className='typedata-input-line' key={"input-num-line"}>
            <p className='typedata-var'>番号:</p><NumDropDown/>
            {/* <input className="type-data-input" onChange={() => handleDataInput()} key={"input-num"}/> */}
        </div> : ""

    return (
        <div className="typeDataInDousa" ref={popupRef}>
            <div className="close-typedata"><i onClick={() => closeTypeData()} className="fas fa-times-circle"></i></div>
            {dataNum}
            {dousaInput.map(inputLine => {return <div className="typedata-input-line" key={dousaInput.indexOf(inputLine)+inputLine}>{inputLine}</div>})}
            <Button className="type-data-button" variant="contained" onClick={(e) => setTypeData(e)}>OK</Button>
        </div>
    )
}