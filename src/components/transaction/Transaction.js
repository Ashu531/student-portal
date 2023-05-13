import React, { useEffect, useState } from 'react';
import Header from '../../components/elementalComponents/header/Header'
import Button from '../elementalComponents/button/Button';
import backIcon from '../../assets/caret-right.svg';
import TransactionStatus from '../../components/elementalComponents/transactionStatus/TransactionStatus'

export default function Transaction() {
    const [successIcon, setSuccessIcon] = useState(true)

    return (
        <div className='transaction'>
           <Header
             title="Transaction"
           />
           <TransactionStatus 
             icon={successIcon} 
             title='Auto-Pay initiated!'  
             description='Your auto-pay has been initiated and you will be get a confirmation up within 24 hours. '
            />
           <div className='student-content'>
                <div className='student-container'>
                    <div className='student-label'>Student Name</div>
                    <div className='student-name'>Nandini Mediratta</div>
                </div>
                <div className='student-container'>
                    <div className='student-label'>Admission No.</div>
                    <div className='student-detail'>ABC1234</div>
                </div>
                <div className='student-container'>
                    <div className='student-label'>Grade</div>
                    <div className='student-detail'>5-A</div>
                </div>
                <div className='student-container'>
                    <div className='student-label'>School</div>
                    <div className='student-detail'>Shikshantar Sr. Sec. School</div>
                </div>
           </div>
            <Button 
             text='Back To Dashboard' 
             classes='button'
            />
        </div>
    )
}



