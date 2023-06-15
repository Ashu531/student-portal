import React, { useEffect } from 'react';
import Button from '../button/Button';
import successIcon from '../../../assets/successIcon.svg'
import failureIcon from '../../../assets/failureIcon.svg'
import closeIcon from '../../../assets/closeIcon.svg'
import StudentDetails from '../studentDetails/StudentDetails';

export default function ConfirmationModal({ 
    handleClose, 
    handleSubmit, 
    modalData, 
    autoPay,
    student,
    amount
}) 
{
    return (
        <div className='confirm-modal'>
            <div className='confirm-modal-content'>
                <div className='modal-container'>
                    <img src={modalData?.successImage ? successIcon : failureIcon} alt="status-icon" height={45} width={45} style={{objectFit:'contain'}}/>
                    <p className='heading'>{modalData?.title}</p>
                    {
                      modalData?.subHeading &&   <p className='sub-heading'>{modalData?.subHeading}</p>
                    }
                    {
                        modalData?.description?.length > 0 && <p className='sub-heading'>{modalData?.description}</p>
                    }
                    
                </div> 
                {
                    modalData?.type === 2 && 
                    <div className='student-content'>
                        <div className='student-container'>
                            <div className='student-label'>Student Name</div>
                            <div className='student-name'>{student?.name}</div>
                        </div>
                        <div className='student-container'>
                            <div className='student-label'>Admission No.</div>
                            <div className='student-detail'>{student?.prn}</div>
                        </div>
                        <div className='student-container'>
                            <div className='student-label'>Grade</div>
                            <div className='student-detail'>{student?.course}</div>
                        </div>
                        <div className='student-container'>
                            <div className='student-label'>School</div>
                            <div className='student-detail'>{student?.college}</div>
                        </div>
                        <div className='divider' />
                        <div className='student-container'>
                            <div className='student-label'>Total Amount</div>
                            <div className='student-detail'>{amount}</div>
                        </div>
                        <div className='student-container'>
                            <div className='student-label'>Frequency</div>
                            <div className='student-detail'>Quarterly</div>
                        </div>
                        <div className='student-container'>
                            <div className='student-label'>No. of Payments</div>
                            <div className='student-detail'>4</div>
                        </div>
                    </div>
                }
                        
                
                <div className='button-container'>
                    <Button 
                        text={modalData?.buttonText} 
                        classes='button-small button-primary' 
                        handleClick={modalData?.handleSubmit}
                    />
                </div>
                <div className='closeIcon' onClick={()=>handleClose()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#2a2b2d" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
                </div>
            </div>
            
        </div>
    )
}
