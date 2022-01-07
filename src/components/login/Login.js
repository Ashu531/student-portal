import React, { useState, useEffect } from 'react';
import logo from '../../assets/credenc-logo-big.png';
import Button from '../elementalComponents/button/Button';
import InputField from '../elementalComponents/inputField/InputField';
import OtpField from '../elementalComponents/otpField/OtpField';

export default function Login() {

    const [inputValue, setInputValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [otp, setOtp] = useState({
        generated: false,
        value: '',
        values: ['', '', '', '', '', '']
    });

    const getOtpFromState = () => {
        return otp.values.join('');
    }

    const validateOtp = (value) => {
        return value === otp.value;
    }

    const handleOtp = (val, i) => {
        let values = [...otp.values];
        values[i] = val;
        setOtp({...otp, values: values});
    }

    const handleGenerateOtpButton = () => {
        if(isValid)
            setOtp({...otp, generated: true, value: '123456'});
    }

    const handleResendOtpButton = () => {
        setOtp({...otp, value: '654321'})
    }

    const handleProceedButton = () => {
        const isOtpValid = validateOtp(getOtpFromState());
        if(isOtpValid)
            console.log('congrats');
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

    return (
        <div className='login'>
            <img src={logo} className='logo'/>
            {!otp.generated && <div className='container'>
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
            </div>}

            {otp.generated && <div className='container'>
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
                        handleClick={handleResendOtpButton}
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
            </div>}
        </div>
    )
}
