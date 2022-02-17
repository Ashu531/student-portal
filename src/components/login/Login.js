import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import logo from '../../assets/credenc-logo.svg';
import Button from '../elementalComponents/button/Button';
import InputField from '../elementalComponents/inputField/InputField';
import OtpField from '../elementalComponents/otpField/OtpField';
import background from '../../assets/background.png';
import caret from '../../assets/caret-right.svg';
import axios from 'axios';
import { delay, getToken, saveToken } from '../../services/authService';
import { Bars, TailSpin } from 'react-loader-spinner';
import CheckBox from '../elementalComponents/checkBox/CheckBox';
import TcModal from '../elementalComponents/tandc/TcModal';

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
            .then(res => (res.data.status))
            .catch(err => {
                setError({...error, otp: err.response.data.message});
            });

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
        .then(res => (res.data))
        .catch(err => {
            // console.log('res', {...err});
            setError({...error, number: err.response.data.message});
        });

        return otpGenerated ? otpGenerated.status: otpGenerated;
    }

    const resendOtp = async () => {
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
        if(isOtpValid){
            const studentList = await getStudents();
            if(studentList){
                // console.log(studentList);
                setStudents(studentList);
                setVerified(true);
            }
        }
        setLoader(false);
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
        navigate(`/home/${students[i].token}`, {replace: true});
    }

    useEffect(() => {
        const token = getToken();
        if(token && token !== ''){
            navigate(`/home/${token}`, {replace: true});
        }
    }, [error]);

    return (
        <div className='login' style={{backgroundImage: `url(${background})`}}>
            <img src={logo} className='logo'/>
            {!verified && !otp.generated &&
            <div className='wrapper container'>
                <div className='header-container'>
                    <img src={logo} className='logo-small'/>
                    <div className='header'>Login</div>
                    <div className='subline'>Let's pay your college fee</div>
                </div>
                <InputField 
                    placeholder={'Enter registered Phone Number'} 
                    validate={true}
                    validity={isValid}
                    inputType='tel'
                    handleChange={handleInputChange}
                    error={error.number}
                />
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

            {!verified && otp.generated &&
                <div className='wrapper container'>
                <div className='header-container'>
                    <img src={logo} className='logo-small'/>
                    <div className='header'>Verify OTP</div>
                    <div className='subline'>Please check message on xxxxxx{getLastFourDigits()}</div>
                </div>
                <div className='mid-container'>
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
                        <div className='small-wrapper-colored' style={{margin: '0.8rem 0'}}>
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
            {verified && <div className='wrapper container'>
                <div className='header-container'>
                    <img src={logo} className='logo-small'/>
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
