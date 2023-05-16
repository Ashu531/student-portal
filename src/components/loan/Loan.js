import React, { useEffect, useState } from 'react';
import Header from '../../components/elementalComponents/header/Header'
import Button from '../elementalComponents/button/Button';
import backIcon from '../../assets/caret-right.svg';
import InputField from '../elementalComponents/inputField/InputField';
import StudentDetails from '../elementalComponents/studentDetails/StudentDetails';
import { getToken } from '../../services/authService';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import LoanSuccess from '../elementalComponents/loan-success/LoanSuccess';
import Select from 'react-select';

const relations = [
    { value: 'Father', label: 'Father' },
    { value: 'Mother', label: 'Mother' },
    { value: 'Brother', label: 'Brother' },
    { value: 'Sister', label: 'Sister' },
  ];

export default function Loan() {

    const [student, setStudent] = useState({});
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [mobileNumber,setMobileNumber] = useState('')
    const [relation,setRelation] = useState('')
    const [totalAmount,setTotalAmount] = useState(0)
    const navigate = useNavigate();
    const [loanSuccess,setLoanSuccess] = useState(false);
    const [loader, setLoader] = useState(false);
    const [loanData,setLoanData] = useState({})

    const getData = async () => {
        const data = await axios.get(`${API_URL}/api/kid/v1/installments/${getToken()}/`)
        .then(res => res.data)
        .catch(error => error.response.data);

        return data;
    }

    const handleSubmit=async()=>{
        console.log(name,email,relation)
        if(name.length > 4 && email.length > 8 && relation.length > 4){
            let response = await axios.post(`${API_URL}/api/kid/v1/loan/${getToken()}/`, {
                'name': name,
                'email': email,
                'phone_number': mobileNumber,
                'relation': relation,
                'amount': String(totalAmount)
               }).then(res => {
                if(res.data.status){
                    setLoanSuccess(true)
                    setLoanData(res.data.data)
                }
               })
                .catch(err => err.response.data);
        }
       
    }

    useEffect(async () => {
        setLoader(true);
        const data = await getData();
        setStudent(data.student);
        let amount = 0;
        data.data.forEach((installment,index)=>{
                amount += parseFloat(installment['amount']) + parseFloat(installment['penalty']);
        })
        setTotalAmount(amount);
        setLoader(false);
    }, [])

    const handleName=(e)=>{
        setName(e)
    }

    const handleEmail=(e)=>{
        setEmail(e)
    }

    const handleMobileNumber=(e)=>{
        setMobileNumber(e)
    }

    const handleRelation=(e)=>{
         setRelation(e.value)
    }

    return (
        <>
        {
            loanSuccess ? 
            <LoanSuccess loanData={loanData} />
            :
        <>
        <Header
             title="Pay With Credenc"
           />
        <div className='loan'>
               <StudentDetails 
                    name={student.name}
                    id={student.prn}
                    grade={student.course}
                    school={student.college}
                />
               <div className='amount-container'>
                    <div className='amount-label'>
                        Total Amount
                    </div>
                    <div className='amount'>
                        ₹ {totalAmount}
                    </div>
               </div>
               
               <div className="loan-application">
                   <div>
                       <h2 className="loan-application-heading">Loan Application</h2>
                   </div>
                    <form className='form'>
                        <div className='form-content'>
                            <div className="formDiv">
                                <label className="label">Application's Name</label>
                                <InputField handleChange={(e)=>handleName(e)} maxLength={30} />
                            </div>
                            <div className="formDiv">
                                <label className="label">Application's Email</label>
                                <InputField handleChange={(e)=>handleEmail(e)} />
                            </div>
                        </div>
                        <div className='form-content'>
                        <div className="formDiv">
                            <label className="label">Application's Phone Number</label>
                            <InputField handleChange={(e)=>handleMobileNumber(e)} maxLength={10} />
                        </div>
                        
                        <div className="formDiv" style={ window.innerWidth > 500 ? {marginTop: 0} : null }>
                        <label className="label">Relationship</label>
                        <Select
                            defaultValue={relation}
                            onChange={(e)=>handleRelation(e)}
                            options={relations}
                            styles={select}
                        />
                        </div>
                        </div>
                    </form>
               </div>
              <div className='button-container'>
                <Button 
                 text='Proceed' 
                 classes='button'
                 handleClick={()=>handleSubmit()}
                />
              </div>
            </div>
        
            </>
        }
        </>
    )
}

const select = {
    height: 54,
    width: '40%'
}



