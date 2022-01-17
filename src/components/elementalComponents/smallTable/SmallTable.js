import React from 'react'
import CollapsibleInstallment from '../collapsible/CollapsibleInstallment';

export default function SmallTable({ list, handleCheckBox, dependent=false, selectAll=false }) {
    return (
        <div className='small-table'>
            <div className='thead'>Installments</div>
            <div className='tbody' style={{height: dependent && '35vh'}}>
                {list.map((installment, i) => (
                    <CollapsibleInstallment installment={installment} index={i} handleCheckBox={handleCheckBox} key={i}/>
                ))}
            </div>
        </div>
    )
}
