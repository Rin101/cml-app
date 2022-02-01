const TypeDataInDousa = (props) => {
    // let dousaType = props.dousaType
    // let dousaNum = props.dousaNum
    // let parentId = props.parentId
    const popupRef = useRef()
    // --
    let indexArr = props.parentId.split('-')
    indexArr.shift()
    // -
    let tmp = [...props.programData]
    const [tanniArr, setTanniArr] = useState(tmp[parseInt(indexArr[0])][parseInt(indexArr[1])][parseInt(indexArr[2])][2].map(d => {return d[1]}))
    // --
    const closeTypeData = () => {
        popupRef.current.style.display = "none"
    }

    const DataInput = (props) => {
        // const data = [100, "pps"]
        const index = props.index
        const tanni = props.tanni
        const [value, setValue] = useState(tmp[parseInt(indexArr[0])][parseInt(indexArr[1])][parseInt(indexArr[2])][2][index][0])
        let tanniItemArr = props.tanniArr[index] !== "pps" ? [tanni, "pps"] : ["pps", tanni]
        // ---
        const setTanni = (tanni) => {
            let tmp = [...props.tanniArr]
            tmp[index] = tanni
            props.setTanniArr(tmp)
        }

        return (
            <>
                <input className="type-data-input" required value={value} onChange={(e) => setValue(e.target.value)} />
                <div className="type-data-tanni"><Dropdown setItem={setTanni} itemArr={tanniItemArr} /></div>
            </>
        )
    }

    const setTypeData = () => {
        // let isAllNumber = true
        // e.target.parentNode.querySelectorAll('.type-data-input').forEach(input => {
        //     if (isNaN(parseInt(input.value))) {
        //         isAllNumber = false
        //     }
        // })
        // if (isAllNumber) {
        //     closeTypeData()
        // } else {
        //     alert('数値を入力してください') 
        // }
        let valueArr = []
        let inputs = popupRef.current.querySelectorAll("type-data-input")
        let i = 0
        while (i < inputs.length) {
            valueArr.push([inputs[i].value, tanniArr[i]])
            i++
        }
        let tmp = [...props.programData]
        tmp[parseInt(indexArr[0])][parseInt(indexArr[1])][parseInt(indexArr[2])][2] = valueArr
        props.setProgramData(tmp)
    } 

    const dataNum = (props.dousaType !== "繰り返し") ? 
        <div className='typedata-input-line' key={"input-num-line"}>
            {/* <p className='typedata-var'>番号:</p><NumDropDown programData={props.programData} setProgramData={props.programData} indexArr={indexArr}/> */}
        </div> : ""

    return (
        <div className="typeDataInDousa" ref={popupRef}>
            <div className="close-typedata"><i onClick={() => closeTypeData()} className="fas fa-times-circle"></i></div>
            {dataNum}
            <div className="typedata-input-line">
                <p className="typedata-var">速度データ</p>
                <DataInput index={0} tanni={"mm/s"} tanniArr={tanniArr} setTanniArr={setTanniArr} />
                <p>と</p>
            </div>
            <div className="typedata-input-line">
                <p className="typedata-var">加速度データ</p>
                <DataInput index={1} tanni={"mm/s2"} tanniArr={tanniArr} setTanniArr={setTanniArr} />
                <p>で</p>
            </div>
            <div className="typedata-input-line">
                <p className="typedata-var">位置データ</p>
                <DataInput index={2} tanni={"mm"} tanniArr={tanniArr} setTanniArr={setTanniArr} />
                <p>へ移動する</p>
            </div>
            <Button className="type-data-button" variant="contained" onClick={() => setTypeData()}>OK</Button>
        </div>
    )
}

// const NumDropDown = () => {
//     const tmp = [...props.programData]
    
//     const [currentNum, setCurrentNum] = useState(tmp[parseInt(indexArr[0])][parseInt(indexArr[1])][parseInt(indexArr[2])][1])
//     const numItemRef = useRef()
//     const currentNumRef = useRef()
    
    
//     const selectItem = (e) => {
//         let indexArr = e.target.parentNode.parentNode.id.split('-')
//         indexArr.shift()
//         const value = parseInt(e.currentTarget.id.split("-")[2])
//         setCurrentNum(value)
//         numItemRef.current.style.display = "none"
//         for (let dousa_group of tmp[parseInt(indexArr[0])]) {
//             for (let dousa of dousa_group) {
//                 if (dousa[1] === value) {
//                     tmp[parseInt(indexArr[0])][parseInt(indexArr[1])][parseInt(indexArr[2])][2] = dousa[2]
//                 }
//             }
//         }
//         tmp[parseInt(indexArr[0])][parseInt(indexArr[1])][parseInt(indexArr[2])][1] = value
//         props.setProgramData(tmp)
//     }

//     const getNumItems = () => {
//         let res = []
//         let i = 1
//         while (i <= 250) {
//             res.push(<div className='num-dropdown-item' key={i} id={"num-dropdown-"+i} onClick={(e) => selectItem(e)}><p>{i}</p></div>)
//             i += 1
//         }
//         return res
//     }

//     const showItems = () => {
//         let isItemsShown = numItemRef.current.style.display !== "block" ? false : true
//         if (!isItemsShown) {
//             numItemRef.current.style.display = "block"
//         } else {
//             numItemRef.current.style.display = "none"
//         }
//     }

//     return (
//         <div className='num-dropdown'>
//             <div className='currentNum-container' onClick={() => showItems()}><p ref={currentNumRef} className='currentNum'>{currentNum}</p><i className='fas fa-caret-down'></i></div>
//             <div ref={numItemRef} className='num-dropdown-item-container'>{getNumItems()}</div>
//         </div>
//     )
// }