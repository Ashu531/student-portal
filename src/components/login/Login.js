import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import logo from '../../assets/credenc-logo.svg';
import Button from '../elementalComponents/button/Button';
import InputField from '../elementalComponents/inputField/InputField';
import OtpField from '../elementalComponents/otpField/OtpField';
import { TailSpin } from 'react-loader-spinner';
import { getToken, saveToken } from '../../services/authService';
import { apiRequest } from '../../services/apiRequest';

export default function Login() {
    const navigate = useNavigate();

    const [inputValue, setInputValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [otp, setOtp] = useState({ generated: false, values: ['', '', '', '', '', ''] });
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState({ number: null, otp: null });
    const [userInfo,setUserInfo] = useState({})

    const getOtpFromState = () => otp.values.join('');
    const areAllFilled = () => getOtpFromState().length === 6;

    const handleInputChange = (value) => {
        setInputValue(value);
        setIsValid(value.length > 0);
        setError({ ...error, number: '' });
    }

    const handleOtp = (val, i) => {
        let values = [...otp.values];
        values[i] = val;
        setOtp({ ...otp, values: values });
        if (values[values.length - 1] === '') setError({ ...error, otp: '' });
    }

    const sendOtp = async () => {
        let data = { 'username': inputValue };
        Object.keys(data).forEach(key => (data[key] == null || data[key] === '') && delete data[key]);
        
        await apiRequest({
            url: `/api/auth/v1/student/send_otp/`,
            method: 'POST',
            data: data,
            headers: { 'Content-Type': 'application/json' },
            onSuccess: async () => setOtp({ ...otp, generated: true }),
            onError: (response) => setError({ ...error, number: response.data.message })
        });
    }

    const validateOtp = async () => {
        await apiRequest({
            url: `/api/auth/v1/login/`,
            method: 'POST',
            data: JSON.stringify({ 'username': inputValue, 'otp_code': getOtpFromState(), "click_wrap": true }),
            headers: { 'Content-Type': 'application/json' },
            onSuccess: async (data) => {
                saveToken(data.token);
                setUserInfo(data.user_data)
                navigate(`/home`, { 
                    replace: true,
                });
            },
            onError: (response) => {
                setError({ ...error, otp: response.data.message });
                setLoader(false);
            }
        });
    }

    const handleGenerateOtpButton = async () => {
        setLoader(true);
        setError({ ...error, number: null });
        if (isValid) await sendOtp();
        setLoader(false);
    }

    const handleProceedButton = async () => {
        setLoader(true);
        setError({ ...error, otp: null });
        await validateOtp();
        setLoader(false);
    }

    useEffect(() => {
        const token = getToken();
        if (token && token !== '') {
            navigate(`/home`, { replace: true });
        }
    }, []);

    return (
        <div className='login'>
            {!otp.generated ?
                <div className='container'>
                    <div className='header-container'>
                        <img src={logo} className='logo-small' />
                    </div>
                    <div style={{ width: '100%' }}>
                        <div className='header'>Login</div>
                        {/* <div className='subline' style={{ marginBottom: '3rem' }}>Let's pay your fees</div> */}
                        <InputField
                            placeholder={'Enter Phone Number'}
                            validate={true}
                            validity={isValid}
                            inputType="text"
                            handleChange={handleInputChange}
                            error={error.number}
                            maxLength={10}
                        />
                    </div>
                    <div className='bottom-container'>
                        <div className='message'>An OTP will be sent to the above number</div>
                        <div className={'small-wrapper'} style={{ margin: '1.2rem 0 0' }}>
                            {!loader ?
                                <Button
                                    text='Generate OTP'
                                    handleClick={handleGenerateOtpButton}
                                    classes={`button-big button-primary ${isValid ? '' : 'disabled'}`}
                                />
                                :
                                <div className="credenc-loader">
                                    <TailSpin color="rgba(255, 255, 255, 0.7)" height={28} width={100} />
                                </div>
                            }
                        </div>
                    </div>
                </div>
                :
                <div className='wrapper container'>
                    <div className='header-container'>
                        <img src={logo} className='logo-small' />
                    </div>
                    <div className='mid-container'>
                        <div className='header'>Verify OTP</div>
                        <div className='subline'>Please check the message for OTP</div>
                        <div className='label'>OTP</div>
                        <OtpField
                            handleChange={handleOtp}
                            otp={otp}
                            error={error.otp}
                        />
                    </div>
                    <div className='bottom-container'>
                        <div className={areAllFilled() ? `small-wrapper` : ''} style={{ margin: '1.2rem 0 0' }}>
                            {!loader ?
                                <Button
                                    text='Proceed'
                                    handleClick={handleProceedButton}
                                    classes={`${areAllFilled() ? '' : 'disabled'} button-big button-primary`}
                                />
                                :
                                <div className="credenc-loader">
                                    <TailSpin color="rgba(255, 255, 255, 0.7)" height={28} width={100} />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}
