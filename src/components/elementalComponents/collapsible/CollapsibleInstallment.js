import React, { useState } from 'react';
import collapseIcon from '../../../assets/caret-up-black.svg';
import expandIcon from '../../../assets/caret-down-black.svg';
import CheckBox from '../checkBox/CheckBox';

export default function CollapsibleInstallment({ installment, index, handleCheckBox }) {

    const [collapsed, setCollapsed] = useState(true);
    const handleClick = () => {
        setCollapsed(!collapsed);
    }

    return (
        <div className='collapsible-installment' onClick={handleClick}>
            <div className='row' style={{background: `${collapsed ? '': 'rgb(255, 255, 255, 0.95)'}`}}>
                <CheckBox setChecked={(v) => handleCheckBox(v, index)} isChecked={installment.is_mandatory}/>
                <div style={{flexGrow: '1', margin: '0 0 0 1.2rem'}}>
                    <div className='bold' style={{textTransform: 'capitalize'}}>
                        {installment.name}
                    </div>
                    <div className='subline' style={{display: !collapsed && 'none'}}>
                        INR {installment.amount}
                    </div>
                </div>
                <div className={`status ${installment.status}`}>{installment.status}</div>
                <img src={collapsed ? expandIcon : collapseIcon}/>
            </div>
            
            {
            !collapsed && <div className="content">
                <div className='pair'>
                    <div className='key'>Amount</div>
                    <div className='value'>{installment.amount}</div>
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
                    <div className='key'>Due Date</div>
                    <div className='value'>{installment.due_date}</div>
                </div>
                <div className='pair'>
                    <div className='key'>End Date</div>
                    <div className='value'>{installment.expire_date}</div>
                </div>
            </div>
            }
        </div>
    );
}
