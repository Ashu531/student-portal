import React from 'react'
import CollapsibleInstallment from '../collapsible/CollapsibleInstallment';

export default function SmallTable({ list, handleCheckBox, dependent=false, selectAll=false, showStatus=false }) {
    return (
        list && list.length > 0 && <div className='small-table'>
            <div className='thead'>Installments</div>
            <div className='tbody' style={{height: dependent && '35vh'}}>
                {list.map((installment, i) => (
                    <CollapsibleInstallment installment={installment} showStatus={showStatus} index={i} handleCheckBox={handleCheckBox} key={i}/>
                ))}
            </div>
        </div>
    )
}
