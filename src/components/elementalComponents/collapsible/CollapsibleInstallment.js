import React, { useState } from 'react';
import collapseIcon from '../../../assets/caret-up-black.svg';
import expandIcon from '../../../assets/caret-down-black.svg';
import CheckBox from '../checkBox/CheckBox';

export default function CollapsibleInstallment({ installment, index, handleCheckBox, showStatus=false }) {

    const [collapsed, setCollapsed] = useState(true);
    const handleClick = () => {
        setCollapsed(!collapsed);
    }

    const getDisabled = () => {
        if((installment['status'] === 'due' || installment['status'] === 'overdue') && installment['is_mandatory'] !== 'True')
            return false;
        
        return true;
    }

    return (
        <div className='collapsible-installment' onClick={handleClick}>
            <div className='row' style={{background: `${collapsed ? '': 'rgb(255, 255, 255, 0.95)'}`}}>
                <div style={{flexGrow: '1'}}>
                    <div className='subline' style={{textTransform: 'capitalize'}}>
                        {installment.name}
                    </div>
                </div>
                {showStatus && <div style={{margin: '0 1rem 0 0'}} className={`status ${installment.status}`}>{installment.status}</div>}
                <div className='subline bold' style={{display: !collapsed && 'none', margin: handleCheckBox ? '' : '0 1rem 0 0'}}>
                    ₹ {installment.amount}
                </div>
                {handleCheckBox && 
                <div style={{margin: '0 2rem 0 1rem'}}>
                    <CheckBox 
                        setChecked={(v) => {
                            handleCheckBox(v, index)
                        }} 
                        isChecked={installment.is_mandatory === 'True' || installment.is_mandatory === true} 
                        disabled={getDisabled()}
                    />
                </div>
                }
                <img src={collapsed ? expandIcon : collapseIcon}/>
            </div>
            
            {
            !collapsed && <div className="content">
                <div className='pair'>
                    <div className='key'>Amount</div>
                    <div className='value'>₹ {installment.amount}</div>
                </div>
                <div className='pair'>
                    <div className='key'>Penalty</div>
                    <div className='value'>{installment.penalty}</div>
                </div>
                <div className='pair'>
                    <div className='key'>Start Date</div>
                    <div className='value'>{installment.start_date}</div>
                </div>
                <div className='pair'>
                    <div className='key'>End Date</div>
                    <div className='value'>{installment.due_date}</div>
                </div>
                <div className='pair'>
                    <div className='key'>Expire Date</div>
                    <div className='value'>{installment.expire_date}</div>
                </div>
            </div>
            }
        </div>
    );
}
