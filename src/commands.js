export const inputToIchigimeCML = (document) => {
    const inputArr = document.querySelectorAll('input')
    let inputValues = []
    Array.from(inputArr).map(input => inputValues.push(input.value))
    return (
        `P=${inputValues[0]}\nA=${inputValues[1]}\nS=${inputValues[2]}\n`
    )
}

export const IchigimeInput = (props) => {
    return (
        <div className="ichigime-input input-block">
            <input type="text"></input>
            <p><span className="tanni">mm</span>を</p>
            <input type="text"></input>
            <p><span className="tanni">秒</span>で加速して</p>
            <input type="text"></input>
            <p><span className="tanni">秒</span>で移動する</p>
            {/* how to get parent of e */}
            <div className="trash-input unselectable" onClick={(e) => props.trashInput(e)}><i class="fas fa-times"></i></div>
        </div>
    )
}

// ------------------------------------------------

export const inputToOshitukeCML = (document) => {
    const inputArr = document.querySelectorAll('input')
    let inputValues = []
    Array.from(inputArr).map(input => inputValues.push(input.value))
    return (
        `Q=${inputValues[0]}\nA=${inputValues[1]}\nS=${inputValues[2]}\n`
    )
}

export const OshitukeInput = () => {
    return (
        <div className="oshituke-input input-block">
            <input type="text"></input>
            <p><span className="tanni">mm</span>の位置まで</p>
            <input type="text"></input>
            <p><span className="tanni">秒</span>で加速して</p>
            <input type="text"></input>
            <p><span className="tanni">秒</span>で押付け動作をする</p>
        </div>
    )
}

// ------------------------------------------------

export const inputToTimerCML = (document) => {
    const inputArr = document.querySelectorAll('input')
    let inputValues = []
    Array.from(inputArr).map(input => inputValues.push(input.value))
    return (
        `T=${inputValues[0]}\n`
    )
}

export const TimerInput = () => {
    return (
        <div className="timer-input input-block">
            <input type="text"></input>
            <p><span className="tanni">秒</span>待つ</p>
        </div>
    )
}

// ------------------------------------------------

export const inputToBunkiCML = (document) => {
    const inputArr = document.querySelectorAll('input')
    let inputValues = []
    Array.from(inputArr).map(input => inputValues.push(input.value))
    return (
        `I=${inputValues[0]}\nA=${inputValues[1]}\nS=${inputValues[2]}\n`
    )
}

export const BunkiInput = () => {
    return (
        <div className="bunki-input input-block">
            <p>もし入力</p>
            <input type="text"></input>
            <p>が<span className="tanni">オン</span>のとき</p>
            <input type="text"></input>
            <p><span className="tanni">オフ</span>のとき</p>
            <input type="text"></input>
        </div>
    )
}

// ------------------------------------------------

export const inputToBunkiVCML = (document) => {
    const inputArr = document.querySelectorAll('input')
    let inputValues = []
    Array.from(inputArr).map(input => inputValues.push(input.value))
    return (
        `I=${inputValues[0]}\nA=${inputValues[1]}\nS=${inputValues[2]}\n`
    )
}

export const BunkiVInput = () => {
    return (
        <div className="bunkiv-input input-block">
            <p>もし</p>
            <input type="text"></input>
            <p>が<span className="tanni">オン</span>のとき</p>
            <input type="text"></input>
            <p><span className="tanni">オフ</span>のとき</p>
            <input type="text"></input>
        </div>
    )
}