import React, { useEffect, useState } from 'react';
import Header from '../../components/elementalComponents/header/Header'
import Button from '../elementalComponents/button/Button';
import backIcon from '../../assets/caret-right.svg';
import axios from 'axios';
import { getToken } from '../../services/authService';
import StudentDetails from '../elementalComponents/studentDetails/StudentDetails';

export default function Autopay() {

    const [student, setStudent] = useState({});

    const [loader, setLoader] = useState(false);

    const getData = async () => {
        const data = await axios.get(`${API_URL}/api/kid/v1/installments/${getToken()}/`)
        .then(res => res.data)
        .catch(error => error.response.data);

        return data;
    }

    useEffect(async () => {
        setLoader(true);
        const data = await getData();
        setStudent(data.student);
        setLoader(false);
    }, [])

    return (
        <>
        <Header
             title="Auto-Pay"
           />
        <div className='autopay'>
           <StudentDetails 
                name={student.name}
                id={student.id}
                grade={student.course}
                school={student.college}
            />
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
                    <ol style={{padding: '0 0 0 2rem'}}>
                        <li className='benefit-text'><b>Convenience:</b> Setting up auto-pay means you don't have to worry about meeting deadlines for fees payments.</li>
                        <li className='benefit-text'><b>Avoiding Late Fees:</b> You can ensure that your school fees are paid on time, which helps you avoid late fees.</li>
                        <li className='benefit-text'><b>Secure and Consistent:</b> It is ensured that your payments are consistently paid each instalment, securely.</li>
                        <li className='benefit-text'><b>Customisation:</b> You can change, modify or cancel your payments as and when required. </li>
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
        </>
    )
}



