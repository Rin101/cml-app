import { Button } from '@mui/material'
import { useState, useRef, useEffect } from 'react'
import { SettingInfo } from './settingInfo'
import { SettingsDefaultInfo } from './settingsDefaultInfo'
import './settingsPanel.css'

export const SettingsPanel = ({ closePanel, settings, setSettings }) => {

    const settingsPanelData = {
        "kyoutuu": [
            {"kNum":5, "name":"inposition", "tanni": "Pulse", "label":"インポジション幅", "inputType":"text", "infoText":'インポジションと認識する幅を設定: 10.3 参照'},
        ],
        "oshituke": [
            {"kNum":11, "name":"oshitukeDousaMode", "tanni": "", "label":"押付け動作モード", "inputType":"dropdown", "inputs":["連続(片方向)","有限(片方向)","連続(両方向)","有限(両方向)",], "infoText":<>押付動作時の押付方向<br/>連続押付又は有限押付を設定<br/>():トルクが制限される方向<br/>片:動作方向に向かってのみトルク制限動作<br/>両:動作方向にかかわらずトルク制限動作</>},
            {"kNum":12, "name":"oshitukeDousaTorque", "tanni": "%", "label":"押付け動作トルク", "inputType":"text", "infoText":<>コマンドＱ又はＺによる押付け動作時の<br/>トルク設定を定格トルクに対する％で設定します。</>},
            {"kNum":13, "name":"oshitukeDousaTime", "tanni": "msec", "label":"押付け動作保持時間", "inputType":"text", "infoText":'押付動作時間を設定8.6.2 参照'},
        ],
        "genten": [
            {"kNum":22, "name":"gentenShingou", "tanni": "", "label":"原点信号源", "inputType":"dropdown", "inputs":["押当原点検出","押当原点検出(自)","原点センサ","原点センサ(自)"], "infoText":<>原点検出信号源と検出方法を設定<br/>原点センサは、入力点１にのみ割付可能<br/>（自）：電源 ON 時、自動原点検出動作を開始<br/>11.1 参照</>},
            {"kNum":23, "name":"gentenSpeed", "tanni": "100pps", "label":"原点検出速度", "inputType":"text", "infoText":'原点検出動作時の速度を設定'},
            {"kNum":24, "name":"gentenAccel", "tanni": "kpps2", "label":"原点検出加速度", "inputType":"text", "infoText":'原点検出動作時の加速度を設定'},
            {"kNum":25, "name":"gentenDirection", "tanni": "", "label":"原点検出方向", "inputType":"dropdown", "inputs":["CW方向","CCW方向"], "infoText":'原点検出動作時の動作方向を設定'},
            {"kNum":26, "name":"gentenOffset", "tanni": "100Pulse", "label":"原点オフセット距離", "inputType":"text", "infoText":<>検出した原点から座標原点までの<br/>オフセット量を設定</>},
            {"kNum":28, "name":"gentenTorque", "tanni": "%", "label":"押当原点検出トルク", "inputType":"text", "infoText":<>押当原点検出時、機械ストッパを検出するトルクを<br/>定格トルクに対する比率で設定<br/>11.1.1 参照</>},
        ],
    }

    const [settingsObj, setSettingsObj] = useState(settings)

    const SettingsPanelItem = ({ data }) => {

        const [inputValue, setInputValue] = useState(settingsObj["kNum" + data["kNum"].toString()])

        const setTextInputValue = (value) => {
            setInputValue(value)
            let tmp = settingsObj
            tmp["kNum" + data["kNum"].toString()] = value
            setSettingsObj(tmp)
        }

        const setDropdownValue = (inputValue) => {
            const inputIndex = data["inputs"].indexOf(inputValue)
            setInputValue(inputIndex)
            let tmp = settingsObj
            tmp["kNum" + data["kNum"].toString()] = inputIndex
            setSettingsObj(tmp)
        }

        switch (data["inputType"]) {
            case "text":
                return (
                    <div className='settings-panel-item'>
                        <div className='settings-panel-item-label-container'>
                            <p className='settings-panel-item-label'>{ data["label"] }</p>
                            <SettingInfo text={ data["infoText"] } />
                        </div>
                        <input className='settings-panel-item-input' placeholder={settings["kNum" + data["kNum"].toString()]} onChange={(e) => setTextInputValue(e.target.value)}/>
                        <p className='settings-panel-item-tanni'>{data["tanni"]}</p>
                    </div>
                )
            case "dropdown":
                return (
                    <div className='settings-panel-item'>
                        <div className='settings-panel-item-label-container'>
                            <p className='settings-panel-item-label'>{ data["label"] }</p>
                            <SettingInfo text={ data["infoText"] } />
                        </div>
                        <div className='settings-panel-item-input'>
                            <Dropdown setItem={setDropdownValue} defaultItem={data["inputs"][settings["kNum" + data["kNum"].toString()]]} itemArr={data["inputs"]} />
                        </div>
                        <p className='settings-panel-item-tanni'>{data["tanni"]}</p>
                    </div>
                )
            default:
                return
        }
    }

    const saveChanges = () => {
        closePanel()
        setSettings(settingsObj)
    }

    const setToDefault = () => {
        // closePanel()
        setSettingsObj({
            'kNum5': 5, 'kNum11': 0, 'kNum12': 30, 'kNum13': 200, 'kNum14': 0, 'kNum22': 0,
            'kNum23': 10, 'kNum24': 10, 'kNum25': 0, 'kNum26': 0, 'kNum28': 30
        })
        setSettings({
            'kNum5': 5, 'kNum11': 0, 'kNum12': 30, 'kNum13': 200, 'kNum14': 0, 'kNum22': 0,
            'kNum23': 10, 'kNum24': 10, 'kNum25': 0, 'kNum26': 0, 'kNum28': 30
        })
    }

    return (
        <div id="settings-panel">
            <div id="close-settings-panel" onClick={() => closePanel()}><i className="fas fa-times"></i></div>
            {/* content */}
            <div className='settings-panel-block'>
                <p className='settings-panel-block-label'>共通設定</p>
                <div className='settings-panel-block-contents'>
                    { settingsPanelData["kyoutuu"].map((item, i) => <SettingsPanelItem data={item} key={i}/>) }
                </div>
            </div>
            <div className='settings-panel-block'>
                <p className='settings-panel-block-label'>押付け動作設定</p>
                <div className='settings-panel-block-contents'>
                    { settingsPanelData["oshituke"].map((item, i) => <SettingsPanelItem data={item} key={i} />) }
                </div>
            </div>
            <div className='settings-panel-block'>
                <p className='settings-panel-block-label'>原点検出設定</p>
                <div className='settings-panel-block-contents'>
                    { settingsPanelData["genten"].map((item, i) => <SettingsPanelItem data={item} key={i} />) }
                </div>
            </div>
            <div id='setting-buttons'>
                <div id='save-changes-button'>
                    <Button variant="contained" onClick={() => saveChanges()}>
                        変更を保存
                    </Button>
                </div>
                <div style={{marginRight: "30px"}}></div>
                <div id='settings-to-default-button'>
                    <Button variant="text" onClick={() => setToDefault()}>
                        デフォルト設定に戻す
                    </Button>
                </div>
                <div style={{marginRight: "10px"}}></div>
                <SettingsDefaultInfo info={settingsPanelData} />
            </div>
        </div>
    )
}

const Dropdown = (props) => {
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
            <div ref={selectedItemRef} className="selected-item-smaller unselectable" onClick={() => showItems()}>{selectedItem}<i className="fas fa-angle-down"></i></div>
            <div ref={dropdownItems} className="dropdown-items unselectable">
                {dropdowns()}
            </div>
        </div>
    )
}