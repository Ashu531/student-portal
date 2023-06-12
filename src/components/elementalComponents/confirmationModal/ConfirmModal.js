import React, { useEffect } from 'react';
import Button from '../button/Button';

export default function ConfirmationModal({ data, handleClose, handleSubmit, buttonText }) {
console.log(data)
    return (
        <div className='modal'>
            <div className='modal-content'>
                <div>
                </div> 
                
                <div className='button-container'>
                    <Button 
                        text={buttonText} 
                        classes='button-small button-primary' 
                        handleClick={handleSubmit}
                    />
                </div>
            </div>
        </div>
    )
}
