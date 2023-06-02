import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import logo from '../../assets/credenc-logo.svg';
import Button from '../elementalComponents/button/Button';
import InputField from '../elementalComponents/inputField/InputField';
import OtpField from '../elementalComponents/otpField/OtpField';
import background from '../../assets/background.png';
import caret from '../../assets/caret-right.svg';
import axios from 'axios';
import { delay, getToken, saveStudents, saveToken } from '../../services/authService';
import { Bars, TailSpin } from 'react-loader-spinner';
import CheckBox from '../elementalComponents/checkBox/CheckBox';
import TcModal from '../elementalComponents/tandc/TcModal';
import InstituteForm from '../elementalComponents/instituteForm/InstituteForm';

export default function Login() {

    const navigate = useNavigate();

    const [students, setStudents] = useState([]);

    const [inputValue, setInputValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [otp, setOtp] = useState({
        generated: false,
        values: ['', '', '', '', '', '']
    });
    const [verified, setVerified] = useState(false);
    
    const [loader, setLoader] = useState(false);

    const [error, setError] = useState({
        number: null,
        otp: null,
    });

    const [tcModal, setTcModal] = useState({
        open: false,
        type: 'tc',
    })

    const [signUpState,setSignUpState] = useState(false)

    const openTandC = (type) => {
        setTcModal({...tcModal, open: true, type: type});
    }

    const getOtpFromState = () => {
        return otp.values.join('');
    }

    const areAllFilled = () => {
        return getOtpFromState().length === 6;
    }

    const validateOtp = async (value) => {
        if(value.length == 6){
            const otpVerified = await axios.post(`${API_URL}/api/kid/v1/verify_otp/`, JSON.stringify({
                'phone_number': inputValue,
                'otp': value,
            }), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => (res.data))
            .catch(err => {
                setError({...error, otp: err.response.data.message});
                setLoader(false)
            });

            return otpVerified;
        }
    }

    const handleOtp = (val, i) => {
        let values = [...otp.values];
        values[i] = val;
        if(values[values.length - 1] === ''){
            setError({...error,otp: ''})
        }
        setOtp({...otp, values: values});
    }

    const sendOtp = async () => {

        let params = window.location.pathname
        let urlSlug = params.substring(7,params.length)

        let data = {
            'phone_number': inputValue,
            'college_slug': urlSlug
        }

        Object.keys(data).forEach(
            key => (data[key] == null || data[key] == '') && delete data[key],
        );

        const otpGenerated = await axios.post(`${API_URL}/api/kid/v1/send_otp/`,data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => (res.data))
        .catch(err => {
            // console.log('res', {...err});
            setError({...error, number: err.response.data.message});
        });

        return otpGenerated ? otpGenerated.status: otpGenerated;
    }

    const resendOtp = async () => {
        let resendState = ['','','','','','']
        setOtp({...otp,values: resendState})
        const resent = await axios.post(`${API_URL}/api/kid/v1/resend_otp/`, JSON.stringify({phone_number: inputValue}), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => (res.data))
        .catch(err => console.log(err));

        return resent ? resent.status: resent;
    }

    const getStudents = async () => {
        const students = await axios.get(`${API_URL}/api/kid/v1/identify/${inputValue}/`)
        .then(res => (res.data.data))
        .catch(err => console.log(err));

        return students;
    }

    const handleGenerateOtpButton = async (resend=false) => {
        if(resend){
            const resend = await resendOtp();
        } else {
            setLoader(true);
            setError({error, number: null});
            if(isValid){
                const otpGenerated = await sendOtp();
                setOtp({...otp, generated: otpGenerated})
            }
            setLoader(false);
        }
    }

    const handleProceedButton = async () => {
        setLoader(true);
        setError({error, number: null});
        await delay(5000);
        const isOtpValid = await validateOtp(getOtpFromState());
        if(isOtpValid.signup === false){
            if(isOtpValid.status){
                handleApplicationData()
            }
        }else{
            if(isOtpValid.status){
                setSignUpState(true)
            }
        }
        setLoader(false);
    }

    const handleApplicationData=async()=>{
        const studentList = await getStudents();
        if(studentList){
            saveStudents(studentList);
            setStudents(studentList);
            setVerified(true);
        }
    }

    const getLastFourDigits = () => {
        return inputValue % 10000;
    }

    const handleInputChange = (value) => {
        let isnum = /^\d+$/.test(value);
        if(value.length < 10){
            setInputValue(value);
            setIsValid(false);
            setError({...error,number: ''})
        }
        
        if(value.length == 10){
            setInputValue(value);
            if(!isnum)
                setIsValid(false);
            else
                setIsValid(true);
        }
            
    }

    const navigateToInstallmentPage = (i) => {
        navigate(`/installments/${students[i].token}`, {replace: true});
    }

    useEffect(() => {
        const token = getToken();
        if(token && token !== ''){
            navigate(`/installments/${token}`, {replace: true});
        }
    }, [error]);

    const handleFormSubmit=(details)=>{

        let data = {
            name: '',
            email: '',
            phone_number : '',
            parent_name : '',
            parent_number :  '',
            prn : '',
            college_slug : '',
            batch_id: ''
        };

     

            details && details.forEach((item,index)=>{
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
                    data.prn = item.value
                }
                else if(item.label === 'Batch'){
                    data.batch_id = item.id
                }
            })

            let params = window.location.pathname
            let urlSlug = params.substring(7,params.length)

            if(urlSlug?.length > 0){
                data.college_slug = urlSlug
            }

            Object.keys(data).forEach(
                key => (data[key] == null || data[key] == '') && delete data[key],
            );

            submitSignupData(data)
            
        }

    const submitSignupData=async(data)=>{
        const response = await axios.post(`${API_URL}/api/kid/v1/signup/`,data)
        .then(res => {
            try{
                    if(res.data.signup === false){
                        setSignUpState(false)
                        handleApplicationData()
                    }
            }catch(err) {
                console.log(err,'error')
            }
            
        })
        .catch(err => {
            alert(err.response.data.error)
        });

    }

    return (
        <div className='login'>
            <img src={logo} className='logo'/>
            {!verified && !otp.generated &&
            <div className='container'>
                <div className='header-container'>
                    <img src={logo} className='logo-small'/>
                </div>
                <div style={{width: '100%'}}>
                    <div className='header'>Login</div>
                    <div className='subline' style={{marginBottom: '3rem'}}>Let's pay your fees</div>
                
                    <InputField 
                        placeholder={'Enter registered Phone Number'} 
                        validate={true}
                        validity={isValid}
                        inputType="tel"
                        handleChange={handleInputChange}
                        error={error.number}
                        maxLength={10}
                    />
                </div>
                <div className='bottom-container'>
                    <p>
                        <span onClick={() => openTandC('tc')}>
                            &nbsp;Terms and Conditions&nbsp; 
                        </span>
                            and
                        <span onClick={() => openTandC('pp')}>
                            &nbsp;Privacy Policy&nbsp;
                        </span>
                    </p>
                    <div className='message'>An OTP will be sent to the above number</div>
                    <div className={isValid ? 'small-wrapper': ''} style={{margin: '1.2rem 0 0'}}>
                        {!loader && <Button 
                            text='Generate OTP' 
                            handleClick={handleGenerateOtpButton}
                            classes={`button-big button-primary ${isValid? '': 'disabled'}`}
                        />}
                        {loader && 
                            <div className="credenc-loader">
                                <TailSpin color="rgba(255, 255, 255, 0.7)" height={28} width={100}/>
                            </div>
                        }
                    </div>
                </div>
            </div>}

            {!verified && otp.generated && !signUpState &&
                <div className='wrapper container'>
                <div className='header-container'>
                    <img src={logo} className='logo-small'/>
                </div>
                <div className='mid-container'>
                    <div className='header'>Verify OTP</div>
                    <div className='subline'>Please check message on xxxxxx{getLastFourDigits()}</div>
                    <div className='label'>OTP</div>
                    <OtpField 
                        handleChange={(val, i) => handleOtp(val, i)} 
                        otp={otp} 
                        error={error.otp}
                    />
                </div> 
                <div className='bottom-container'>
                    <div className='resend-otp-container'>
                        <div className='message-left'>Didn't receive an OTP?</div>
                        <div className='small-wrapper' style={{margin: '0.8rem 0'}}>
                            <Button 
                                text={"Resend OTP"} 
                                handleClick={() => handleGenerateOtpButton(true)}
                                counterValue={20}
                                counterText={"Resend in"}
                                classes='button-big button-secondary'
                            />
                        </div>
                    </div>
                    <div className={areAllFilled() ? `small-wrapper`: ''} style={{margin: '1.2rem 0 0'}}>
                    {!loader && <Button 
                        text='Proceed'
                        handleClick={handleProceedButton}
                        classes={`${areAllFilled() ? '' : 'disabled'} button-big button-primary`}
                    />}
                    {loader && 
                        <div className="credenc-loader">
                            <TailSpin color="rgba(255, 255, 255, 0.7)" height={28} width={100}/>
                        </div>
                    }
                    </div>
                </div>
            </div>}
            {
                signUpState &&
                <div style={{width: '100%'}}>
                    <InstituteForm 
                        title="Institute Information"
                        description='Enter information, as applicable!'
                        onlySignUp={true}
                        handleFormSubmit={(details)=>handleFormSubmit(details)}
                        mobileNumber={inputValue}
                    />
                </div>
            }
            
            {verified && <div className='wrapper container'>
                <div className='header-container'>
                    <img src={logo} className='logo-small'/>
                </div>
                <div style={{width: '100%'}}>
                    <div className='header'>Select Student</div>
                    <div className='students-container'>
                        {
                            students.map((student, i) => (
                                <div className='student-card' key={i} onClick={() => navigateToInstallmentPage(i)}>
                                    <div className='text-container'>
                                        <div className='name'>{student.name}</div>
                                        <div className='id'>{student.id}</div>
                                    </div>
                                    <img src={caret} className='icon'/>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div></div>
            </div>}

            {tcModal.open && 
                <TcModal 
                    type={tcModal.type}
                    handleClose={() => setTcModal({...tcModal, open:false})}
                />
            }
        </div>
    )
}
