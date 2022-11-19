import { Button } from '@mui/material'
import { useState } from 'react'
import { SettingInfo } from './settingInfo'
import './settingsPanel.css'

export const SettingsPanel = ({ closePanel }) => {

    const [settings, setSettings] = useState({})

    const settingsPanelData = {
        "kyoutuu": [
            {"name":"inposition", "label":"インポジション幅", "inputType":"text", "infoText":'インポジションと認識する幅を設定: 10.3 参照'},
        ],
        "oshituke": [
            {"name":"oshitukeDousaMode", "label":"押付け動作モード", "inputType":"text", "infoText":'インポジションと認識する幅を設定: 10.3 参照'},
            {"name":"oshitukeDousaMode", "label":"押付け動作トルク", "inputType":"text", "infoText":'インポジションと認識する幅を設定: 10.3 参照'},
            {"name":"oshitukeDousaMode", "label":"押付け動作保持時間", "inputType":"text", "infoText":'インポジションと認識する幅を設定: 10.3 参照'},
        ],
        "genten": [
            {"name":"inposition", "label":"原点信号源", "inputType":"text", "infoText":'インポジションと認識する幅を設定: 10.3 参照'},
            {"name":"inposition", "label":"原点検出速度", "inputType":"text", "infoText":'インポジションと認識する幅を設定: 10.3 参照'},
            {"name":"inposition", "label":"原点検出加速度", "inputType":"text", "infoText":'インポジションと認識する幅を設定: 10.3 参照'},
            {"name":"inposition", "label":"原点検出方向", "inputType":"text", "infoText":'インポジションと認識する幅を設定: 10.3 参照'},
            {"name":"inposition", "label":"原点オフセット距離", "inputType":"text", "infoText":'インポジションと認識する幅を設定: 10.3 参照'},
            {"name":"inposition", "label":"原点オフセット距離単位", "inputType":"text", "infoText":'インポジションと認識する幅を設定: 10.3 参照'},
            {"name":"inposition", "label":"押当原点検出トルク", "inputType":"text", "infoText":'インポジションと認識する幅を設定: 10.3 参照'},
        ],
    }

    const SettingsPanelItem = ({ data }) => {
        return (
            <div className='settings-panel-item'>
                <div className='settings-panel-item-label-container'>
                    <p className='settings-panel-item-label'>{ data["label"] }</p>
                    <SettingInfo text={ data["infoText"] } />
                </div>
                <input className='settings-panel-item-input'/>
            </div>
        )
    }

    const saveChanges = () => {
        closePanel()
    }

    return (
        <div id="settings-panel">
            <div id="close-settings-panel" onClick={() => closePanel()}><i className="fas fa-times"></i></div>
            {/* content */}
            <div className='settings-panel-block'>
                <p className='settings-panel-block-label'>共通設定</p>
                <div className='settings-panel-block-contents'>
                    { settingsPanelData["kyoutuu"].map(item => <SettingsPanelItem data={item} />) }
                </div>
            </div>
            <div className='settings-panel-block'>
                <p className='settings-panel-block-label'>押付け動作設定</p>
                <div className='settings-panel-block-contents'>
                    { settingsPanelData["oshituke"].map(item => <SettingsPanelItem data={item} />) }
                </div>
            </div>
            <div className='settings-panel-block'>
                <p className='settings-panel-block-label'>原点検出設定</p>
                <div className='settings-panel-block-contents'>
                    { settingsPanelData["genten"].map(item => <SettingsPanelItem data={item} />) }
                </div>
            </div>
            <div id='save-changes-button'>
                <Button variant="contained" onClick={() => saveChanges()}>
                    変更を保存
                </Button>
            </div>
        </div>
    )
}