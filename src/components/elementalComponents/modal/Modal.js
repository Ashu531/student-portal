import React from 'react';
import Field from '../field/Field';
import profileIcon from '../../../assets/profile-icon.svg';
import mentionIcon from '../../../assets/mention-icon.svg';
import phoneIcon from '../../../assets/phone-icon.svg';
import Button from '../button/Button';

export default function Modal({ data, handleClose, handleSubmit }) {
    return (
        <div className='modal'>
            <div className='modal-content'>
                <div className='modal-header'>
                    <div>
                        <div className='title'>Confirm Student Details</div>
                        <div className='subtitle'>Confirm the details and proceed to pay</div>
                    </div>
                    <div className="close" onClick={handleClose}>&times;</div>
                </div>
                <div className='modal-body'>
                    <div style={{textTransform: 'capitalize'}}>
                        <Field value={data.name} icon={profileIcon}/>
                    </div>
                    <Field value={data.email} icon={mentionIcon}/>
                    <Field value={data.phone} icon={phoneIcon}/>
                </div>
                <div className='button-container'>
                <div className='subtitle-2' style={{margin: '1rem 0'}}>Please note that, an additional covenience fee may apply</div>
                    <Button 
                        text={`Proceed and Pay INR ${data.amount}`} 
                        classes='small-wrapper button-small button-primary' 
                        handleClick={handleSubmit}
                    />
                </div>
            </div>
        </div>
    )
}
