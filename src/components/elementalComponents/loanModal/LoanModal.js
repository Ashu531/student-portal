import React, { useEffect } from 'react';
import Button from '../button/Button';

export default function CredencLoanModal({
    student,
    amount,
    installments_count,
    closeLoanModal,
    applyLoan
}) 
{
    return (
        <div className='loan-modal'>
            <div className='loan-modal-content'>
                <div className='loan-modal-container'>
                    <div className='title'>
                        Do you wish to proceed with your request to finance your fee?
                    </div>
                 </div> 
                        
                
                <div className='loan-modal-button-container'>
                    <Button 
                        text={'Save'} 
                        classes='button-small button-primary' 
                        handleClick={()=>applyLoan()}
                    />
                    <div style={{width: '10%'}} />
                    <Button 
                        text={'Discard'} 
                        classes='button-small button-primary' 
                        handleClick={()=>closeLoanModal()}
                    />
                </div>
            </div>
            <div className='closeIcon' onClick={()=>closeLoanModal()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#2a2b2d" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
            </div>
        </div>
    )
}
