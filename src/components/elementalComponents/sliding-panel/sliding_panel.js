import React from 'react';
// import DetailModal from '../../../../../partner-loan-management-system/src/components/detailModal/detailModal.jsx';
// import Button from '../buttonNew/newButton.jsx';
import './sliding_panel.scss';

export default function SlidingPanel({
    closeSlidingPanel,
    children,
    buttons
}) 
{
    return (
        <div className='sliding-modal' >
            <div className='overlay'>
                <div style={{width:'100%',cursor:'pointer',height:'100%'}} onClick={closeSlidingPanel}>

                </div>
            </div> 
            <div className='sliding-modal-content' id='quick-view-content'>
                {children}
                {/* <div className='footer'>
                    {buttons}
                </div> */}
            </div>
        </div>
    )
}
