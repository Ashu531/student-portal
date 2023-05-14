import React, { useEffect, useState } from 'react';
import Header from '../../components/elementalComponents/header/Header'
import Button from '../elementalComponents/button/Button';
import backIcon from '../../assets/caret-right.svg';
import axios from 'axios';
import { getToken } from '../../services/authService';
import StudentDetails from '../elementalComponents/studentDetails/StudentDetails';
import useScript from '../../hooks/useScript';


export default function Autopay() {

    const [student, setStudent] = useState({});
    const [totalAmount,setTotalAmount] = useState(0)
    const [autopay,setAutopay] = useState(false);
    const [paymentDetailData,setPaymentDetailData] = useState([])
    const [loader, setLoader] = useState(false);
    const [easebuzzCheckout, setEasebuzzCheckout] = useState(null);
    const [paymentOpen,setpaymentOpen] = useState({
        paymentID: null,
        openPayment: false
    })

    const getData = async () => {
        const data = await axios.get(`${API_URL}/api/kid/v1/installments/${getToken()}/`)
        .then(res => res.data)
        .catch(error => error.response.data);

        return data;
    }

    useEffect(async () => {
        setLoader(true);
        const data = await getData();
        setStudent(data.student);
        let amount = 0;
        data.data.forEach((installment,index)=>{
                amount += parseFloat(installment['amount']) + parseFloat(installment['penalty']);
        })
        setTotalAmount(amount);
        setLoader(false);
        _getPaymentDetails()

        useScript('https://ebz-static.s3.ap-south-1.amazonaws.com/easecheckout/easebuzz-checkout.js', () => {
            setEasebuzzCheckout(new EasebuzzCheckout("7ITASSQJE1", 'prod'));
        });
    }, [])

    const _getPaymentDetails=async()=>{
        const data = await axios.get(`${API_URL}/api/kid/v1/autopay/installments/${getToken()}/`)
        .then(res => setPaymentDetailData(res.data.data))
        .catch(error => error.response.data);

        return data;
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
           })
            .catch(err => err.response.data);
    }

    const handleToggle=(item)=>{
        setpaymentOpen({
            paymentID: item.id,
            openPayment: !paymentOpen.openPayment
        })
    }

    return (
        <>
        <Header
             title="Auto-Pay"
           />
        <div className='autopay'>
           <StudentDetails 
                name={student.name}
                id={student.id}
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
                            console.log(item)
                            return(
                                <div className='quarter-container' key={index}>
                                    <div className='quarter-header'>
                                        <span className='quarter-label'>{item.name}</span>
                                        <span className='quarter-label'>2021 JAN 16</span>
                                        <span className='quarter-label' style={{fontWeight: 700}}>₹ 54,500</span>
                                        <img src={backIcon} height={20} width={20} style={item.id == paymentOpen.paymentID && paymentOpen.openPayment === true && item.data.length > 0 ? {transform: 'rotate(-90deg)'} : {transform: 'rotate(90deg)'}} onClick={()=>handleToggle(item)} />
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
               !autopay ? 
                    <Button 
                        text='Proceed' 
                        classes='button'
                        handleClick={()=>handleProceed()}
                    />
                    : 
                    <Button 
                        text='Set up Auto-Pay' 
                        classes='button'
                        handleClick={()=>handleAutopay()}
                    />
           }
            
        </div>
        </>
    )
}



