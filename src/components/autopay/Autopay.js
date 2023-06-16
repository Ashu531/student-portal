import React, { useEffect, useState } from 'react';
import Header from '../../components/elementalComponents/header/Header'
import Button from '../elementalComponents/button/Button';
import backIcon from '../../assets/caret-right.svg';
import axios from 'axios';
import { getToken,logoutUser } from '../../services/authService';
import StudentDetails from '../elementalComponents/studentDetails/StudentDetails';
import useScript from '../../hooks/useScript';
import moment from 'moment'
import { useNavigate, useLocation } from 'react-router-dom';
import ConfirmationModal from '../elementalComponents/confirmationModal/ConfirmModal';
import awaitIcon from '../../assets/awaitIcon.svg'

export default function Autopay() {

    const [student, setStudent] = useState({});
    const [totalAmount,setTotalAmount] = useState(0)
    const [autopay,setAutopay] = useState(false);
    const [paymentDetailData,setPaymentDetailData] = useState([])
    const [installments,setInstallments] = useState([])
    const [loader, setLoader] = useState(false);
    const [easebuzzCheckout, setEasebuzzCheckout] = useState(null);
    const [applicationStatus, setApplicationStatus] = useState(false)
    const [paymentOpen,setpaymentOpen] = useState({
        paymentID: null,
        openPayment: false
    })
    const [confirmModalData,setConfirmModalData] = useState({
        title: '',
        subHeading: '',
        description: '',
        buttonText:'',
        successImage: false
   })
    const {state} = useLocation();

    useEffect(() => {
        if(state){
            setAutopay(true) 
        }
          
    }, []);

    const getData = async () => {
        const data = await axios.get(`${API_URL}/api/kid/v1/school/installments/${getToken()}/`)
        .then(res => res.data)
        .catch(error => error.response.data);

        return data; 
    }

    useEffect(() => {
        let amount = 0;   
        const statusContent = installments.filter(installment => installment['status'] != 'paid' )  
        statusContent.forEach((installment) => {
            amount += parseFloat(installment['amount']) + parseFloat(installment['penalty']);
        })
    
        setTotalAmount(amount);
    }, [installments])

    const logout = async () => {
        const loggedOut = await logoutUser();
        if(loggedOut)
            navigate('/login', {replace: true});
    }

    useEffect(async () => {
        setLoader(true);
        const data = await getData();

        if(data.status_code === 401){
            logout()
        }else{
            setStudent(data.student);
        }

        setInstallments(data.data);

        setLoader(false);
        _getPaymentDetails()

        useScript('https://ebz-static.s3.ap-south-1.amazonaws.com/easecheckout/easebuzz-checkout.js', () => {
            setEasebuzzCheckout(new EasebuzzCheckout("7ITASSQJE1", 'prod'));
        });
    }, [])

    const _getPaymentDetails=async()=>{
        const data = await axios.get(`${API_URL}/api/kid/v1/autopay/installments/${getToken()}/`)
        .then(res => {
            if(res.status === 401){
                logout()
            }else{
                setPaymentDetailData(res.data.data)
                _getPaymentOptions(res.data.data)
            }
            
        })
        .catch(error => error.response.data);

        return data;
    }

    const _getPaymentOptions=(data)=>{
        let amount = 0;
        data.forEach((item,index)=>{
            console.log(item.amount)
            amount = amount + item.amount
        })
        console.log(amount)
    }

    const handleProceed=()=>{
        setAutopay(true)
    }

    const handleAutopay=async()=>{
        let response = await axios.post(`${API_URL}/api/kid/v1/autopay/apply/${getToken()}/`, {
            'amount': String(totalAmount)
           }).then(res => {
               let url = res.data.url
               window.location.href = url
            //    console.log(url,"url+++")
           })
            .catch(err => alert(err.response.data.error));
    }

    const handleToggle=(item)=>{
        setpaymentOpen({
            paymentID: item.id,
            openPayment: !paymentOpen.openPayment
        })
    }

    const openCancellationModal=()=>{
        setConfirmModalData({
            title: 'Auto-Pay Cancellation',
            subHeading:'Are you sure you want to cancel your auto-pay mandate?',
            description: 'Once this action is performed, you will have to pay all pending fee using other payment methods or set up auto-pay mandate again.',
            buttonText: 'Yes, cancel my Auto-Pay.',
            successImage: false,
            handleSubmit: cancelAutopay
        })
        setApplicationStatus(true)
    }

    const cancelAutopay=async()=>{
        if(state.applicationId){
            let response = await axios.post(`${API_URL}/api/kid/v1/autopay/cancel/${getToken()}/`, {
                application_id: state.applicationId,
               }).then(res => {
                closeConfirmationModal()
                alert('Application Successfully Cancelled')
               })
            .catch(err => {
                closeConfirmationModal()
                alert(err.response.data.error)
            });
        }else{
            alert('Invalid Application Id')
        }
        
    }

    const closeConfirmationModal=()=>{
        setApplicationStatus(false)
    }

    return (
        <>
        <Header
             title="Auto-Pay"
             icon={student.logo}
           />
        <div className='autopay'>
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
           {    totalAmount < 6 &&
                <div className='amount-container' style={{justifyContent:'flex-start'}}>
                        <img src={awaitIcon} alt="status-icon" height={25} width={25} style={{objectFit:'contain'}}/>
                        <div className='amount-label'>
                            Amount cannot be less than 6
                        </div>
                </div>
           }
           {
                    autopay && state && 
                        <div className='paid-status'>
                            <div className='icon-circle'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#a8cfff" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>
                            </div>
                            <div className='status-text'>
                              If you wish to cancel your Auto-Pay mandate, you can do so by <b style={{textDecoration: 'underline',cursor:'pointer'}} onClick={openCancellationModal}>Clicking Here</b>.
                            </div>    
                        </div>
                    }
           {
               !autopay && 
                    <div className='benefit-container'>
                        <span className='benefit-header'>Benefits of Auto-Pay</span>
                        <div className='benefit-list'>
                            <ol style={{padding: '0 0 0 2rem'}}>
                                <li className='benefit-text'><b>Convenience:</b> Setting up auto-pay means you don't have to worry about meeting deadlines for fees payments.</li>
                                <li className='benefit-text'><b>Avoiding Late Fees:</b> You can ensure that your school fees are paid on time, which helps you avoid late fees.</li>
                                <li className='benefit-text'><b>Secure and Consistent:</b> It is ensured that your payments are consistently paid each instalment, securely.</li>
                                <li className='benefit-text'><b>Customisation:</b> You can change, modify or cancel your payments as and when required. </li>
                            </ol>
                        </div>
                    </div>
           }
           
          
            {
                autopay && 
                <div className='payment-card'>
                    <div className='payment-header'>
                        <span className='header-text'>Payment Details</span>
                    </div>
                    {
                        paymentDetailData && paymentDetailData.map((item,index)=>{
                            let amount = 0;
                            item?.data.forEach((data,i)=>{
                                amount = amount + data.amount
                            })

                            let minDate = item?.data[0]?.start_date

                            item?.data.forEach((data,i)=>{
                                console.log(data)
                                let temp = data?.start_date
                                if(moment(temp).isAfter(minDate)){
                                    minDate = temp;
                                }
                            })

                            return(
                                <div className='quarter-container' key={index}>
                                    <div className='quarter-header'>
                                        <span className='quarter-label'>{item.name}</span>
                                        <span className='quarter-label'>{moment(minDate).format("MMM Do YYYY")}</span>
                                        <span className='quarter-label' style={{fontWeight: 700,width: '20%',textAlign:'center'}}>₹ {amount}</span>
                                        <img src={backIcon} height={20} width={20} style={item.id == paymentOpen.paymentID && paymentOpen.openPayment === true && item.data.length > 0 ? {transform: 'rotate(-90deg)',cursor: 'pointer'} : {transform: 'rotate(90deg)',cursor: 'pointer'}} onClick={()=>handleToggle(item)} />
                                    </div>
                                    {  item.id == paymentOpen.paymentID && paymentOpen.openPayment === true &&
                                        item.data.map((el,i)=>{
                                            return(
                                                <div className='fee-breakup' key={i}>
                                                    <div className='fee-content'>
                                                        <span className='fee-content-text'>{el.name}</span>
                                                        <span className='fee-content-text' style={{fontWeight: 600}}>₹ {el.amount}</span>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    
                                </div>
                            )
                        })
                    }
                    
                </div>
            }
            {
              !state &&  <div className='button-container'> 
            {      
               !autopay ? 
                    <Button 
                        text='Proceed' 
                        classes={`small-wrapper button-small button-primary ${totalAmount > 5 ? '': 'disabled'}`}
                        handleClick={()=>handleProceed()}
                    />
                    : 
                    <Button 
                        text='Set up Auto-Pay' 
                        classes={`small-wrapper button-small button-primary ${totalAmount > 0 ? '': 'disabled'}`}
                        handleClick={()=>handleAutopay()}
                    />
             }
             </div>
            }
            { applicationStatus &&
                <ConfirmationModal
                    modalData={confirmModalData}
                    student={student}
                    handleClose={closeConfirmationModal}
                />
            }
        </div>
        </>
    )
}



