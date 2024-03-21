import React, { useEffect, useState } from 'react';
import InstituteForm from '../elementalComponents/instituteForm/InstituteForm';
import InputField from '../elementalComponents/inputField/InputField';
import Switch from "react-switch";
import Select from 'react-select';
import Button from '../elementalComponents/button/Button';
import backIcon from '../../assets/caret-right.svg';
import LoanSuccess from '../elementalComponents/loan-success/LoanSuccess';
import { apiRequest } from '../../services/apiRequest';

const tenures = [
    { value: 3, label: '3 Months' },
    { value: 6, label: '6 Months' },
    { value: 9, label: '9 Months' },
    { value: 12, label: '12 Months' },
  ];

export default function Signup() {
    const [applyForLoan,setApplyForLoan] = useState(false)
    const [linkExpired, setLinkExpired] = useState(false);
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
    const [totalAmount,setTotalAmount] = useState({
        amount: '',
        min_amount: '',
        max_amount: ''
    })

    const openApplyForLoan=(data,collegeData,adhocData,amount)=>{
        setApplyForLoan(true);
        setCollegeInfo(collegeData)
        setAdhocData(adhocData)
        settleFields(data)
        setTotalAmount(amount)
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
        if(!tempCheck){
            setApplicantName(name)
        }else{
            setApplicantName('')
        }
    }

    const handleName=(e)=>{
        setName(e)
        if(nameChecked){
            setApplicantName(e)
        }
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
            batch: '',
            amount:'',
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

            data['amount'] = totalAmount.amount

        let applicantData = {
                "student_name" : name,
                "phone_number" : mobileNumber,
                "email" : email,
                "tenure" : tenure,
                "remark" : remark,
                "college" : collegeInfo.college_id,
                "name" : applicantName,
        }

        let emailStatus = validateEmail(email)

        let mobileStatus = validateNumber(mobileNumber)

        if(!emailStatus) alert('Please enter valid email')
        else if(!mobileStatus) alert('Please enter valid phone number')
        else {
            Object.keys(applicantData).forEach(
                key => (applicantData[key] == null || applicantData[key] == '') && delete applicantData[key],
            );
    
            data['applicant'] = applicantData;
            submitData(data)
        }
    }

    const submitData=async(data)=>{
        
        await apiRequest({
            url: `/api/kid/v1/adhoc/loan/`,
            method: 'POST',
            data: data,
            onSuccess: async (data) => {
                if(data['status'] === true){
                    setLoanData(data.data)
                    setLoanSuccess(true)
                }
            },
            onError: (response) => {
                alert(response.data.error)
            }
        })
    }

    const goBack=()=>{
        closeApplyForLoan()
    }

    const validateEmail = (email) => {
        let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(email.match(mailformat)) return true
        else return false
    };

    const validateNumber=(number)=>{
        let numformat = /^[0-9]+$/;
        if(number.length != 10) return false
        else if(number.match(numformat)) return true
        else return false
    }

    useEffect(()=>{
        if(nameChecked){
            handleBorrowerName(name)
        }else{
            setApplicantName(applicantName)
        }
    },[nameChecked])

    const handleLinkExpired=()=>{
        setLinkExpired(true)
    }

    return (
        <div className='signup'>

        {
              loanSuccess ? <LoanSuccess loanData={loanData} adhocLoan={true} /> :
              <div className={`loan-application`} style={applyForLoan ? {padding: '0px 24px',display:'flex',width:'100%'} : {padding: '0px 24px',display:'none'}}>
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
                                        <Switch onChange={()=>handleBorrowerToggle()} checked={nameChecked} height={18} width={36}/>
                                        <p style={{marginLeft: 5,fontSize: 11}}>Name same as borrower</p>
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
                                <InputField handleChange={(e)=>handleBorrowerName(e)} value={applicantName} maxLength={30} disabled={nameChecked} />
                            </div>
                            <div className="formDiv">
                                <label className="label">School/Institute Name</label>
                                <InputField value={collegeInfo.name} disabled={true} />
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
                                <InputField value={totalAmount?.amount}/>
                            </div>
                        </div>
                        <div className='form-content'>
                            <div className="formDiv">
                                <label className="label">Applicant's Phone Number</label>
                                <InputField handleChange={(e)=>handleMobileNumber(e)} inputType="tel" maxLength={10} />
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
              </div>
            }
            <div style={applyForLoan ? {display: 'none'} : {display:'block',width:'100%'}}>
                <InstituteForm
                    title="Institute Information"
                    // description='Enter information, as applicable!'
                    onlySignUp={false}
                    openApplyForLoan={(data,collegeData,adhocData,amount)=>openApplyForLoan(data,collegeData,adhocData,amount)}
                    closeApplyForLoan={()=>closeApplyForLoan()}
                    fieldData={instituteDetails}
                    handleLinkExpired={()=>handleLinkExpired()}
                />
            </div>
                
            {
                linkExpired &&
                <div className='under-construction-container'>
                <div className='under-construction-overlay'></div>
                    <div className='under-construction-content'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ff0000" viewBox="0 0 256 256"><path d="M128,28A100,100,0,1,0,228,128,100.11,100.11,0,0,0,128,28Zm92,100a91.67,91.67,0,0,1-24.21,62.13L65.87,60.21A92,92,0,0,1,220,128ZM36,128A91.67,91.67,0,0,1,60.21,65.87L190.13,195.79A92,92,0,0,1,36,128Z"></path></svg>
                    <div className=''>This Link is Already Expired</div>
                    </div>
                </div>
            }
        </div>
    )
}

const select = {
    height: 54,
    width: '40%'
}



