import React, { useEffect, useState } from 'react';
import Header from '../../components/elementalComponents/header/Header'
import Button from '../elementalComponents/button/Button';
import backIcon from '../../assets/caret-right.svg';

export default function Autopay() {

    return (
        <div className='autopay'>
           <Header
             title="Auto-Pay"
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
           <div className='amount-container'>
                <div className='amount-label'>
                    Total Amount
                </div>
                <div className='amount'>
                    ₹ 2,94,600
                </div>
           </div>
           <div className='benefit-container'>
                <span className='benefit-header'>Benefits of Auto-Pay</span>
                <div className='benefit-list'>
                    <ol style={{marginLeft: '-3rem'}}>
                        <li className='benefit-text'>Convenience: Setting up auto-pay means you don't have to worry about meeting deadlines for fees payments.</li>
                        <li className='benefit-text'>Avoiding Late Fees: You can ensure that your school fees are paid on time, which helps you avoid late fees.</li>
                        <li className='benefit-text'>Secure and Consistent: It is ensured that your payments are consistently paid each instalment, securely.</li>
                        <li className='benefit-text'>Customisation: You can change, modify or cancel your payments as and when required. </li>
                    </ol>
                </div>
           </div>
            <Button 
             text='Proceed' 
             classes='button'
            />
            <div className='payment-card'>
                <div className='payment-header'>
                    <span className='header-text'>Payment Details</span>
                </div>
                <div className='quarter-container'>
                    <div className='quarter-header'>
                        <span className='quarter-label'>Quarter 1</span>
                        <span className='quarter-label'>2021 JAN 16</span>
                        <span className='quarter-label' style={{fontWeight: 700}}>₹ 54,500</span>
                        <img src={backIcon} height={20} width={20} style={{transform: 'rotate(90deg)'}} />
                    </div>
                    <div className='fee-breakup'>
                        <div className='fee-content'>
                            <span className='fee-content-text'>Registration Fee</span>
                            <span className='fee-content-text' style={{fontWeight: 600}}>₹ 2,500</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



