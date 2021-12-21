export const toCML = (programData, loopData, isNyuryokuShingou) => {
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
                    let dousa_jiku = dousa_row.indexOf(dousa) + 1
                    let cml_numbers = dousa[1].toString() + "." + dousa_jiku.toString()
                    switch (dousa[0]) {
                        case "位置決め":
                            every_data_teigi += "S"+cml_numbers+"="+dousa[2][0].toString()+"\nA"+cml_numbers+"="+dousa[2][1].toString()+"\nP"+cml_numbers+"="+dousa[2][2].toString()+"\n"
                            dousa_jikkou_row_arr.push(`S${cml_numbers},A${cml_numbers},P${cml_numbers}`)
                            break
                        case "押付け":
                            every_data_teigi += "S"+cml_numbers+"="+dousa[2][0].toString()+"\nA"+cml_numbers+"="+dousa[2][1].toString()+"\nP"+cml_numbers+"="+dousa[2][2].toString()+"\n"
                            dousa_jikkou_row_arr.push(`S${cml_numbers},A${cml_numbers},Q${cml_numbers}`)
                            break
                        case "トルク制限":
                            every_data_teigi += "M"+cml_numbers+"="+dousa[2][0].toString()+"\n"
                            dousa_jikkou_row_arr.push(`M${cml_numbers}`)
                            break
                        case "タイマ":
                            every_data_teigi += "T"+cml_numbers+"="+dousa[2][0].toString()+"\n"
                            dousa_jikkou_row_arr.push(`T${cml_numbers}`)
                            break
                        default:
                            alert('wrong')
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
                    loop_end = `X.1-\n`
                }
            }
            dousa_jikkou_of_group += loop_start + dousa_jikkou_row_arr.join(",") + "\n" + loop_end
        }
        every_program_teigi += dousa_jikkou_of_group + "\n"
    }
    
    output += every_data_teigi + "\n"
    output += every_program_teigi + "\n"
    if (isNyuryokuShingou) {
        let nyuryokuTxt = `K81=1
        K82=1
        L1.1
        I1.1,JL2.1,T0.1
        I2.1,JL3.1,T0.1
        I3.1,JL4.1,T0.1
        I4.1,].1:].1,T0.1
        L2.1
        [1.1
        I1.1,W0.1,JL1.1
        L3.1
        [2.1
        I2.1,W0.1,JL1.1
        L4.1
        [3.1
        I3.1,W0.1,JL1.1
        END
        `
        return output + "END" + "\n" + nyuryokuTxt
    } else {
        return output + "END"
    }
}
