import React, { useEffect, useState } from 'react';
import Button from '../button/Button';
import backIcon from '../../../assets/caret-right.svg';
import TransactionStatus from '../../elementalComponents/transactionStatus/TransactionStatus'
import moment from 'moment'
import { useParams, useNavigate } from 'react-router-dom';

export default function LoanSuccess({loanData,adhocLoan}) {
    const navigate = useNavigate();
    const [successIcon, setSuccessIcon] = useState(true)

    return (
        <div className='loan-success'>
           <TransactionStatus 
             icon={successIcon} 
             title='Loan Applied!'  
            //  description='Your auto-pay has been initiated and you will be get a confirmation up within 24 hours. '
            />
           <div className='student-content'>
                <div className='student-container'>
                    <div className='student-label'>Application ID</div>
                    <div className='student-name'>{loanData.application_id}</div>
                </div>
                <div className='student-container'>
                    <div className='student-label'>Amount</div>
                    <div className='student-detail'>{loanData.amount}</div>
                </div>
                <div className='student-container'>
                    <div className='student-label'>Loan Partner</div>
                    <div className='student-detail'>{loanData.loan_partner}</div>
                </div>
                <div className='student-container'>
                    <div className='student-label'>Date</div>
                    <div className='student-detail'>{moment(loanData.timestamp).format('LL')}</div>
                </div>
                <div className='student-container'>
                    <div className='student-label'>Time</div>
                    <div className='student-detail'>{moment(loanData.timestamp).format('HH:mm:ss')}</div>
                </div>
           </div>
           {
               !adhocLoan && 
               <Button 
                    text='Back To Dashboard' 
                    classes='button'
                    handleClick={()=> navigate(`/`, {replace: true})}
                />
           }
            
        </div>
    )
}



