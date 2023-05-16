import React, { useEffect } from 'react';
import Field from '../field/Field';
import profileIcon from '../../../assets/profile-icon.svg';
import mentionIcon from '../../../assets/mention-icon.svg';
import phoneIcon from '../../../assets/phone-icon.svg';
import Button from '../button/Button';
import StudentDetails from '../studentDetails/StudentDetails';

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
                <div className="student-details">
                    <div className="row">
                        <div className="field">Student</div>
                        <div className="value">{data.student.name}</div>
                    </div>
                    <div className="row">
                        <div className="field">Email</div>
                        <div className="value">{data.student.email}</div>
                    </div>
                    <div className="row">
                        <div className="field">Mobile No.</div>
                        <div className="value">{data.student.phone}</div>
                    </div>
                    <div className="row">
                        <div className="field">Amount</div>
                        <div className="value">{data.amount}</div>
                    </div>
                </div>
                <div className='button-container'>
                    <div className='subtitle-2' style={{margin: '1rem 0'}}>Please note that, an additional convenience fee may apply</div>
                    <Button 
                        text={`Proceed and Pay INR ${data.amount}`} 
                        classes='button-small button-primary' 
                        handleClick={handleSubmit}
                    />
                </div>
            </div>
        </div>
    )
}
