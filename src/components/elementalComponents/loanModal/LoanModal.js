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
                    <div className='row' style={{display:'flex',justifyContent:'flex-start',alignItems:'center'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M10 1.875C8.39303 1.875 6.82214 2.35152 5.486 3.24431C4.14985 4.1371 3.10844 5.40605 2.49348 6.8907C1.87852 8.37535 1.71762 10.009 2.03112 11.5851C2.34463 13.1612 3.11846 14.6089 4.25476 15.7452C5.39106 16.8815 6.8388 17.6554 8.4149 17.9689C9.99099 18.2824 11.6247 18.1215 13.1093 17.5065C14.594 16.8916 15.8629 15.8502 16.7557 14.514C17.6485 13.1779 18.125 11.607 18.125 10C18.1227 7.84581 17.266 5.78051 15.7427 4.25727C14.2195 2.73403 12.1542 1.87727 10 1.875ZM9.6875 5.625C9.87292 5.625 10.0542 5.67998 10.2084 5.783C10.3625 5.88601 10.4827 6.03243 10.5536 6.20373C10.6246 6.37504 10.6432 6.56354 10.607 6.7454C10.5708 6.92725 10.4815 7.0943 10.3504 7.22541C10.2193 7.35652 10.0523 7.44581 9.8704 7.48199C9.68854 7.51816 9.50004 7.49959 9.32874 7.42864C9.15743 7.35768 9.01101 7.23752 8.908 7.08335C8.80499 6.92918 8.75 6.74792 8.75 6.5625C8.75 6.31386 8.84878 6.0754 9.02459 5.89959C9.20041 5.72377 9.43886 5.625 9.6875 5.625ZM10.625 14.375C10.2935 14.375 9.97554 14.2433 9.74112 14.0089C9.5067 13.7745 9.375 13.4565 9.375 13.125V10C9.20924 10 9.05027 9.93415 8.93306 9.81694C8.81585 9.69973 8.75 9.54076 8.75 9.375C8.75 9.20924 8.81585 9.05027 8.93306 8.93306C9.05027 8.81585 9.20924 8.75 9.375 8.75C9.70652 8.75 10.0245 8.8817 10.2589 9.11612C10.4933 9.35054 10.625 9.66848 10.625 10V13.125C10.7908 13.125 10.9497 13.1908 11.0669 13.3081C11.1842 13.4253 11.25 13.5842 11.25 13.75C11.25 13.9158 11.1842 14.0747 11.0669 14.1919C10.9497 14.3092 10.7908 14.375 10.625 14.375Z" fill="black"/>
                            </svg>
                            <div className='sub-title'>
                                Once you apply for loan, all other payment plans will be disabled.
                            </div>
                    </div>
                    
                 </div> 
                        
                
                <div className='loan-modal-button-container'>
                    <Button 
                        text={'Discard'} 
                        classes='button-auto button-outline' 
                        handleClick={()=>closeLoanModal()}
                    />
                    <div style={{width: '10%'}} />
                    <Button 
                        text={'Apply For Loan'} 
                        classes='button-auto button-primary' 
                        handleClick={()=>applyLoan()}
                    />
                </div>
                <div className='closeIcon' onClick={()=>closeLoanModal()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#2a2b2d" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
                </div>
            </div>
        </div>
    )
}
