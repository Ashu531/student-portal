import React, { useEffect, useState } from 'react';
import Header from '../../components/elementalComponents/header/Header'
import Button from '../elementalComponents/button/Button';
import backIcon from '../../assets/caret-right.svg';
import StudentDetails from '../elementalComponents/studentDetails/StudentDetails';
import { getToken } from '../../services/authService';
import axios from 'axios';

export default function Loan() {

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
             title="Pay With Credenc"
           />
        <div className='loan'>
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
           
           <div className="loan-application">
               <div>
                   <h2 className="loan-application-heading">Loan Application</h2>
               </div>
                <form>
                    <div className="formDiv">
                    <label className="label">Application's Name</label>
                    <input className="input" type="text"></input>
                    </div>
                    <div className="formDiv">
                    <label className="label">Application's Email</label>
                    <input className="input" type="email"></input>
                    </div>
                    <div className="formDiv">
                    <label className="label">Application's Phone Number</label>
                    <input className="input" type="number"></input></div>
                    <div className="formDiv">
                    <label className="label">Relationship with Student</label>
                    <select className="input" type="select"></select></div>
                </form>
           </div>
          
            <Button 
             text='Proceed' 
             classes='button'
            />
           
        </div>
        </>
    )
}



