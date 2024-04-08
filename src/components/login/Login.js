import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import logo from '../../assets/credenc-logo.svg';
import Button from '../elementalComponents/button/Button';
import InputField from '../elementalComponents/inputField/InputField';
import OtpField from '../elementalComponents/otpField/OtpField';
import caret from '../../assets/caret-right.svg';
import { delay, getToken, saveStudents, saveToken } from '../../services/authService';
import { Bars, TailSpin } from 'react-loader-spinner';
import TcModal from '../elementalComponents/tandc/TcModal';
import InstituteForm from '../elementalComponents/instituteForm/InstituteForm';
import { CountrySelect } from '../countrySelect/CountrySelect';
import { apiRequest } from '../../services/apiRequest';

export default function Login() {

    const navigate = useNavigate();

    const [selectedCountry, setSelectedCountry] = useState('+91');
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

    const [collegeData,setCollegeData] = useState({})

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
        
        let params = window.location.pathname
        let urlSlug = params.substring(7,params.length)

        let otpVerified;
        if(value.length == 6){
            
            await apiRequest({
                url: `/api/kid/v1/verify_otp/`,
                method: 'POST',
                data: JSON.stringify({
                    'phone_number': `${selectedCountry} ${inputValue}`,
                    'otp': value,
                    'college_slug': urlSlug
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
                onSuccess: async (data) => {
                    otpVerified = data;
                },
                onError: (response) => {
                    setError({...error, otp: response.data.message});
                    setLoader(false)
                }
            })

        }

        return otpVerified;
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
            'phone_number': `${selectedCountry} ${inputValue}`,
            'college_slug': urlSlug
        }

        Object.keys(data).forEach(
            key => (data[key] == null || data[key] == '') && delete data[key],
        );

        let otpGenerated;
        await apiRequest({
            url: `/api/kid/v1/send_otp/`,
            method: 'POST',
            data: data,
            headers: {
                'Content-Type': 'application/json'
            },
            onSuccess: async (data) => {
                otpGenerated = data;
            },
            onError: (response) => {
                setError({...error, number: response.data.message});
            }
        })

        return otpGenerated ? otpGenerated.status: otpGenerated;
    }

    const resendOtp = async () => {
        let resendState = ['','','','','','']
        setOtp({...otp,values: resendState})
        let params = window.location.pathname
        let urlSlug = params.substring(7,params.length)

        let resent;
        await apiRequest({
            url: `/api/kid/v1/resend_otp/`,
            method: 'POST',
            data: JSON.stringify({
                phone_number: `${selectedCountry} ${inputValue}`,
                college_slug: urlSlug
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            onSuccess: async (data) => {
                resent = data;
            },
            onError: (response) => {
                alert(response.data.error)
            }
        })

        return resent ? resent.status: resent;
    }

    const getStudents = async () => {
        let params = window.location.pathname
        let urlSlug = params.substring(7,params.length)

        let students;
        await apiRequest({
            url: `/api/kid/v1/identify/${selectedCountry}_${inputValue}/`,
            method: 'POST',
            data: JSON.stringify({
                college_slug: urlSlug
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            onSuccess: async (data) => {
                students = data.data;
            },
            onError: (response) => {
                console.log(response);
            }
        })

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
            setSignUpState(false)
        }
    }

    const getLastFourDigits = () => {
        return inputValue % 10000;
    }

    const handleInputChange = (value) => {
        let isnum = /^\d+$/.test(value);
        if(value.length < 6){
            setInputValue(value);
            setIsValid(false);
            setError({...error,number: ''})
        }
        
        if(value.length >= 6){
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
                }else{
                    data[`${item.label}`] = item.value
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

        await apiRequest({
            url: `/api/kid/v1/signup/`,
            method: 'POST',
            data: data,
            onSuccess: async (data) => {
                try{
                    if(data.signup === false){
                        handleApplicationData()
                    }
                }catch(err) {
                    console.log(err,'error')
                }
            },
            onError: (response) => {
                alert(response.data.error)
            }
        })

    }

    const getFieldData=async()=>{

        let params = window.location.pathname
        let url = params.substring(7,params.length)

        let urldata = {
            'domain': 'signup'
        }
        if(url.length > 0){

            await apiRequest({
                url: `/api/fees/v2/fetch/fields/${url}/`,
                method: 'POST',
                data: urldata,
                onSuccess: async (data) => {
                    if(data?.college?.length > 0){
                        setCollegeData(data?.college[0])
                    }
                },
                onError: (response) => {
                    if(response.status === 406){
                        handleLinkExpired()
                    }
                }
            })

        }
    }

    useEffect(()=>{
        getFieldData()
    },[])

    return (
        <div className='login'>
            <img src={logo} className='logo'/>
            {!verified && !otp.generated &&
            <div className='container'>
                {
                        collegeData?.logo && 
                        <div className='college-icon'>
                            <img src={collegeData?.logo} alt='college_logo' height={32} width={62} style={{objectFit:"contain"}} />
                        </div>
                }
                <div className='header-container'>
                    <img src={logo} className='logo-small'/>
                </div>
                <div style={{width: '100%'}}>
                    <div className='header'>Login</div>
                    <div className='subline' style={{marginBottom: '3rem'}}>Let's pay your fees</div>
                
                <div style={{display: 'flex', gap: '1rem', alignItems: 'flex-start'}}>
                    <CountrySelect 
                        selectedCountry={selectedCountry} 
                        onSelect={(code) => {
                            console.log(code, "hwhjebjwh")
                            setSelectedCountry(code)
                        }}
                    />
                    <InputField 
                        placeholder={'Enter registered Phone Number'} 
                        validate={true}
                        validity={isValid}
                        inputType="number"
                        handleChange={handleInputChange}
                        error={error.number}
                    />
                </div>
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
                    {
                        collegeData?.logo && 
                        <div className='college-icon'>
                            <img src={collegeData?.logo} alt='college_logo' height={32} width={62} style={{objectFit:"contain"}} />
                        </div>
                    }
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
                        // description='Enter information, as applicable!'
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
                <div style={{width: '100%',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                     {
                        collegeData?.logo && 
                        <div className='college-icon'>
                            <img src={collegeData?.logo} alt='college_logo' height={32} width={62} style={{objectFit:"contain"}} />
                        </div>
                    }
                    <div className='header'>Select Student</div>
                    <div className='students-container'>
                        {
                            students.map((student, i) => (
                                <div className='student-card' key={i} onClick={() => navigateToInstallmentPage(i)}>
                                    <div className='text-container'>
                                        <div className='name'>{student.name}</div>
                                        <div className='id'>{student.id} &#8226; {student.course}</div>
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
