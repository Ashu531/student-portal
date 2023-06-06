import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import InstituteForm from '../elementalComponents/instituteForm/InstituteForm';
import InputField from '../elementalComponents/inputField/InputField';
import Switch from "react-switch";
import Select from 'react-select';
import Button from '../elementalComponents/button/Button';
import backIcon from '../../assets/caret-right.svg';
import LoanSuccess from '../elementalComponents/loan-success/LoanSuccess';

const tenures = [
    { value: 3, label: '3 Months' },
    { value: 6, label: '6 Months' },
    { value: 9, label: '9 Months' },
    { value: 12, label: '12 Months' },
  ];

export default function Signup() {
    const [applyForLoan,setApplyForLoan] = useState(false)
    const [collegeInfo,setCollegeInfo] = useState({})
    const [tenure,setTenure] = useState(0)
    const [remark,setRemark] = useState('');
    const [applicantName,setApplicantName] = useState('')
    const [nameChecked,setNameChecked] = useState(false)
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [mobileNumber,setMobileNumber] = useState('')
    const [adhocData,setAdhocData] = useState({})
    const [instituteDetails,setInstituteDetails] = useState([]);
    const [loanData,setLoanData] = useState({})
    const [loanSuccess,setLoanSuccess] =useState(false)

    const openApplyForLoan=(data,collegeData,adhocData)=>{
        setApplyForLoan(true);
        setCollegeInfo(collegeData)
        setAdhocData(adhocData)
        settleFields(data)
    }

    const settleFields=(data)=>{

        setInstituteDetails(data)

        data && data.forEach((item,index)=>{
                if(item.label === 'Name'){
                    setName(item.value)
                }
        })
    }

    const closeApplyForLoan=()=>{
        setApplyForLoan(false);
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

    const handleName=(e)=>{
        setName(e)
    }

    const handleEmail=(e)=>{
        setEmail(e)
    }

    const handleMobileNumber=(e)=>{
        setMobileNumber(e)
    }

    const handleSubmit=()=>{

        let data = {
            name: '',
            email: '',
            phone_number : '',
            parent_name : '',
            parent_number :  '',
            uid : '',
            slug : '',
            batch: ''
        }; 

            instituteDetails && instituteDetails.forEach((item,index)=>{
                if(item.label === 'Name'){
                    data.name = item.value
                }else if(item.label === 'Phone Number'){
                    data.phone_number = item.value
                }else if(item.label === 'Email'){
                    data.email = item.value
                }else if(item.label === 'Parent Name'){
                    data.parent_name = item.value
                }
                else if(item.label === 'Parent Number'){
                    data.parent_number = item.value
                }
                else if(item.label === 'Enrollment Number'){
                    data.uid = item.value
                }
                else if(item.label === 'Batch'){
                    data.batch = item.id
                }else{
                    data[`${item.label}`] = item.value
                }
            })

            let params = window.location.pathname
            let url = params.substring(7,params.length)
            if(url?.length > 0){
                data.slug = url;
            }

            Object.keys(data).forEach(
                key => (data[key] == null || data[key] == '') && delete data[key],
            );

        let applicantData = {

                "student_name" : name,
                "phone_number" : mobileNumber,
                "email" : email,
                "tenure" : tenure,
                "remark" : remark,
                "college" : collegeInfo.id,
                "name" : applicantName,
                "amount": adhocData.amount

        }

        Object.keys(applicantData).forEach(
            key => (applicantData[key] == null || applicantData[key] == '') && delete applicantData[key],
        );

        data['applicant'] = applicantData;
        submitData(data)
        
    }

    const submitData=async(data)=>{
        let response = await axios.post(`${API_URL}/api/kid/v1/adhoc/loan/`, data).then(res => {
            if(res.data.status){
               setLoanData(res.data.data)
               setLoanSuccess(true)
            }
           })
        .catch(err => err.response.data);
    }

    const goBack=()=>{
        closeApplyForLoan()
    }

    return (
        <div className='signup'>

          {
              applyForLoan ? 
              loanSuccess ? <LoanSuccess loanData={loanData} /> :
              <div className="loan-application" style={{padding: '0px 24px'}}>
                   <div className='adhoc-header'>
                        <div className='backIcon' onClick={()=>goBack()}>
                            <img src={backIcon} alt="backIcon" height={20} width={20}/>
                         </div>
                       <h2 className="loan-application-heading">Loan Application</h2>
                   </div>
                    <form className='form'>
                        <div className='form-content'>
                            <div className="formDiv">
                            <div className='toggle-content'>
                                    <label className="label">Applicant's Name</label>
                                    <div className='toggle-content'>
                                        <Switch onChange={()=>handleBorrowerToggle()} checked={nameChecked} />
                                        <p style={{marginLeft: 5,fontSize: 12}}>Name same as borrower</p>
                                    </div>
                                </div>
                                <InputField handleChange={(e)=>handleName(e)} maxLength={30} value={name} />
                            </div>
                            <div className="formDiv">
                                <label className="label">Applicant's Email</label>
                                <InputField handleChange={(e)=>handleEmail(e)} />
                            </div>
                        </div>
                        <div className='form-content'>
                            <div className="formDiv">
                                <label className="label">Borrower Name</label>
                                <InputField handleChange={(e)=>handleBorrowerName(e)} value={applicantName} maxLength={30} />
                            </div>
                            <div className="formDiv">
                                <label className="label">School/Institute Name</label>
                                <InputField value={collegeInfo.name} disabled={true} />
                            </div>
                        </div>
                        <div className='form-content'>
                            <div className="formDiv">
                                <label className="label">Applicant's Phone Number</label>
                                <InputField handleChange={(e)=>handleMobileNumber(e)} maxLength={10} />
                            </div>
                            <div className="formDiv">
                                <label className="label">Course Fee</label>
                                <InputField value={adhocData?.amount}/>
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
                                <label className="label">Remark</label>
                                <InputField handleChange={(e)=>handleRemark(e)} />
                            </div>
                        </div>
                    </form>
                    <div className='button-container'>
                        <Button 
                        text='Submit' 
                        classes='button'
                        handleClick={()=>handleSubmit()}
                        />
                    </div>
              </div> :
              <InstituteForm
                title="Institute Information"
                description='Enter information, as applicable!'
                onlySignUp={false}
                openApplyForLoan={(data,collegeData,adhocData)=>openApplyForLoan(data,collegeData,adhocData)}
                closeApplyForLoan={()=>closeApplyForLoan()}
             />
          }
        </div>
    )
}

const select = {
    height: 54,
    width: '40%'
}



