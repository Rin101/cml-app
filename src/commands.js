export const inputToIchigimeCML = (document) => {
    const inputArr = document.querySelectorAll('input')
    let inputValues = []
    Array.from(inputArr).map(input => inputValues.push(input.value))
    return (
        `P=${inputValues[0]}\nA=${inputValues[1]}\nS=${inputValues[2]}\n`
    )
}

export const IchigimeInput = () => {
    return (
        <div className="ichigime-input">
            <input type="text"></input>
            <p><span className="tanni">mm</span>を</p>
            <input type="text"></input>
            <p><span className="tanni">秒</span>で加速して</p>
            <input type="text"></input>
            <p><span className="tanni">秒</span>で移動する</p>
        </div>
    )
}