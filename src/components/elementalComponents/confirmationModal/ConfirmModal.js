import React, { useEffect } from 'react';
import Button from '../button/Button';
import successIcon from '../../../assets/successIcon.svg'
import failureIcon from '../../../assets/failureIcon.svg'

export default function ConfirmationModal({ 
    handleClose, 
    handleSubmit, 
    modalData, 
}) 
{
console.log(modalData)
    return (
        <div className='confirm-modal'>
            <div className='confirm-modal-content'>
                <div className='modal-container'>
                    <img src={modalData?.successImage ? successIcon : failureIcon} alt="status-icon" height={45} width={45} style={{objectFit:'contain'}}/>
                    <p className='heading'>{modalData?.title}</p>
                    <p className='sub-heading'>{modalData?.subHeading}</p>
                    <p className='sub-heading'>{modalData?.description}</p>
                </div> 
                
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
