import React, { useEffect } from 'react';
import Button from '../button/Button';
import successIcon from '../../../assets/successIcon.svg'
import failureIcon from '../../../assets/failureIcon.svg'
import StudentDetails from '../studentDetails/StudentDetails';

export default function ConfirmationModal({ 
    handleClose, 
    handleSubmit, 
    modalData, 
    autoPay,
    student
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
                    autoPay && 
                    <StudentDetails 
                        name={student.name}
                        id={student.prn}
                        grade={student.course}
                        school={student.college}
                    />
                }
                        
                
                <div className='button-container'>
                    <Button 
                        text={modalData?.buttonText} 
                        classes='button-small button-primary' 
                        handleClick={modalData?.handleSubmit}
                    />
                </div>
            </div>
        </div>
    )
}
