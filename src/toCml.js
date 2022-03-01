export const toCML = (programData, loopData, isNyuryokuShingou, tkData) => {
    let output = ""
    let every_data_teigi = ""
    let every_program_teigi = ""
    for (let dousa_group of programData) {
        let dousa_group_index = programData.indexOf(dousa_group) + 1
        every_program_teigi += "B" + dousa_group_index.toString() + "\n"
        let dousa_jikkou_of_group = ""
        for (let dousa_row of dousa_group) {
            let dousa_jikkou_row_arr = []
            for (let dousa of dousa_row) {
                if (dousa.length !== 0) {
                    const dousa_jiku = dousa_row.indexOf(dousa) + 1
                    let cml_numbers = dousa[1].toString() + "." + dousa_jiku.toString()
                    const tanniValue = tkData[dousa_jiku-1].tanniValue
                    switch (dousa[0]) {
                        case "位置決め":
                            every_data_teigi += "S"+cml_numbers+"="+getPulseValue(dousa[2][0], tanniValue,100).toString()+"\nA"+cml_numbers+"="+getPulseValue(dousa[2][1], tanniValue,1000).toString()+"\nP"+cml_numbers+"="+getPulseValue(dousa[2][2], tanniValue).toString()+`\n`
                            dousa_jikkou_row_arr.push(`S${cml_numbers},A${cml_numbers},P${cml_numbers}`)
                            break
                        case "押付け":
                            every_data_teigi += "S"+cml_numbers+"="+getPulseValue(dousa[2][0], tanniValue,100).toString()+"\nA"+cml_numbers+"="+getPulseValue(dousa[2][1], tanniValue,1000).toString()+"\nP"+cml_numbers+"="+getPulseValue(dousa[2][2], tanniValue).toString()+"\n"
                            dousa_jikkou_row_arr.push(`S${cml_numbers},A${cml_numbers},Q${cml_numbers}`)
                            break
                        case "トルク制限":
                            every_data_teigi += "M"+cml_numbers+"="+getPulseValue(dousa[2][0], tanniValue).toString()+"\n"
                            dousa_jikkou_row_arr.push(`M${cml_numbers}`)
                            break
                        case "タイマ":
                            every_data_teigi += "T"+cml_numbers+"="+getPulseValue(dousa[2][0], tanniValue).toString()+"\n"
                            dousa_jikkou_row_arr.push(`T${cml_numbers}`)
                            break
                        default:
                            alert('ERROR')
                            break
                    }
                }
            }
            let loop_start = ""
            let loop_end = ""
            for (let loop of loopData) {
                if (loop[0][0] === programData.indexOf(dousa_group).toString() && loop[0][1] === dousa_group.indexOf(dousa_row).toString()) {
                    loop_start = `X${loop[2]}.1\n`
                }
                if (loop[1][0] === programData.indexOf(dousa_group).toString() && loop[1][1] === dousa_group.indexOf(dousa_row).toString()) {
                    loop_end = `\nX.1-\n`
                }
            }
            dousa_jikkou_of_group += loop_start + dousa_jikkou_row_arr.join(",") + "\n" + loop_end
        }
        every_program_teigi += dousa_jikkou_of_group
    }
    
    output += every_data_teigi
    output += every_program_teigi
    if (isNyuryokuShingou) {
        let nyuryokuTxt = `\nK81=1\nK82=1\nL1.1\nI1.1,JL2.1,T0.1\nI2.1,JL3.1,T0.1\nI3.1,JL4.1,T0.1\nI4.1,].1:].1,T0.1\nL2.1\n[1.1\nI1.1,W0.1,JL1.1\nL3.1\n[2.1\nI2.1,W0.1,JL1.1\nL4.1\n[3.1\nI3.1,W0.1,JL1.1\nEND`
        return output + "\nEND" + nyuryokuTxt
    } else {
        return output + "END"
    }
}

const getPulseValue = (valueArr, tanniValue, divideVar=1) => {
    let value = parseFloat(valueArr[0])
    const tanni = valueArr[1]
    if (tanni.includes("pps") || tanni.includes("%") || tanni.includes('msec')) {
        return Math.round(value)
    } else {
        return Math.round(value * tanniValue / divideVar)
    }
}