import React, { useEffect, useState } from 'react';
import Header from '../../components/elementalComponents/header/Header'
import Button from '../elementalComponents/button/Button';
import backIcon from '../../assets/caret-right.svg';
import InputField from '../elementalComponents/inputField/InputField';
import StudentDetails from '../elementalComponents/studentDetails/StudentDetails';
import { getToken } from '../../services/authService';
import axios from 'axios';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import LoanSuccess from '../elementalComponents/loan-success/LoanSuccess';
import Select from 'react-select';
import Switch from "react-switch";

const relations = [
    { value: 'Self', label: 'Self' },
    { value: 'Father', label: 'Father' },
    { value: 'Mother', label: 'Mother' },
    { value: 'Brother', label: 'Brother' },
    { value: 'Sister', label: 'Sister' },
  ];

  const tenures = [
    { value: 3, label: '3 Months' },
    { value: 6, label: '6 Months' },
    { value: 9, label: '9 Months' },
    { value: 12, label: '12 Months' },
  ];

export default function Loan() {

    const [student, setStudent] = useState({});
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [mobileNumber,setMobileNumber] = useState('')
    const [relation,setRelation] = useState('')
    const [totalAmount,setTotalAmount] = useState('')
    const navigate = useNavigate();
    const [loanSuccess,setLoanSuccess] = useState(false);
    const [loader, setLoader] = useState(false);
    const [loanData,setLoanData] = useState({})
    const [tenure,setTenure] = useState(0)
    const [remark,setRemark] = useState('');
    const [applicantName,setApplicantName] = useState('')
    const [nameChecked,setNameChecked] = useState(false)

    const getData = async () => {
        const data = await axios.get(`${API_URL}/api/kid/v1/school/installments/${getToken()}/`)
        .then(res => res.data)
        .catch(error => error.response.data);

        return data;
    }

    const handleSubmit=async()=>{
        let data = {
            'name': name,
            'email': email,
            'phone_number': mobileNumber,
            'relation': relation,
            'amount': String(totalAmount),
            'remark': remark,
            'tenure': tenure,
            'course_name': student.course_id,
            'applicant_name': applicantName,
            'college': student.college_id
        }

        let emailStatus = validateEmail(email)

        let mobileStatus = validateNumber(mobileNumber)

        if(!emailStatus) alert('Please enter valid email')
        else if(!mobileStatus) alert('Please enter valid phone number')
        else{
            await axios.post(`${API_URL}/api/kid/v1/loan/${getToken()}/`, data).then(res => {
                if(res.data.status){
                    setLoanSuccess(true)
                    setLoanData(res.data.data)
                }
            }).catch(err => err.response.data);
        }

        
       
    }

    const validateEmail = (email) => {
        let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(email.match(mailformat)) return true
        else return false
    };

    const validateNumber=(number)=>{
        let numformat = /^[0-9]+$/;
        if(number.match(numformat)) return true
        else return false
    }

    useEffect(async () => {
        setLoader(true);
        const data = await getData();

        if(data.status_code === 401){
            navigate('/login')
        }else{
            setStudent(data.student);
        }
        
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

    const handleTenure=(e)=>{
        setTenure(e.value)
    }

    const handleRemark=(e)=>{
        setRemark(e)
    }

    const handleBorrowerName=(e)=>{
        setApplicantName(e)
    }

    const handleBorrowerToggle=()=>{
        let tempCheck = nameChecked 
        setNameChecked(!nameChecked);
        console.log(tempCheck,name)
        if(!tempCheck){
            setApplicantName(name)
        }else{
            setApplicantName('')
        }
    }

    useEffect(()=>{
        if(nameChecked){
            handleBorrowerName(name)
            // setApplicantName(name)
        }else{
            setApplicantName(applicantName)
        }
    },[nameChecked])

    return (
        <>
        {
            loanSuccess ? 
            <LoanSuccess loanData={loanData} />
            :
        <>
        <Header
             title="Pay With Credenc"
             icon={student.logo}
           />
        <div className='loan'>
            <div style={window.innerWidth > 500 ? {minHeight: '12rem',width: '100%',display:'flex',justifyContent:'center',alignItems:'center'} : {minHeight: '15rem',width:'100%'}}>
                <StudentDetails 
                        name={student.name}
                        id={student.prn}
                        grade={student.course}
                        school={student.college}
                />
            </div>
               
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
                                <div className='toggle-content'>
                                    <label className="label" style={{marginBottom: 0}}>Applicant's Name</label>
                                    <div className='toggle-content'>
                                        <Switch onChange={()=>handleBorrowerToggle()} checked={nameChecked} height={18} width={36} />
                                        <p style={{marginLeft: 5,fontSize: 11}}>Name same as borrower</p>
                                    </div>
                                </div>
                                <InputField handleChange={(e)=>handleName(e)} maxLength={30} />
                            </div>
                            <div className="formDiv">
                                <label className="label">Applicant's Email</label>
                                <InputField handleChange={(e)=>handleEmail(e)} />
                            </div>
                        </div>
                        <div className='form-content'>
                            <div className="formDiv">
                                <label className="label">Borrower Name</label>
                                <InputField handleChange={(e)=>handleBorrowerName(e)} maxLength={30} value={applicantName} disabled={nameChecked} />
                            </div>
                            <div className="formDiv">
                                <label className="label">School/Institute Name</label>
                                <InputField value={student.college} disabled={true} />
                            </div>
                        </div>
                        <div className='form-content'>
                            <div className="formDiv">
                                <label className="label">Applicant's Phone Number</label>
                                <InputField handleChange={(e)=>handleMobileNumber(e)} maxLength={10} inputType="tel" />
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
                        <div className='form-content'>
                            <div className="formDiv" style={ window.innerWidth > 500 ? {marginTop: 0} : null }>
                                <label className="label">Tenure</label>
                                <Select
                                    defaultValue={tenure}
                                    onChange={(e)=>handleTenure(e)}
                                    options={tenures}
                                    styles={select}
                                />
                            </div>
                            <div className="formDiv">
                                <label className="label">Course Fee</label>
                                <InputField value={totalAmount} disabled={true} />
                            </div>
                        </div>
                        <div className='form-content'>
                        <div className="formDiv">
                                <label className="label">Course</label>
                                <InputField value={student.course} disabled={true}/>
                            </div>
                            <div className="formDiv">
                                <label className="label">Remark</label>
                                <InputField handleChange={(e)=>handleRemark(e)} />
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



