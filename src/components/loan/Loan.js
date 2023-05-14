import React, { useEffect, useState } from 'react';
import Header from '../../components/elementalComponents/header/Header'
import Button from '../elementalComponents/button/Button';
import backIcon from '../../assets/caret-right.svg';
import InputField from '../elementalComponents/inputField/InputField';

export default function Loan() {

    return (
        <div className='loan'>
           <Header
             title="Pay With Credenc"
           />
           <div className='student-content'>
                <div className='student-container'>
                    <div className='student-label'>Student Name</div>
                    <div className='student-name'>Nandini Mediratta</div>
                </div>
                <div className='student-container'>
                    <div className='student-label'>Admission No.</div>
                    <div className='student-detail'>ABC1234</div>
                </div>
                <div className='student-container'>
                    <div className='student-label'>Grade</div>
                    <div className='student-detail'>5-A</div>
                </div>
                <div className='student-container'>
                    <div className='student-label'>School</div>
                    <div className='student-detail'>Shikshantar Sr. Sec. School</div>
                </div>
           </div>
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
                    <InputField />
                    </div>
                    <div className="formDiv">
                    <label className="label">Application's Email</label>
                    <InputField />
                    </div>
                    <div className="formDiv">
                    <label className="label">Application's Phone Number</label>
                    </div>
                    <InputField />
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
    )
}



