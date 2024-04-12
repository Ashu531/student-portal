import React, { useEffect, useState } from 'react';
import Header from '../../components/elementalComponents/header/Header'
import Button from '../elementalComponents/button/Button';
import { getToken,logoutUser } from '../../services/authService';
import StudentDetails from '../elementalComponents/studentDetails/StudentDetails';
import moment from 'moment'
import { useNavigate, useLocation } from 'react-router-dom';
import ConfirmationModal from '../elementalComponents/confirmationModal/ConfirmModal';
import awaitIcon from '../../assets/awaitIcon.svg'
import ChatWidget from '@papercups-io/chat-widget';
import { TailSpin } from "react-loader-spinner";
import QuickViewModal from '../elementalComponents/quickViewModal/QuickViewModal';
import { downloadTransaction } from '../../services/dowmloadTransaction';
import { apiRequest } from '../../services/apiRequest';
import html2pdf from 'html2pdf.js';

export default function Autopay() {

    const navigate = useNavigate();
    const [student, setStudent] = useState({});
    const [totalAmount,setTotalAmount] = useState(0)
    const [autopay,setAutopay] = useState(false);
    const [installments,setInstallments] = useState([])
    const [loader, setLoader] = useState(false);
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
   const [autopayLoader,setAutopayLoader] = useState(false)
   const [quickView,setQuickView] = useState(false);
   const [quickViewState,setQuickViewState] = useState(false);

   const {state} = useLocation();

    useEffect(() => {
        if(state){
            setAutopay(true) 
        }
          
    }, []);

    const getData = async () => {

        let res;
        await apiRequest({
            url: `/api/kid/v1/autopay/installments/${getToken()}/`,
            method: 'GET',
            onSuccess: async (data) => {
                res = data;
            },
            onError: (response) => {
                alert(response.data.error);
                res = response.data;
            }
        })

        return res; 
    }

    useEffect(() => {
        let amount = 0;   
        const statusContent = installments.filter(installment => installment['status'] != 'paid' )
        statusContent.forEach((installment) => {
            amount += parseFloat(installment['amount']) + parseFloat(installment['penalty']);
        })
    
        setTotalAmount(amount.toFixed(2));
    }, [installments])

    const logout = async () => {
        const loggedOut = await logoutUser();
        if(loggedOut)
            navigate('/login', {replace: true});
    }

    const navigateToHome=()=>{
        navigate(`/installments`, {replace: true});
    }

    useEffect(async () => {
        setLoader(true);
        const data = await getData();
        
        setStudent(data.student);
        setInstallments(data.data);

        setLoader(false);
    }, [])

    const handleProceed=()=>{
        setAutopay(true)
    }

    const handleAutopay=async()=>{

        await apiRequest({
            url: `/api/kid/v1/autopay/apply/${getToken()}/`,
            method: 'POST',
            data: {
                'amount': String(totalAmount)
            },
            onSuccess: async (data) => {
                let url = data.url
                if(url != null){
                    window.location.href = url
                }
            },
            onError: (response) => {
                alert(response.data.error)
            }
        })
    }

    const handleToggle=(item)=>{
        if(item.id != paymentOpen.paymentID){
            setpaymentOpen({
                paymentID: item.id,
                openPayment: true
            })
        } else {
            setpaymentOpen({
                paymentID: item.id,
                openPayment: false
            })
        }
    }

    const openCancellationModal=()=>{
        setConfirmModalData({
            title: 'Auto-Pay Cancellation',
            subHeading:'Are you sure you want to request for auto-pay mandate cancellation?',
            description: 'Once this action is completed, you will have to pay all pending fee using other payment methods or set up auto-pay mandate again.',
            buttonText: 'Yes, cancel my Auto-Pay.',
            successImage: false,
            handleSubmit: cancelAutopay
        })
        setApplicationStatus(true)
    }

    const cancelAutopay=async()=>{
        setAutopayLoader(true)
        if(state.applicationId){

            await apiRequest({
                url: `/api/kid/v1/autopay/request_cancel/${getToken()}/`,
                method: 'POST',
                data: {
                    application_id: state.applicationId,
                },
                onSuccess: async (data) => {
                    closeConfirmationModal()
                    alert('Request for Cancellation submitted to Institute')
                    setAutopayLoader(false)
                    navigateToHome();
                },
                onError: (response) => {
                    closeConfirmationModal()
                    setAutopayLoader(false)
                    navigateToHome();
                    alert(response.data.error)
                }
            })

        }else{
            alert('Invalid Application Id')
            setAutopayLoader(false)
        }
        
    }

    const closeConfirmationModal=()=>{
        setApplicationStatus(false)
    }

    const closeQuickView=()=>{
        setQuickView(false)
    }

    const openQuickView=()=>{
        setQuickView(true)
        handleStudentClick()
    }

    const downloadCollapsiblePdf=async(item)=>{
        const response =  await apiRequest({
            url: `payment/download/reciept/${item?.transaction_id}/`,
            method: 'GET',
            data: {},
            token: getToken(),
            onSuccess: (data) => {
                downloadTransactionPDF(data['html_content'])
            },
            onError: (response) => {
                // toast.error(response.data.error);
                console.log(response,"error")
            }
        })
    }

    const downloadTransactionPDF = (htmlString) => {
    
        const element = document.createElement('div');
        element.innerHTML = htmlString;
        element.style.width = '100%';
        const options = {
        margin: 10,
        filename: 'report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };
        html2pdf(element, options);
    };

    const handleStudentClick = async () => {

        let newQuickViewState = {};
        newQuickViewState["student"] = student;

        await apiRequest({
            url: `/api/kid/v1/transactions/${student?.id}/`,
            method: 'GET',
            headers: {
                'token' : getToken()
            },
            onSuccess: async (data) => {
                newQuickViewState["transactionHistory"] = data.data
                setQuickViewState(newQuickViewState);
            },
            onError: (response) => {
                alert(response.data.error)
            }
        })
    };

    return (
        <>
        <Header
             title="Auto-Pay"
             icon={student.logo}
             openQuickView={()=>openQuickView()}
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
           {    totalAmount <= 10 &&
                <div className='amount-container' style={{justifyContent:'flex-start'}}>
                        <img src={awaitIcon} alt="status-icon" height={25} width={25} style={{objectFit:'contain'}}/>
                        <div className='amount-label'>
                            Amount cannot be lesser than 10
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
                        installments.map((item,index)=>{

                            return(
                                <div className='quarter-container' key={index}>
                                    <div className='quarter-header'>
                                        <span className='quarter-label'>{item.name}<br/><p style={{fontSize: '1rem', color: '#000000', fontWeight:'400', textTransform: 'capitalize',margin:0}}>{item?.fee_category?.name}</p></span>
                                        <span className='quarter-label'>{moment(item.due_date).format("MMM Do YYYY")}</span>
                                        <span className='quarter-label' style={{fontWeight: 700,width: '20%',textAlign:'center'}}>₹ {item.amount}</span>
                                    </div>
                                    
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
                        align={'flex-end'}
                    />
                    : 
                    <Button 
                        text='Set up Auto-Pay' 
                        classes={`small-wrapper button-small button-primary ${totalAmount > 0 ? '': 'disabled'}`}
                        handleClick={()=>handleAutopay()}
                        align={'flex-end'}
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
            {
            autopayLoader && 
              <div className="credenc-loader-white fullscreen-loader">
                <TailSpin color="#00BFFF" height={60} width={60}/>
              </div>
            }
            {
            quickView &&
            <QuickViewModal 
                 closeQuickView={()=>closeQuickView()}
                 quickView={quickView}
                 quickViewState={quickViewState}
                 handleCollapsibleDownload={(item)=>downloadCollapsiblePdf(item)}
            />
            }
        </div>
        
        <ChatWidget
            token={`${PAPERCUPS_TOKEN}`}
            inbox={`${PAPERCUPS_INBOX}`}
            title="Welcome to Credenc Fee Pay"
            subtitle="Ask us anything in the chat window below 😊"
            primaryColor="#8F14CC"
            newMessagePlaceholder="Start typing..."
            showAgentAvailability={true}
            agentAvailableText="We're online right now!"
            agentUnavailableText="We're away at the moment."
            iconVariant="outlined"
            baseUrl="https://app.papercups.io"
            customer={{
              name: student.name,
              email: student.email,
              metadata: {
                college: student.college,
                id: student.id,
                course: student.course,
                batch: student.batch,
                prn: student.prn
              }
            }}
        />
        </>
    )
}



