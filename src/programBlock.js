import React, { useEffect, useRef, useState } from 'react'
import { Button, gridClasses } from '@mui/material';
import { toCML } from './toCml';
import { Dropdown } from './tanni-funcs';

export const ProgramBlock = (props) => {

    const addRowRef = useRef()
    const pgEmptyBox = useRef()

    const trashInput = (e, programData, setProgramData) => {
        const indexArr = e.target.parentNode.id.split('-')
        indexArr.shift()
        let tmp = [...programData]
        tmp[parseInt(indexArr[0])][parseInt(indexArr[1])][parseInt(indexArr[2])] = []
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
        if (tmp[parseInt(indexArr[0])].length > 1) {
            tmp[parseInt(indexArr[0])].splice(parseInt(indexArr[1]), 1);        
        } else {
            let emptyRow = []
            let i = 1
            while (i <= props.jiku) {
                emptyRow.push([])
                i += 1
            }
            tmp[parseInt(indexArr[0])] = [emptyRow]
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
                loop[1] = [indexArr[0], (parseInt(indexArr[1])-1).toString()]
            }
        })

        tmpLoop.forEach(loop => {
            if ((programData[parseInt(loop[0][0])].length - 1) < (loop[1][1] - parseInt(loop[0][1]))) {
                loop[1][1] = (parseInt(loop[1][1])-1).toString()
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
            tmp.splice(parseInt(indexArr[0]), 1);
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
        const indexArr = e.target.parentNode.id.split('-')
        indexArr.shift()
        let tmp = [...props.programData]
        if (props.jiku > 1) {
            for (let dousa_group of tmp) {
                for (let dousa_row of dousa_group) {
                    dousa_row.splice(indexArr[0]-1, 1)
                }
            }
            props.setJiku(props.jiku - 1)
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
        tmp[parseInt(indexArr[0])].splice(parseInt(indexArr[1]), 0, emptyRow)
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
                    dousa_row.splice(parseInt(indexArr[0])-1, 0, [])
                }
            }
            props.setProgramData(tmp) 
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
        const dousaGroup = tmp[parseInt(indexArr[0])]
        const rowIndex = parseInt(indexArr[1])
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
        let current_jiku = parseInt(indexArr[0])
        let tmp = [...props.programData]
        switch (direction) {
            case "left":
                if (current_jiku !== 1) {
                    for (let dousa_group of tmp) {
                        for (let dousa_row of dousa_group) {
                            console.log(current_jiku-1)
                            let tmp_dousa = [...dousa_row[current_jiku-1]]
                            dousa_row[current_jiku-1] = [...dousa_row[current_jiku-2]]
                            dousa_row[current_jiku-2] = tmp_dousa
                        }
                    }
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
                }
                break
            default:
                break
        }
        props.setProgramData(tmp)
    }

    const changeCML = (programData, loopData, isNyuryokuShingou) => {
        props.setCmlOutput(toCML(programData, loopData, isNyuryokuShingou))
    }

    const showTypeData = (e) => {
        e.target.parentNode.querySelector('.typeDataInDousa').style.display = "flex"
    }

        
    // Drag Functions
    const emptyBoxDragStart = (e) => {
        // e.currentTarget.className += "dousa-box"
        // setTimeout(() => (e.currentTarget.className = 'dragged-box'), 0);
    }
    
    const emptyBoxDragEnd = (e) => {
        e.currentTarget.className = "dousa-box"
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
        if (props.currentDraggedCommand !== "繰り返し" && props.currentDraggedCommand !== "動作グループを追加" && props.currentDraggedCommand !== "NOPE" && !props.currentDraggedCommand.includes("-")) {
            tmp[parseInt(indexArr[0])][parseInt(indexArr[1])][parseInt(indexArr[2])] = [props.currentDraggedCommand, 1, ["initial", "initial", "initial"]]
            props.setProgramData(tmp)
        } else if (props.currentDraggedCommand.includes("-")) {
            let draggedIndexArr = props.currentDraggedCommand.split("-")
            draggedIndexArr.shift()
            tmp[parseInt(indexArr[0])][parseInt(indexArr[1])][parseInt(indexArr[2])] = tmp[parseInt(draggedIndexArr[0])][parseInt(draggedIndexArr[1])][parseInt(draggedIndexArr[2])]
            tmp[parseInt(draggedIndexArr[0])][parseInt(draggedIndexArr[1])][parseInt(draggedIndexArr[2])] = []
            props.setProgramData(tmp)
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
                if (isDirectionAvailable && parseInt(tmp[mainItemIndex][0][1]) >= 1) {
                    tmp[mainItemIndex][0][1] = (parseInt(tmp[mainItemIndex][0][1]) - 1).toString()
                }
                break
            case "top-down":
                if (tmp[mainItemIndex][0][1] !== tmp[mainItemIndex][1][1]) {
                    tmp[mainItemIndex][0][1] = (parseInt(tmp[mainItemIndex][0][1]) + 1).toString()
                }
                break
            case "bottom-up":
                if (tmp[mainItemIndex][0][1] !== tmp[mainItemIndex][1][1]) {
                    tmp[mainItemIndex][1][1] = (parseInt(tmp[mainItemIndex][1][1]) - 1).toString()
                }
                break
            case "bottom-down":
                for (let loop of tmp) {
                    if ((tmp.indexOf(loop) !== mainItemIndex) && (loop[0][0] === tmp[mainItemIndex][1][0] && loop[0][1] === tmp[mainItemIndex][1][1])) {
                        isDirectionAvailable = false
                    }
                }
                let rowLength = props.programData[tmp[mainItemIndex][1][0]].length
                if (isDirectionAvailable && parseInt(tmp[mainItemIndex][1][1]) < (rowLength - 1)) {
                    tmp[mainItemIndex][1][1] = (parseInt(tmp[mainItemIndex][1][1]) + 1).toString()
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

    const dataToHTML = (programData) => {
        let pg_l_arr = [<div className="pg-l-empty pglemp0" key={"first-pg-l-empty-box"}></div>]
        let main_grid = []
        let jiku_i = 1
        while (jiku_i <= props.jiku) {
            if (jiku_i === 1) {
                main_grid.push(<div className="jiku-number" id={"jiku-"+jiku_i} key={"jiku"+jiku_i}><div className="add-jiku-left" id={"addJiku-"+jiku_i} onClick={(e) => addJiku(e)} onMouseEnter={(e) => showOnHoverJiku(e)} onMouseLeave={(e) => hideOnLeaveJiku(e)}><div className="add-jiku-plus-cont"><i className="fas fa-plus"></i></div></div><div className="add-jiku-right" id={"addJiku-"+(jiku_i+1)} onClick={(e) => addJiku(e)} onMouseEnter={(e) => showOnHoverJiku(e)} onMouseLeave={(e) => hideOnLeaveJiku(e)}><div className="add-jiku-plus-cont"><i className="fas fa-plus"></i></div></div><i className="fas fa-arrow-alt-circle-left move-jiku" onClick={(e) => moveJiku(e, "left")}></i><p>{jiku_i}軸目<i className="fas fa-trash trash-jiku" onClick={(e) => trashJiku(e)}></i></p><i className="fas fa-arrow-alt-circle-right move-jiku" onClick={(e) => moveJiku(e, "right")}></i></div>)
            } else if (jiku_i === 15) {
                main_grid.push(<div className="jiku-number" id={"jiku-"+jiku_i} key={"jiku"+jiku_i}><i className="fas fa-arrow-alt-circle-left move-jiku" onClick={(e) => moveJiku(e, "left")}></i><p>{jiku_i}軸目<i className="fas fa-trash trash-jiku" onClick={(e) => trashJiku(e)}></i></p><i className="fas fa-arrow-alt-circle-right move-jiku" onClick={(e) => moveJiku(e, "right")}></i></div>)
            } else {
                main_grid.push(<div className="jiku-number" id={"jiku-"+jiku_i} key={"jiku"+jiku_i}><div className="add-jiku-right" id={"addJiku-"+(jiku_i+1)} onClick={(e) => addJiku(e)} onMouseEnter={(e) => showOnHoverJiku(e)} onMouseLeave={(e) => hideOnLeaveJiku(e)}><div className="add-jiku-plus-cont"><i className="fas fa-plus"></i></div></div><i className="fas fa-arrow-alt-circle-left move-jiku" onClick={(e) => moveJiku(e, "left")}></i><p>{jiku_i}軸目<i className="fas fa-trash trash-jiku" onClick={(e) => trashJiku(e)}></i></p><i className="fas fa-arrow-alt-circle-right move-jiku" onClick={(e) => moveJiku(e, "right")}></i></div>)
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
                        pg_l_arr.push(
                        <div className="pg-l-loop unselectable" style={{height:loopStyleHeight+"rem"}} id={"loop-"+dousa_group_i+"-"+dousa_row_i} key={"pglloop"+dousa_row}>
                            {/* <TypeDataInDousa parentId={"loop-"+dousa_group_i+"-"+dousa_row_i} loopData={props.loopData} setLoopData={props.setLoopData} dousaType="繰り返し" dousaNum={0}/> */}
                            {dragArrows.map(dragArrow => {return dragArrow})}
                            <p className="loop-title" onClick={(e) => showTypeData(e)}>繰り返し{loopCount}回</p>
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
                        if (dousa[2].includes("initial")) {
                            main_grid.push(<div className="dousa-box unselectable" draggable="true" onDragStart={(e) => emptyBoxDragStart(e)} onDragEnd={(e) => emptyBoxDragEnd(e)} onMouseEnter={(e) => props.setCurrentDraggedCommand(e.currentTarget.id)} key={dousa_group_i+"dousabox"+dousa_row_i+"-"+dousa_i} id={"dousa-"+dousa_group_i+"-"+dousa_row_i+"-"+dousa_i}><div className='no-value-circle'></div><TypeDataInDousa parentId={"dousa-"+dousa_group_i+"-"+dousa_row_i+"-"+dousa_i} programData={props.programData} setProgramData={props.setProgramData} dousaType={dousa[0]} dousaNum={dousa[1]}/><p className='dousa-title' onClick={(e) => showTypeData(e)} >{dousa[0]}{dousa[1]}</p><i className="fas fa-trash" onClick={(e) => trashInput(e, props.programData, props.setProgramData)}></i></div>)
                        } else {
                            main_grid.push(<div className="dousa-box unselectable" draggable="true" onDragStart={(e) => emptyBoxDragStart(e)} onDragEnd={(e) => emptyBoxDragEnd(e)} onMouseEnter={(e) => props.setCurrentDraggedCommand(e.currentTarget.id)} key={dousa_group_i+"dousabox"+dousa_row_i+"-"+dousa_i} id={"dousa-"+dousa_group_i+"-"+dousa_row_i+"-"+dousa_i}><TypeDataInDousa parentId={"dousa-"+dousa_group_i+"-"+dousa_row_i+"-"+dousa_i} programData={props.programData} setProgramData={props.setProgramData} dousaType={dousa[0]} dousaNum={dousa[1]}/><p className='dousa-title' onClick={(e) => showTypeData(e)} >{dousa[0]}{dousa[1]}</p><i className="fas fa-trash" onClick={(e) => trashInput(e, props.programData, props.setProgramData)}></i></div>)
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
                <Button variant="contained" onClick={() => changeCML(props.programData, props.loopData, props.isNyuryokuShingou)}>CMLへ変換</Button>
            </div>
        </div>
    )
}

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
    const [valueArr, setValueArr] = useState(tmp[parseInt(indexArr[0])][parseInt(indexArr[1])][parseInt(indexArr[2])][2])
    // --
    const closeTypeData = () => {
        popupRef.current.style.display = "none"
    }

    const DataInput = (props) => {
        // const data = [100, "pps"]
        const index = props.index
        const tanni = props.tanni
        let tanniArr = props.valueArr[index][1] !== "pps" ? [tanni, "pps"] : ["pps", tanni]
        // ---
        const setTanni = (tanni) => {
            let tmp = [...props.valueArr]
            tmp[index][1] = tanni
            props.setValueArr(tmp)
        }

        const [inputValue, setInputValue] = useState(100)
        useEffect(() => {
            let tmp = [...props.valueArr]
            tmp[index][0] = inputValue
            props.setValueArr(tmp)
        }, [inputValue])

        // const handleDataInput = (e, value) => {
            // e.preventDefault()
        // }
    
        return (
            <>
                {/* <input className="type-data-input" required onChange={(e) => handleDataInput(e)} key={1} defaultValue={props.valueArr[index][0]}/> */}
                <input className="type-data-input" required onChange={(e) => setInputValue(e.target.value)} key={1} value={inputValue}/>
                <p className="type-data-tanni" key={2}><Dropdown setItem={setTanni} itemArr={tanniArr} /></p>
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
        alert("再設計中")
        let tmp = [...props.programData]
        tmp[parseInt(indexArr[0])][parseInt(indexArr[1])][parseInt(indexArr[2])][2] = valueArr
        props.setProgramData([...tmp])
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
                <DataInput index={0} tanni={"mm/s"} valueArr={valueArr} setValueArr={setValueArr} />
                <p>と</p>
            </div>
            <div className="typedata-input-line">
                <p className="typedata-var">加速度データ</p>
                <DataInput index={1} tanni={"mm/s2"} valueArr={valueArr} setValueArr={setValueArr} />
                <p>で</p>
            </div>
            <div className="typedata-input-line">
                <p className="typedata-var">位置データ</p>
                <DataInput index={2} tanni={"mm"} valueArr={valueArr} setValueArr={setValueArr} />
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