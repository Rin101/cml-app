import './settings.css'

export const SettingsPanel = ({ closePanel }) => {

    return (
        <div id="settings-panel">
            <div className="close-popup close-tannikannsann" onClick={() => closePanel()}><i className="fas fa-times-circle"></i></div>
            {/* content */}
            <div className='settings-panel-block'>
                <p className='settings-panel-block-label'>共通設定</p>
                <div className='settings-panel-block-contents'>
                    <div className='settings-panel-item'>
                        <p className='settings-panel-item-label'>インポジション幅</p>
                        <i className="fa-solid fa-circle-question"></i>
                        <input className='settings-panel-item-input' />
                    </div>
                </div>
            </div>
            <div className='settings-panel-block'>
                <p className='settings-panel-block-label'>押付け動作設定</p>
                <div className='settings-panel-block-contents'>
                    <div className='settings-panel-item'>
                        <p className='settings-panel-item-label'>インポジション幅</p>
                        <i className="fa-solid fa-circle-question"></i>
                        <input className='settings-panel-item-input' />
                    </div>
                </div>
            </div>
            <div className='settings-panel-block'>
                <p className='settings-panel-block-label'>原点検出設定</p>
                <div className='settings-panel-block-contents'>
                    <div className='settings-panel-item'>
                        <p className='settings-panel-item-label'>インポジション幅</p>
                        <i className="fa-solid fa-circle-question"></i>
                        <input className='settings-panel-item-input' />
                    </div>
                </div>
            </div>
        </div>
    )
}