import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import logo from '../../assets/credenc-logo-big.png';
import Button from '../elementalComponents/button/Button';
import InputField from '../elementalComponents/inputField/InputField';
import OtpField from '../elementalComponents/otpField/OtpField';
import background from '../../assets/background.png';
import caret from '../../assets/caret-right.svg';
import axios from 'axios';

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

    const getOtpFromState = () => {
        return otp.values.join('');
    }

    const validateOtp = async (value) => {
        if(value.length == 6){
            const otpVerified = await axios.post(`${API_URL}/api/kid/v1/verify_otp/`, JSON.stringify({otp: value}), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => (res.data.status))
            .catch(error => error.response.data.status);

            return otpVerified;
        }
    }

    const handleOtp = (val, i) => {
        let values = [...otp.values];
        values[i] = val;
        setOtp({...otp, values: values});
    }

    const sendOtp = async () => {
        const otpGenerated = await axios.post(`${API_URL}/api/kid/v1/send_otp/`, JSON.stringify({phone_number: inputValue}), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => (res.data));

        return otpGenerated.status;
    }

    const getStudents = async () => {
        const students = await axios.get(`${API_URL}/api/kid/v1/identify/${inputValue}/`)
        .then(res => (res.data.data));

        return students;
    }

    const handleGenerateOtpButton = async () => {
        if(isValid){
            const otpGenerated = await sendOtp();

            setOtp({...otp, generated: otpGenerated})
        }
    }

    const handleProceedButton = async () => {
        const isOtpValid = await validateOtp(getOtpFromState());
        if(isOtpValid){
            const studentList = await getStudents();
            if(studentList){
                console.log(studentList);
                setStudents(studentList);
                setVerified(true);
            }
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
        navigate(`/home/${inputValue}/${students[i].id}`);
    }

    return (
        <div className='login' style={{backgroundImage: `url(${background})`}}>
            <img src={logo} className='logo'/>
            {!verified && !otp.generated && <div className='wrapper'>
            <div className='container'>
                <div className='header-container'>
                    <div className='header'>Login</div>
                    <div className='subline'>Let's pay your college fee</div>
                </div>
                <InputField 
                    placeholder={'Enter registered Phone Number'} 
                    validate={true}
                    validity={isValid}
                    handleChange={handleInputChange}
                />
                <div className='bottom-container'>
                    <div className='message'>An OTP will be sent to the above number</div>
                    <Button 
                        text='Generate OTP' 
                        handleClick={handleGenerateOtpButton}
                    />
                </div>
                </div>
            </div>}

            {!verified && otp.generated && <div className='wrapper'>
                <div className='container'>
                <div className='header-container'>
                    <div className='header'>Verify OTP</div>
                    <div className='subline'>Please check message on xxxxxx{getLastFourDigits()}</div>
                </div>
                <div className='mid-container'>
                    <div className='label'>OTP</div>
                    <OtpField handleChange={(val, i) => handleOtp(val, i)} otp={otp}/>
                </div> 
                <div className='bottom-container'>
                    <div className='message-left'>Didn't receive an OTP?</div>
                    <Button 
                        text={"Resend OTP"} 
                        handleClick={handleGenerateOtpButton}
                        background='rgba(255, 255, 255, 0.15)'
                        margin='0.6rem 0'
                        counterValue={5}
                        counterText={"Resend OTP in"}
                    />
                    <Button 
                        text='Proceed'
                        handleClick={handleProceedButton}
                        margin='0.6rem 0 1.2rem'
                    />
                </div>
                </div>
            </div>}
            {verified && <div className='wrapper'>
                <div className='container'>
                    <div className='header-container'>
                        <div className='header'>Select Student</div>
                        {/* <div className='subline'>Please check message on xxxxxx{getLastFourDigits()}</div> */}
                    </div>
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
                    <div></div>
                </div>
            </div>}
        </div>
    )
}
