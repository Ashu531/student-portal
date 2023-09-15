import { width } from 'dom-helpers';
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
                {   window.innerWidth < 500 &&
                    <div className='sliding-panel-close-icon' onClick={closeSlidingPanel}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#2a2b2d" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
                    </div>
                }
            </div>
        </div>
    )
}
