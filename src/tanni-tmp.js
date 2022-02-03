const Tannikannsann = (props) => {
    const [application, setApplication] = useState("ねじリード")
    const [bunkainou, setBunkainou] = useState(300)

    const nyuryokuInput = useRef()
    const shuturyokuInput = useRef()
    const susumiInput = useRef()

    const getPulse = (tanniValue) => {
        let kyori = 100
        let nyuryoku = parseInt(nyuryokuInput.current.value.trim())
        let shuturyoku = parseInt(shuturyokuInput.current.value.trim())
        let susumiryou = parseInt(susumiInput.current.value.trim())
        switch(application) {
            case "ねじリード":
                break;
            default:
                susumiryou = parseInt(susumiInput.current.value.trim()) * Math.PI
        }
        let pulse = kyori * (1/susumiryou) * parseInt(bunkainou) * (nyuryoku/shuturyoku)

        {/* <p>パルス　=　距離[𝑚𝑚] × (1/進み量[𝑚𝑚⁄回転]) × 分解能[パルス/回転] × (入力/出力)</p> */}
        props.closeTanni(props.topMenuRef, props.layerRef)
    }

    const getApplicationType = () => {
        switch (application) {
            case "ボールねじ":
                return ["ねじリード", "ねじリード"]
            case "タイミングベルト":
                return ["ブーリ直径", "ブーリ直径xπ"]
            case "ラック&ピニオン":
                return ["ピニオン直径", "ピニオン直径xπ"]
            default:
                return ["ねじリード", "ねじリード"]
        }
    }

    const WizardController = () => {
        const [history, setHistory] = useState([])
        const [wizardInput, setWizardInput] = useState(["kikou", "モータ単体"])

        useEffect(() => {
            console.log(history)
        }, [history])

        const inputForm = () => {
            const params = {
                wizardInput: wizardInput[1], history, setHistory, setWizardInput
            }
        
            switch (wizardInput[0]) {
                case "kikou":
                    return <WizardKikou params={params} />
                case "susumiryou":
                    return <WizardSusumiryou params={params} />
                case "gensoku":
                    return <WizardGensoku params={params} />
                case "hyouji":
                    return <WizardHyouji params={params} />
                case "bunkai":
                    return <WizardBunkai getPulse={getPulse} setTanniValue={props.setTanniValue} params={params} />
            }
        }

        return (
            <div className='wizard-controller'>
                <div className='wizard-input'>
                    {inputForm()}
                </div>
                <div className='wizard-buttons'>
                </div>
            </div>
        )
    } 

    return (
        <div className="tannikannsann-popup">
            <div className="close-popup close-tannikannsann" onClick={() => props.closeTanni(props.topMenuRef, props.layerRef)}><i className="fas fa-times-circle"></i></div>
            <div className="tannikannsann-wrapper">
                <WizardController />
            </div>
            
            {/* <div>パルス　=　<p ref={pulseText}></p></div> */}
            {/* <div className="pulse-formula-box"> */}
                {/* <p>パルス　=　距離[𝑚𝑚] × (1/進み量[𝑚𝑚⁄回転]) × 分解能[パルス/回転] × (入力/出力)</p> */}
            {/* </div> */}
        </div>
    )
}

