import React, { useRef, useState } from 'react'
import { Button } from '@mui/material';
import { toCML } from './toCml';
import soundfile1 from './sounds/決定、ボタン押下38.mp3'
import soundfile2 from './sounds/決定、ボタン押下44.mp3'

export const ProgramBlock = (props) => {
    const addRowRef = useRef()
    const pgEmptyBox = useRef()

    const trashInput = (e, programData, setProgramData) => {
        const indexArr = e.target.parentNode.id.split('-')
        indexArr.shift()
        let tmp = [...programData]
        tmp[parseFloat(indexArr[0])][parseFloat(indexArr[1])][parseFloat(indexArr[2])] = []
        setProgramData(tmp) 
    }

    const trashLoop = (e, loopData, setLoopData) => {
        const indexArr = e.target.parentNode.id.split('-')
        indexArr.shift()
        let tmp = [...loopData]
        let index = -1
        tmp.forEach(loop => {
            if (loop[0][0] === indexArr[0] && loop[0][1] === indexArr[1]) {
                index = tmp.indexOf(loop)
            }
        })
        if (index !== -1) {
            tmp.splice(index, 1);
        }
        setLoopData(tmp) 
    }

    const trashRow = (e, programData, setProgramData, loopData, setLoopData) => {
        const indexArr = e.currentTarget.parentNode.id.split('-')
        indexArr.shift()
        let tmp = [...programData]
        if (tmp[parseFloat(indexArr[0])].length > 1) {
            tmp[parseFloat(indexArr[0])].splice(parseFloat(indexArr[1]), 1);        
        } else {
            let emptyRow = []
            let i = 1
            while (i <= props.jiku) {
                emptyRow.push([])
                i += 1
            }
            tmp[parseFloat(indexArr[0])] = [emptyRow]
        }
        // ------------------------------------
        // --
        let tmpLoop = [...loopData]
        tmpLoop.forEach(loop => {
            if (loop[0][0] === indexArr[0] && loop[0][1] === indexArr[1]) {
                if (loop[1][1] === loop[0][1]) {
                    tmpLoop.splice(tmpLoop.indexOf(loop), 1);
                }
            } else if (loop[1][0] === indexArr[0] && loop[1][1] === indexArr[1]) {
                loop[1] = [indexArr[0], (parseFloat(indexArr[1])-1).toString()]
            }
        })

        tmpLoop.forEach(loop => {
            if ((programData[parseFloat(loop[0][0])].length - 1) < (loop[1][1] - parseFloat(loop[0][1]))) {
                loop[1][1] = (parseFloat(loop[1][1])-1).toString()
            }
        })

        setProgramData(tmp)
        setLoopData(tmpLoop) 
    }

    const trashGroup = (e, programData, setProgramData, loopData, setLoopData) => {
        const indexArr = e.target.parentNode.id.split('-')
        indexArr.shift()
        let tmp = [...programData]
        if (tmp.length > 1) {
            tmp.splice(parseFloat(indexArr[0]), 1);
        } else {
            tmp = [[[]]]
            let i = 1
            while (i <= props.jiku) {
                tmp[0][0].push([])
                i += 1
            }
        }
        // --
        let tmpLoop = [...loopData]
        tmpLoop.forEach(loop => {
            if (loop[0][0] === indexArr[0]) {
                indexArr.push(tmpLoop.indexOf(loop))
            }
        })
        let i = tmpLoop.length
        while (i--) {
            if (tmpLoop[i][0][0] === indexArr[0]) {
                tmpLoop.splice(i, 1)
            }
        }
        setProgramData(tmp)
        setLoopData(tmpLoop) 
    }

    const trashJiku = (e) => {
        const indexArr = e.currentTarget.parentNode.parentNode.id.split('-')
        indexArr.shift()
        const index = parseFloat(indexArr[0]) - 1
        let tmp = [...props.programData]
        if (props.jiku > 1) {
            for (let dousa_group of tmp) {
                for (let dousa_row of dousa_group) {
                    dousa_row.splice(index, 1)
                }
            }
            props.setJiku(props.jiku - 1)
            let tkTmp = [...props.tkData]
            if (index > -1) {
                tkTmp.splice(index, 1)
            }
            props.setTkData(tkTmp)
        } else {
            tmp = [[[[]]]]
            props.setLoopData([])
        }
        props.setProgramData(tmp)
    }

    const addRow = (e) => {
        const indexArr = e.currentTarget.id.split('-')
        indexArr.shift()
        let emptyRow = []
        let i = 0
        while (i <= props.jiku-1) {
            emptyRow.push([])
            i += 1
        }
        let tmp = [...props.programData]
        tmp[parseFloat(indexArr[0])].splice(parseFloat(indexArr[1]), 0, emptyRow)
        props.setProgramData(tmp) 
    }

    const showOnHover = (e) => {
        e.currentTarget.style.backgroundColor = "red"
        e.target.querySelector(".add-row-plus-cont").style.display = "flex"
    }

    const hideOnLeave = (e) => {
        e.currentTarget.style.backgroundColor = "white"
        e.currentTarget.querySelector(".add-row-plus-cont").style.display = "none"
    }

    const addJiku = (e) => {
        if (props.jiku <= 14) {
            const indexArr = e.currentTarget.id.split('-')
            indexArr.shift()
            let tmp = [...props.programData]
            for (let dousa_group of tmp) {
                for (let dousa_row of dousa_group) {
                    dousa_row.splice(parseFloat(indexArr[0])-1, 0, [])
                }
            }
            props.setProgramData(tmp) 
            let tkTmp = [...props.tkData]
            tkTmp.push({kikou: "initial", susumiryou: [1,1], gensoku: [1,1], bunkai: 300, tanniValue:1})
            props.setTkData(tkTmp) 
            props.setJiku(props.jiku + 1)
        } else {
            alert("軸は最大で15軸設定できます。")
        }
    }

    const showOnHoverJiku = (e) => {
        e.currentTarget.style.backgroundColor = "red"
        e.currentTarget.querySelector(".add-jiku-plus-cont").style.display = "flex"
    }

    const hideOnLeaveJiku = (e) => {
        e.currentTarget.style.backgroundColor = "white"
        e.currentTarget.querySelector(".add-jiku-plus-cont").style.display = "none"
    }

    const moveRow = (e, direction) => {
        const indexArr = e.currentTarget.parentNode.parentNode.id.split('-')
        indexArr.shift()
        let tmp = [...props.programData]
        const dousaGroup = tmp[parseFloat(indexArr[0])]
        const rowIndex = parseFloat(indexArr[1])
        switch (direction) {
            case "up":
                if (rowIndex >= 1) {
                    [dousaGroup[rowIndex-1], dousaGroup[rowIndex]] = [dousaGroup[rowIndex], dousaGroup[rowIndex-1]]
                }
                break
            case "down":
                if (rowIndex < dousaGroup.length-1) {
                    [dousaGroup[rowIndex+1], dousaGroup[rowIndex]] = [dousaGroup[rowIndex], dousaGroup[rowIndex+1]]
                }
                break
            default:
                break
        }
        props.setProgramData(tmp)
    }

    const moveJiku = (e, direction) => {
        const indexArr = e.currentTarget.parentNode.id.split('-')
        indexArr.shift()
        let current_jiku = parseFloat(indexArr[0])
        let tmp = [...props.programData]
        let tkTmp = [...props.tkData]
        switch (direction) {
            case "left":
                if (current_jiku !== 1) {
                    for (let dousa_group of tmp) {
                        for (let dousa_row of dousa_group) {
                            let tmp_dousa = [...dousa_row[current_jiku-1]]
                            dousa_row[current_jiku-1] = [...dousa_row[current_jiku-2]]
                            dousa_row[current_jiku-2] = tmp_dousa
                        }
                    }
                    let tmp_tk_item = tkTmp[current_jiku-1]
                    tkTmp[current_jiku-1] = tkTmp[current_jiku-2]
                    tkTmp[current_jiku-2] = tmp_tk_item
                } 
                break
            case "right":
                if (current_jiku !== props.jiku) {
                    for (let dousa_group of tmp) {
                        for (let dousa_row of dousa_group) {
                            let tmp_dousa = [...dousa_row[current_jiku-1]]
                            dousa_row[current_jiku-1] = [...dousa_row[current_jiku]]
                            dousa_row[current_jiku] = tmp_dousa
                        }
                    }
                    let tmp_tk_item = tkTmp[current_jiku-1]
                    tkTmp[current_jiku-1] = tkTmp[current_jiku]
                    tkTmp[current_jiku] = tmp_tk_item
                }
                break
            default:
                break
        }
        props.setTkData(tkTmp) 
        props.setProgramData(tmp)
    }

    const showTypeData = (isLoop, parentId, jiku, dousaType, dousaNum) => {
        if (!isLoop) {
            const typeDataObj = [jiku, parentId, dousaType, dousaNum, false]
            props.setTypeDataObj(typeDataObj)
            props.setInputBoxType("typedata")
        } else {
            props.setLoopInputObj([parentId, false])
            props.setInputBoxType("loop")
        }
    }

    // Drag Functions
    const emptyBoxDragStart = (e) => {
        // e.currentTarget.className += "dousa-box"
        // setTimeout(() => (e.currentTarget.className = 'dragged-box'), 0);
        // e.currentTarget.style.cursor = "grabbing"
    }
    
    const emptyBoxDragEnd = (e) => {
        e.currentTarget.className = "dousa-box"
        e.currentTarget.style.cursor = "grab"
    }

    function emptyBoxDragOver(e) {
        if (props.currentDraggedCommand !== "繰り返し" && props.currentDraggedCommand !== "動作グループを追加" && props.currentDraggedCommand !== "NOPE") {
            e.preventDefault();
        }
    }

    function emptyBoxDragEnter(e) {
        if (props.currentDraggedCommand !== "繰り返し" && props.currentDraggedCommand !== "動作グループを追加" && props.currentDraggedCommand !== "NOPE") {
            e.preventDefault();
            e.target.className += ' pg-empty-hovered';
        }
    }

    function emptyBoxDragLeave(e) {
        e.target.className = 'pg-empty-box';
    }

    function emptyBoxDragDrop(e) {
        const indexArr = e.target.id.split('-')
        indexArr.shift()
        let tmp = [...props.programData]
        let audio = new Audio(soundfile2);
        if (props.currentDraggedCommand !== "繰り返し" && props.currentDraggedCommand !== "動作グループを追加" && props.currentDraggedCommand !== "NOPE" && !props.currentDraggedCommand.includes("-")) {
            tmp[parseFloat(indexArr[0])][parseFloat(indexArr[1])][parseFloat(indexArr[2])] = [props.currentDraggedCommand, 1, [["数値を入力してください", "pps"], ["数値を入力してください", "pps"], ["数値を入力してください", "pps"]]]
            props.setProgramData(tmp)
            if (!props.isMute) {
                audio.play();
            }
        } else if (props.currentDraggedCommand.includes("-")) {
            let draggedIndexArr = props.currentDraggedCommand.split("-")
            draggedIndexArr.shift()
            tmp[parseFloat(indexArr[0])][parseFloat(indexArr[1])][parseFloat(indexArr[2])] = tmp[parseFloat(draggedIndexArr[0])][parseFloat(draggedIndexArr[1])][parseFloat(draggedIndexArr[2])]
            tmp[parseFloat(draggedIndexArr[0])][parseFloat(draggedIndexArr[1])][parseFloat(draggedIndexArr[2])] = []
            props.setProgramData(tmp)
            if (!props.isMute) {
                audio.play();
            }
        }
    }
    // -------
    function emptyBoxLoopDragOver(e) {
        if (props.currentDraggedCommand === "繰り返し") {
            e.preventDefault();
        }
    }

    function emptyBoxLoopDragEnter(e) {
        if (props.currentDraggedCommand === "繰り返し") {
            e.preventDefault();
            e.target.className += ' pg-l-empty-loop-hovered';
        }
    }

    function emptyBoxLoopDragLeave(e) {
        e.target.className = 'pg-l-empty-loop';
    }

    function emptyBoxLoopDragDrop(e) {
        const indexArr = e.target.id.split('-')
        indexArr.shift()
        let tmp = [...props.loopData]
        if (props.currentDraggedCommand === "繰り返し") {
            tmp.push([[indexArr[0], indexArr[1]], [indexArr[0], indexArr[1]], 2])
            props.setLoopData(tmp)
            if (!props.isMute) {
                let audio = new Audio(soundfile2);
                audio.play();
            }
        } 
    }

    const resizeLoop = (e, direction) => {
        const indexArr = e.currentTarget.parentNode.parentNode.id.split('-')
        indexArr.shift()
        let tmp = [...props.loopData]
        let mainItemIndex
        tmp.forEach(loop => {
            if (loop[0][0] === indexArr[0] && loop[0][1] === indexArr[1]) {
                mainItemIndex = tmp.indexOf(loop)
            }
        })
        let isDirectionAvailable = true
        switch(direction) {
            case "top-up":
                tmp.forEach(loop => {
                    if ((tmp.indexOf(loop) !== mainItemIndex) && (loop[1][0] === tmp[mainItemIndex][0][0] && loop[1][1] === tmp[mainItemIndex][0][1])) {
                        isDirectionAvailable = false
                    }
                })
                if (isDirectionAvailable && parseFloat(tmp[mainItemIndex][0][1]) >= 1) {
                    tmp[mainItemIndex][0][1] = (parseFloat(tmp[mainItemIndex][0][1]) - 1).toString()
                }
                break
            case "top-down":
                if (tmp[mainItemIndex][0][1] !== tmp[mainItemIndex][1][1]) {
                    tmp[mainItemIndex][0][1] = (parseFloat(tmp[mainItemIndex][0][1]) + 1).toString()
                }
                break
            case "bottom-up":
                if (tmp[mainItemIndex][0][1] !== tmp[mainItemIndex][1][1]) {
                    tmp[mainItemIndex][1][1] = (parseFloat(tmp[mainItemIndex][1][1]) - 1).toString()
                }
                break
            case "bottom-down":
                for (let loop of tmp) {
                    if ((tmp.indexOf(loop) !== mainItemIndex) && (loop[0][0] === tmp[mainItemIndex][1][0] && loop[0][1] === tmp[mainItemIndex][1][1])) {
                        isDirectionAvailable = false
                    }
                }
                let rowLength = props.programData[tmp[mainItemIndex][1][0]].length
                if (isDirectionAvailable && parseFloat(tmp[mainItemIndex][1][1]) < (rowLength - 1)) {
                    tmp[mainItemIndex][1][1] = (parseFloat(tmp[mainItemIndex][1][1]) + 1).toString()
                }
                break          
            default:
                break 
        }
        props.setLoopData(tmp)
    }
    // -------
    function addGroupDragOver(e) {
        if (props.currentDraggedCommand === "動作グループを追加") {
            e.preventDefault();
        }
    }

    function addGroupDragEnter(e) {
        e.currentTarget.style.backgroundColor = "red"
        e.currentTarget.querySelector(".add-row-plus-cont").style.display = "flex"
    }
    
    function addGroupDragLeave(e) {
        e.currentTarget.style.backgroundColor = "white"
        e.currentTarget.querySelector(".add-row-plus-cont").style.display = "none"
    }
    
    function addGroupDragDrop(e) {
        let tmp = [...props.programData]
        if (tmp.length <= 29) {

            const indexArr = e.currentTarget.id.split('-')
            indexArr.shift()
            if (props.currentDraggedCommand === "動作グループを追加") {
                let emptyGroup = [[]]
                for (let z = 0; z < props.jiku; z++) emptyGroup[0].push([]);
                tmp.splice((indexArr[0]+1), 0, emptyGroup); 
                props.setProgramData(tmp)
            } 
            e.currentTarget.style.backgroundColor = "white"
            e.currentTarget.querySelector(".add-row-plus-cont").style.display = "none"
        } else {
            alert("動作グループは最大30まで設定できます。")
        }
    }

    const dousaBoxRef = useRef()

    const dataToHTML = (programData) => {
        let pg_l_arr = [<div className="pg-l-empty pglemp0" key={"first-pg-l-empty-box"}></div>]
        let main_grid = []
        let jiku_i = 1
        while (jiku_i <= props.jiku) {
            const jiku_num = jiku_i
            if (jiku_num === 1) {
                main_grid.push(
                <div className="jiku-number unselectable" id={"jiku-"+jiku_num.toString()} key={"jiku"+jiku_num}>
                    <div className="add-jiku-left" id={"addJiku-"+jiku_num} onClick={(e) => addJiku(e)} onMouseEnter={(e) => showOnHoverJiku(e)} onMouseLeave={(e) => hideOnLeaveJiku(e)}>
                        <div className="add-jiku-plus-cont">
                            <i className="fas fa-plus"></i>
                        </div>
                    </div>
                    <div className="add-jiku-right" id={"addJiku-"+(jiku_num+1)} onClick={(e) => addJiku(e)} onMouseEnter={(e) => showOnHoverJiku(e)} onMouseLeave={(e) => hideOnLeaveJiku(e)}>
                        <div className="add-jiku-plus-cont">
                            <i className="fas fa-plus"></i>
                        </div>
                    </div>
                    <i className="fas fa-arrow-alt-circle-left move-jiku" onClick={(e) => moveJiku(e, "left")}></i>
                    <p>
                        {jiku_num}軸目<i className="fas fa-trash trash-jiku" onClick={(e) => trashJiku(e)}></i>
                    </p>
                    <i className="fas fa-arrow-alt-circle-right move-jiku" onClick={(e) => moveJiku(e, "right")}></i>
                </div>)
            } else if (jiku_num === 15) {
                main_grid.push(<div className="jiku-number unselectable" id={"jiku-"+jiku_num.toString()} key={"jiku"+jiku_num}><i className="fas fa-arrow-alt-circle-left move-jiku" onClick={(e) => moveJiku(e, "left")}></i><p>{jiku_num}軸目<i className="fas fa-trash trash-jiku" onClick={(e) => trashJiku(e)}></i></p><i className="fas fa-arrow-alt-circle-right move-jiku" onClick={(e) => moveJiku(e, "right")}></i></div>)
            } else {
                main_grid.push(<div className="jiku-number unselectable" id={"jiku-"+jiku_num.toString()} key={"jiku"+jiku_num}><div className="add-jiku-right" id={"addJiku-"+(jiku_num+1)} onClick={(e) => addJiku(e)} onMouseEnter={(e) => showOnHoverJiku(e)} onMouseLeave={(e) => hideOnLeaveJiku(e)}><div className="add-jiku-plus-cont"><i className="fas fa-plus"></i></div></div><i className="fas fa-arrow-alt-circle-left move-jiku" onClick={(e) => moveJiku(e, "left")}></i><p>{jiku_num}軸目<i className="fas fa-trash trash-jiku" onClick={(e) => trashJiku(e)}></i></p><i className="fas fa-arrow-alt-circle-right move-jiku" onClick={(e) => moveJiku(e, "right")}></i></div>)
            }
            jiku_i += 1
        }
        main_grid.push(<div className="empty-right-box" key={"empRbox-0firrrst"}></div>)
        main_grid.push(<div className="grid-line" style={{gridColumn:"1/"+(props.jiku+1)}} key={"first-grid-line-key"}></div>)
        main_grid.push(<div className="empty-right-box" key={"empRbox-ggggllllliiinnneeee"}></div>)
        let dousa_group_i = 0
        for (let dousa_group of programData) {
            pg_l_arr.push(<div className="pg-l-empty pglempgroup" key={"pglempty"+dousa_group_i}></div>)
            main_grid.push(<div className="dousa-group-kaishi unselectable" style={{gridColumn:"1/"+(props.jiku+1)}} key={"dousagroup-"+dousa_group_i} id={"dousaGroup-"+dousa_group_i}><p>動作グループ{dousa_group_i+1}の開始</p><i className="fas fa-trash" onClick={(e) => trashGroup(e, props.programData, props.setProgramData, props.loopData, props.setLoopData)}></i></div>)
            main_grid.push(<div className="empty-right-box" key={"empRbox-"+dousa_group_i}></div>)
            let dontPutEmp = []
            let dousa_row_i = 0
            for (let dousa_row of dousa_group) {
                let loopCount
                props.loopData.forEach(loop => {
                    if (loop[0][0] === dousa_group_i.toString() && loop[0][1] === dousa_row_i.toString()) {
                        loopCount = loop[2]
                        let loopHeight = loop[1][1] - loop[0][1] + 1
                        let loopStyleHeight = loopHeight * 2.3 + ((loopHeight-1) * (0.2 + 0.4))
                        for (let z = 0; z < loopHeight; z++) dontPutEmp.push("loop");
                        let dragArrows = [<div className="loop-drag-top" key={"loopdragtop"}><div onClick={(e) => resizeLoop(e, "top-up")}><i className="fas fa-arrow-alt-circle-up"></i></div><div onClick={(e) => resizeLoop(e, "top-down")}><i className="fas fa-arrow-alt-circle-down"></i></div></div>,<div className="loop-drag-bottom" key={"loop-drag-bottom"}><div onClick={(e) => resizeLoop(e, "bottom-up")}><i className="fas fa-arrow-alt-circle-up"></i></div><div onClick={(e) => resizeLoop(e, "bottom-down")}><i className="fas fa-arrow-alt-circle-down"></i></div></div>]
                        if (loop[0][1] === loop[1][1]) {
                            dragArrows = [<div className="loop-drag-top" key={"loopdragtop"}><div onClick={(e) => resizeLoop(e, "top-up")}><i className="fas fa-arrow-alt-circle-up"></i></div></div>,<div className="loop-drag-bottom" key={"loop-drag-bottom"}><div onClick={(e) => resizeLoop(e, "bottom-down")}><i className="fas fa-arrow-alt-circle-down"></i></div></div>]
                        }
                        const loopId = "loop-"+dousa_group_i+"-"+dousa_row_i
                        pg_l_arr.push(
                        <div className="pg-l-loop unselectable" style={{height:loopStyleHeight+"rem"}} id={loopId} key={"pglloop"+dousa_row}>
                            {dragArrows.map(dragArrow => {return dragArrow})}
                            <p className="loop-title" onClick={() => showTypeData(true, loopId)}>繰り返し{loopCount}回</p>
                            <i className="fas fa-trash trash-block" onClick={(e) => trashLoop(e, props.loopData, props.setLoopData)}></i>
                        </div>)
                    }
                })
                if (dontPutEmp.length === 0) {
                    pg_l_arr.push(<div className="pg-l-empty-loop" id={"emptyloop-"+dousa_group_i+"-"+dousa_row_i} onDragOver={(e) => emptyBoxLoopDragOver(e)} onDragEnter={(e) => emptyBoxLoopDragEnter(e)} onDragLeave={(e) => emptyBoxLoopDragLeave(e)} onDrop={(e) => emptyBoxLoopDragDrop(e)} key={"pglemploop-"+dousa_group_i+"-"+dousa_row_i}></div>)
                } else {
                    dontPutEmp.shift()
                }
                if (dousa_row_i === 0) {
                    main_grid.push(<div ref={addRowRef} key={"addrow0"+dousa_group_i+"-"+dousa_row_i} id={"addRow-"+dousa_group_i+"-0"} onClick={(e) => addRow(e)} onMouseEnter={(e) => showOnHover(e)} onMouseLeave={(e) => hideOnLeave(e)} className="pg-add-row" style={{gridColumn:"1/"+(props.jiku+1)}}><div className="add-row-plus-cont"><i className="fas fa-plus"></i></div></div>)
                    main_grid.push(<div className="empty-right-box" key={"empRbox-"+dousa_group_i+"-"+dousa_row_i}></div>)
                }
                let dousa_i = 0
                for (let dousa of dousa_row) {
                    if (dousa.length !== 0) {
                        let noValueArr = []
                        dousa[2].forEach(value => {if (value.includes("数値を入力してください")) noValueArr.push("nope")})
                        const dousaId = "dousa-"+dousa_group_i+"-"+dousa_row_i+"-"+dousa_i
                        const jikuOfDousa = dousa_i
                        if (noValueArr.length > 0) {
                            main_grid.push(<div ref={dousaBoxRef} className="dousa-box unselectable" draggable="true" onDragStart={(e) => emptyBoxDragStart(e)} onDragEnd={(e) => emptyBoxDragEnd(e)} onMouseEnter={(e) => props.setCurrentDraggedCommand(e.currentTarget.id)} key={dousa_group_i+"dousabox"+dousa_row_i+"-"+dousa_i} id={dousaId}><div className='no-value-circle'></div><p className='dousa-title' onClick={() => showTypeData(false, dousaId, jikuOfDousa, dousa[0], dousa[1])} >{dousa[0]}{dousa[1]}</p><i className="fas fa-trash" onClick={(e) => trashInput(e, props.programData, props.setProgramData)}></i></div>)
                        } else {
                            main_grid.push(<div ref={dousaBoxRef} className="dousa-box unselectable" draggable="true" onDragStart={(e) => emptyBoxDragStart(e)} onDragEnd={(e) => emptyBoxDragEnd(e)} onMouseEnter={(e) => props.setCurrentDraggedCommand(e.currentTarget.id)} key={dousa_group_i+"dousabox"+dousa_row_i+"-"+dousa_i} id={dousaId}><p className='dousa-title' onClick={() => showTypeData(false, dousaId, jikuOfDousa, dousa[0], dousa[1])} >{dousa[0]}{dousa[1]}</p><i className="fas fa-trash" onClick={(e) => trashInput(e, props.programData, props.setProgramData)}></i></div>)
                        }
                    } else {
                        // main_grid.push(<div className="dousa-box"></div>)
                        main_grid.push(<div ref={pgEmptyBox} key={dousa_group_i+"emptybox"+dousa_row_i+"-"+dousa_i} onDragOver={(e) => emptyBoxDragOver(e)} onDragEnter={(e) => emptyBoxDragEnter(e)} onDragLeave={(e) => emptyBoxDragLeave(e)} onDrop={(e) => emptyBoxDragDrop(e)} className="pg-empty-box" id={"dousa-"+dousa_group_i+"-"+dousa_row_i+"-"+dousa_i}></div>)
                    } 
                    dousa_i += 1
                }
                main_grid.push(
                    <div className="trash-row-right-box" key={"trashR-"+dousa_group_i+"-"+dousa_row_i} id={"trashRow-"+dousa_group_i+"-"+(dousa_row_i)}>
                        <i onClick={(e) => trashRow(e, props.programData, props.setProgramData, props.loopData, props.setLoopData)} className="fas fa-trash"></i>
                        <div className='move-row-cont'><i className='fas fa-arrow-alt-circle-up move-row-up' onClick={(e) => moveRow(e, "up")}></i><i className='fas fa-arrow-alt-circle-down move-row-down' onClick={(e) => moveRow(e, "down")}></i></div>
                    </div>)
                if (dousa_row_i !== (dousa_group.length-1)) {
                    main_grid.push(<div ref={addRowRef} key={"addrow"+dousa_group_i+"-"+dousa_row_i} id={"addRow-"+dousa_group_i+"-"+(dousa_row_i+1)} onClick={(e) => addRow(e)} onMouseEnter={(e) => showOnHover(e)} onMouseLeave={(e) => hideOnLeave(e)} className="pg-add-row" style={{gridColumn:"1/"+(props.jiku+1)}}><div className="add-row-plus-cont"><i className="fas fa-plus"></i></div></div>)
                    main_grid.push(<div className="empty-right-box" key={"empRboxaddR-"+dousa_group_i+"-"+dousa_row_i}></div>)
                } else {
                    main_grid.push(<div ref={addRowRef} key={"addrow"+dousa_group_i+"-"+dousa_row_i} id={"addRow-"+dousa_group_i+"-"+(dousa_row_i+1)} onClick={(e) => addRow(e)} onMouseEnter={(e) => showOnHover(e)} onMouseLeave={(e) => hideOnLeave(e)} onDragOver={(e) => addGroupDragOver(e)} onDragEnter={(e) => addGroupDragEnter(e)} onDragLeave={(e) => addGroupDragLeave(e)} onDrop={(e) => addGroupDragDrop(e)} className="pg-add-row" style={{gridColumn:"1/"+(props.jiku+1),height:"0.4rem"}}><div className="add-row-plus-cont"><i className="fas fa-plus"></i></div></div>)
                    main_grid.push(<div className="empty-right-box" key={"empRboxaddR-"+dousa_group_i+"-"+dousa_row_i}></div>)
                }
                dousa_row_i += 1
            }
            dousa_group_i += 1
        }

        return (
            <div className="program-grid">
                <div className="pg-left">{pg_l_arr}</div>
                <div className="program-main-grid" style={{gridTemplateColumns:"repeat("+props.jiku+", 3fr) 1fr"}}>{main_grid}</div>
            </div>
        )
    }

    // initially have 動作グループ1
    return(
        <div className="program-block">
            {dataToHTML(props.programData)}
            <div className="enter-button">
                <Button variant="contained" onClick={() => props.setCmlOutput(toCML(props.programData, props.loopData, props.isNyuryokuShingou, props.tkData))}>CMLへ変換</Button>
            </div>
        </div>
    )
}

export const TypeDataInDousa = (props) => {
    // let dousaType = props.dousaType
    // let dousaNum = props.dousaNum
    // let parentId = props.parentId
    const popupRef = useRef()
    const tkData = props.tkData
    // --
    let indexArr = props.parentId.split('-')
    indexArr.shift()
    const jikuNum = parseFloat(indexArr[2])
    // -
    let tmp = [...props.programData]
    // --
    const closeTypeData = () => {
        props.setInputBoxType("none")
    }

    let subTanni = "initial"
    if (tkData[jikuNum].kikou !== "initial") {
        if (props.application === "インデックステーブル") {
            subTanni = "°"
        } else {
            subTanni = "mm"
        }
    }

    const ichigimeData = {
        bangouRange: 250,
        inputForm: subTanni==="initial" ? [
            ["速度データ", ["pps/s"], "と"],
            ["加速度データ", ["pps/s\u00b2"], "で"],
            ["位置データ", ["pps"], "へ移動する"],
        ] : [
            ["速度データ", ["pps/s", subTanni+"/s"], "と"],
            ["加速度データ", ["pps/s\u00b2", subTanni+"/s\u00b2"], "で"],
            ["位置データ", ["pps", subTanni], "へ移動する"],
        ]
    }
    const oshitukeData = {
        bangouRange: 250,
        inputForm: subTanni==="initial" ? [
            ["速度データ", ["pps/s"], "と"],
            ["加速度データ", ["pps/s\u00b2"], "で"],
            ["位置データ", ["pps"], "へ押付け動作する"],
        ] : [
            ["速度データ", ["pps/s", subTanni+"/s"], "と"],
            ["加速度データ", ["pps/s\u00b2", subTanni+"/s\u00b2"], "で"],
            ["位置データ", ["pps", subTanni], "へ押付け動作する"],
        ]
    }
    const torukuData = {
        bangouRange: 8,
        inputForm: [
            ["トルク制限データ", ["%"], "に設定する"],
        ]
    }
    const timerData = {
        bangouRange: 5,
        inputForm: [
            ["タイマデータ", ["msec"], "に設定する"],
        ]
    }

    let dataFormat
    switch(props.dousaType) {
        case "位置決め":
            dataFormat = ichigimeData
            break
        case "押付け":
            dataFormat = oshitukeData
            break
        case "トルク制限":
            dataFormat = torukuData
            break
        case "タイマ":
            dataFormat = timerData
            break
        default:
            dataFormat = ichigimeData
    }

    const DousaInputBox = (props) => {
        // props: dataFormat, numdropdown params
        const dataFormat = props.dataFormat

        const setTypeData = () => {
            let isAllNumber = []
            popupRef.current.querySelectorAll('.type-data-input').forEach(input => {
                if (isNaN(parseFloat(input.value))) {
                    isAllNumber.push("NAN")
                }
            })
            if (isAllNumber.length === 0) {
                let tmp = [...props.programData]
                let valueArr = []
                let inputs = popupRef.current.querySelectorAll(".type-data-input")
                let tanniSelectors = popupRef.current.querySelectorAll(".select-tanni")
                let i = 0
                while (i < inputs.length) {
                    valueArr.push([inputs[i].value, tanniSelectors[i].value])
                    i++
                }
                for (let dousa_group of tmp) {
                    for (let dousa_row of dousa_group) {
                        let dousa = dousa_row[props.jiku]
                        if (dousa.length > 0) {
                            if (props.dousaType !== ("位置決め"||"押付け")) {
                                if (dousa[1] === props.dousaNum && dousa[0] === props.dousaType) {
                                    dousa[2] = valueArr
                                }
                            } else {
                                if (dousa[1] === props.dousaNum) {
                                    dousa[2] = valueArr
                                }
                            }
                        }
                    }
                }
                tmp[parseFloat(indexArr[0])][parseFloat(indexArr[1])][parseFloat(indexArr[2])][2] = valueArr
                props.setProgramData(tmp)
                // --
                closeTypeData()
            } else {
                isAllNumber = []
                alert('数値を入力してください') 
            }
        } 
    
        return (
            <div className="typeDataInDousa" ref={popupRef}>
                <div className="close-typedata"><i onClick={() => closeTypeData()} className="fas fa-times-circle type-times-circle"></i></div>
                <div className='typedata-input-line' key={"input-num-line"}>
                    <p className='typedata-var'>番号:</p><NumDropDown range={dataFormat.bangouRange} jiku={props.jiku} dousaType={props.dousaType} dousaNum={props.dousaNum} popupRef={props.popupRef} programData={props.programData} setProgramData={props.setProgramData} indexArr={props.indexArr}/>
                </div>
                { dataFormat.inputForm.map(inputLine => {
                    return (
                        <div className="typedata-input-line" key={inputLine[0]}>
                            <p className="typedata-var">{inputLine[0]}</p>
                            <DataInput index={dataFormat.inputForm.indexOf(inputLine)} tanniArr={inputLine[1]} />
                            <p>{inputLine[2]}</p>
                        </div>
                    )
                }) }
                <Button className="type-data-button" variant="contained" onClick={() => setTypeData()}>OK</Button>
            </div>
        )
    }

    const DataInput = (props) => {
        // const data = [100, "pps"]
        const index = props.index
        const tanniArr = props.tanniArr
        const [value, setValue] = useState(tmp[parseFloat(indexArr[0])][parseFloat(indexArr[1])][parseFloat(indexArr[2])][2][index][0])
        const [tanniState, setTanniState] = useState(tmp[parseFloat(indexArr[0])][parseFloat(indexArr[1])][parseFloat(indexArr[2])][2][index][1])
        // ---

        return (
            <>
                {value.toString().includes('数値を入力してください') ? 
                    <input className="type-data-input" required placeholder={value} onChange={(e) => setValue(e.target.value)} />
                    // : <input className="type-data-input" required value={value} onChange={(e) => setValue(e.target.value)} />
                    : <input className="type-data-input" required defaultValue={value} onChange={(e) => setValue(e.target.value)} />
                }
                <div className="type-data-tanni">
                    <select className='select-tanni' value={tanniState} onChange={(e) => setTanniState(e.target.value)} >
                        { tanniArr.map(tanni => {
                            return <option key={tanni} value={tanni}>{tanni}</option>
                        }) }
                    </select>
                </div>
            </>
        )
    }

    return (<DousaInputBox dataFormat={dataFormat} jiku={props.jiku} dousaType={props.dousaType} dousaNum={props.dousaNum} popupRef={popupRef} programData={props.programData} setProgramData={props.setProgramData} indexArr={indexArr}/>)
}

export const LoopInputBox = (props) => {
    // props: parentId, loopData, setLoopData
    const popupRef = useRef()
    let indexArr = props.parentId.split('-')
    indexArr.shift()
    // --
    let tmp = [...props.loopData]
    const [value, setValue] = useState(tmp[parseFloat(indexArr[0])][2])
    // --
    const closeTypeData = () => {
        props.setInputBoxType("none")
    }

    const setTypeData = () => {
        let isAllNumber = []
        if (isNaN(popupRef.current.querySelector('.type-data-input').value)) {
                isAllNumber.push("NAN")
        }
        if (isAllNumber.length === 0) {
            let tmp = [...props.loopData]
            let value = popupRef.current.querySelector(".type-data-input").value
            tmp[parseFloat(indexArr[0])][2] = value
            props.setLoopData(tmp)
            // --
            closeTypeData()
        } else {
            isAllNumber = []
            alert('数値を入力してください') 
        }
    } 

    return (
        <div className="typeDataInDousa" ref={popupRef}>
            <div className="close-typedata"><i onClick={() => closeTypeData()} className="fas fa-times-circle type-times-circle"></i></div>
            <div className="typedata-input-line">
                <input className="type-data-input" required value={value} onChange={(e) => setValue(e.target.value)} />
                <p>回繰り返す</p>
            </div>
            <Button className="type-data-button" variant="contained" onClick={() => setTypeData()}>OK</Button>
        </div>
    )
}

const NumDropDown = (props) => {
    // props: programData, setProgramData, dataType, dataNum, popupRef, jiku, indexArr, range
    const popupRef = props.popupRef
    const indexArr = props.indexArr
    let tmp = [...props.programData]
    const [currentNum, setCurrentNum] = useState(tmp[parseFloat(indexArr[0])][parseFloat(indexArr[1])][parseFloat(indexArr[2])][1])
    const numItemRef = useRef()
    const currentNumRef = useRef()
    
    const selectItem = (e) => {
        const value = parseFloat(e.currentTarget.id.split("-")[2])
        setCurrentNum(value)
        numItemRef.current.style.display = "none"
        let sameDataArr = []
        for (let dousa_group of tmp) {
            for (let dousa_row of dousa_group) {
                let dousa = dousa_row[props.jiku]
                if (dousa[1] === value && dousa[0] === props.dousaType) {
                    sameDataArr.push(dousa[2])
                }
            }
        }
        if (sameDataArr.length > 0) {
            tmp[parseFloat(indexArr[0])][parseFloat(indexArr[1])][parseFloat(indexArr[2])][2] = sameDataArr[0]
            let inputs = popupRef.current.querySelectorAll(".type-data-input")
            let tanniSelectors = popupRef.current.querySelectorAll(".select-tanni")
            let i = 0
            while (i < inputs.length) {
                inputs[i].value = sameDataArr[0][i][0]
                tanniSelectors[i].value = sameDataArr[0][i][1]
                i++
            }
        }
        tmp[parseFloat(indexArr[0])][parseFloat(indexArr[1])][parseFloat(indexArr[2])][1] = value
        props.setProgramData(tmp)
    }
    const getNumItems = () => {
        let res = []
        let i = 1
        while (i <= props.range) {
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