import ChatWidget from '@papercups-io/chat-widget';
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { TailSpin } from 'react-loader-spinner';
import { useNavigate } from 'react-router';
import useScript from '../../hooks/useScript';
import { getToken, logoutUser } from '../../services/authService';
import Button from '../elementalComponents/button/Button';
import Header from '../elementalComponents/header/Header';
import Modal from '../elementalComponents/modal/Modal';
import Pair from '../elementalComponents/pair/Pair';
import SmallTable from '../elementalComponents/smallTable/SmallTable';
import StudentDetails from '../elementalComponents/studentDetails/StudentDetails';
import Table from '../elementalComponents/table/Table';
import QuickViewModal from '../elementalComponents/quickViewModal/QuickViewModal';
import { downloadTransaction } from '../../services/dowmloadTransaction';

export default function Payment() {

  const navigate = useNavigate();

  const [installments, setInstallments] = useState([]);
  const [student, setStudent] = useState({});
  const [amount, setAmount] = useState(0);

  const [studentCollapsed, setStudentCollapsed] = useState(true);

  const [loader, setLoader] = useState(false);

  const [modalData, setModalData] = useState({});
  const [confirmationDialog, setConfirmationDialog] = useState(false);

  const [easebuzzCheckout, setEasebuzzCheckout] = useState(null);

  const [quickView,setQuickView] = useState(false);

  const [quickViewState,setQuickViewState] = useState(false);

  const getModalData = async () => {
    const {ids, amount} = getSelectedInstallments();
    // console.log(ids, amount);
    const data = await axios.post(`${API_URL}/api/kid/v1/payment/${getToken()}/`, {
        'ids': ids,
        'amount': amount,
        'mode': 'FULL_PAYMENT',
    }).then(res => res.data)
    .catch(error => {
        alert(error.response.data.error)
        return error.response.data
    });

    return data;
}

const getSelectedInstallments = () => {
    const selectedInstallments = installments.filter(installment => installment.is_mandatory === 'True' || installment.is_mandatory === true);
    const selectedids = selectedInstallments.map(installment => installment.id);
    return {
        'ids': selectedids,
        'amount': amount
    }
}

const getData = async () => {
    const data = await axios.get(`${API_URL}/api/kid/v1/school/all_installments/${getToken()}/`)
    .then(res => res.data)
    .catch(error => {
        alert(error.response.data.error)
        return error.response.data
    });

    return data;
}

const handleProceed = async () => {
    setLoader(true);
    const res = await getModalData();

    if(res.data && res.student) {
        const { student, data, log_no: logNumber } = res;
        setModalData({
            'student': student,
            'key': data,
            'amount': amount,
            'logNumber': logNumber,
        });
        setConfirmationDialog(true);
        setLoader(false);
        return;
    }

    setLoader(false);
    if(res.error && res.message){
        confirm(`some error occurred: ${res.message}`);
    }
}

const closeModal = () => {
    setConfirmationDialog(false);
}

const logResponse = async (res) => {
    return await axios.post(`${API_URL}/api/kid/v1/log/${modalData.logNumber}/`, JSON.stringify(res))
    .catch(error => {
        alert(error.response.data.error)
        return error.response.data
    });
}

const handleProceedAndPay = async () => {
        let options = {
            access_key: modalData.key, // access key received via Initiate Payment
            onResponse: (response) => {
                if(!response || !response.status){
                    logResponse(response);
                    alert(`some error occurred!`);
                } else if(response.status && response.status.toLowerCase() === 'success'){
                    logResponse(response);
                    let paymentResponse = {
                        ...response, 
                        'installmentsFrontend': installments.filter(installment => installment.is_mandatory === 'True' || installment.is_mandatory === true),
                        'studentFrontend': {...student} 
                    }
                    navigate('/success', {
                        state: paymentResponse
                    });
                    
                    handlePaymentSuccessResponse(paymentResponse)
                } else if(response.status && response.status.toLowerCase() === 'failure'){
                    logResponse(response);
                    alert(response.error_Message);
                    closeModal();
                } else if(response.status){
                    logResponse(response);
                    alert(`transaction cancelled!`);
                    closeModal();
                }
            },
            theme: "#4530B1" // color hex
        }
        
        try{
            if(easebuzzCheckout)
                await easebuzzCheckout.initiatePayment(options);
        } catch(err) {
            await logResponse(err);
            confirm(`some error occurred!`);
        }
}

const handlePaymentSuccessResponse=async(state)=>{
   let detail = {
    "name": state.firstname,
    "batch": state.studentFrontend.batch,
    "course": state.studentFrontend.course,
    "mode": state.mode,
    "date": state.addedon,
    "payment_id": state.txnid,
    "amount": state.amount,
    "installment": state.installmentsFrontend,
    "logo": state.studentFrontend.logo
   }

   await axios.post(`${API_URL}/api/kid/v1/payment_success_response/${getToken()}/`,detail).then(res => res.data)
   .catch(error => {
    alert(error.response.data.error)
    return error.response.data
});

}

useEffect(() => {
    if(!confirmationDialog)  {
        setModalData({});
    }
}, [confirmationDialog])

useEffect(() => {
    let amount = 0;
    installments.forEach((installment) => {
        amount += parseFloat(installment['amount']) + parseFloat(installment['penalty']);
    })

    setAmount(amount.toFixed(2));
}, [installments])

useEffect(async () => {
    setLoader(true);
    const data = await getData();

    if(data.status_code === 401){
        await logout();
        return;
    }else{
        setStudent(data.student);
    }
    

    data.data.forEach((installment, i) => {

        if(installment['status'] !== 'due' && installment['status'] !== 'overdue' && installment['status'] !== 'upcoming'){
            data.data[i]['is_mandatory'] = false;
        } else {
            data.data[i]['is_mandatory'] = true;
        }

    });

    const installments = data.data.filter(installment => installment['status'] != 'paid' )

    setInstallments(installments);
    setLoader(false);

    useScript('https://ebz-static.s3.ap-south-1.amazonaws.com/easecheckout/easebuzz-checkout.js', () => {
        setEasebuzzCheckout(new EasebuzzCheckout("7ITASSQJE1", 'prod'));
    });

    }, [])

    const logout = async () => {
        const loggedOut = await logoutUser();
        if(loggedOut)
            navigate('/login', {replace: true});
    }

    const closeQuickView=()=>{
        setQuickView(false)
    }

    const openQuickView=()=>{
        setQuickView(true)
        handleStudentClick()
    }

    const downloadCollapsiblePdf=(item)=>{
        let name = item.student_name.split(' ');
        let state =  {
            ...item,
            'instituteLogo': instituteLogo,
            name
        }
        downloadTransaction(state)
    }

    const handleStudentClick = async () => {

        let newQuickViewState = {};
        newQuickViewState["student"] = student;

  
        let history = await axios.get(`${API_URL}/api/kid/v1/transactions/${student?.id}/`,{
            headers: {
                'token' : getToken()
            }
        })
        .then(res => {
            newQuickViewState["transactionHistory"] = res.data.data
        })
        .catch(error => {
            alert(error.response.data.error)
            return error.response.data
        });
  
        Promise.all([history]).then((values) => {
          setQuickViewState(newQuickViewState);
        });
    };

  return (
    <>
        <Header title="Pay in Full" icon={student.logo} openQuickView={()=>openQuickView()} />
        <div className={`payment ${confirmationDialog ? 'open-modal' : ''}`}>
            <div className='wrapper container'>
                {!loader && <div className='content-container'>

                    <StudentDetails
                        name={student.name}
                        id={student.prn}
                        grade={student.course}
                        school={student.college}
                    />

                    <div className='heading'>Fee Summary</div>

                    <Pair 
                        radius={'1rem'}
                        bgColor={'#5654BF'}
                        keyname={'Total Amount :'}
                        value={`₹ ${amount}`}
                        style={{margin: installments.length > 0 ? '' : '1rem 0'}}
                    />
                    
                    <div style={{height: '2rem'}}></div>
                        <Table list={installments}/>
                        <SmallTable list={installments}/>
                    <div style={{height: '2rem'}}></div>

                </div>}

                {!loader && <div className='button-container'>
                    <Button 
                        text='Proceed' 
                        handleClick={handleProceed}
                        classes={`small-wrapper button-small button-primary ${amount > 0 ? '': 'disabled'}`}
                        align='flex-end'
                    />
                </div>}
                {loader && 
                    <div className="credenc-loader" style={{background: 'none'}}>
                        <TailSpin color="#00BFFF" height={100} width={100}/>
                    </div>
                }
            </div>
        </div>
        {confirmationDialog && <Modal 
            data={modalData} 
            handleSubmit={handleProceedAndPay}
            handleClose={closeModal}
        />}
        {
            quickView &&
            <QuickViewModal 
                 closeQuickView={()=>closeQuickView()}
                 quickView={quickView}
                 quickViewState={quickViewState}
                 handleCollapsibleDownload={(item)=>downloadCollapsiblePdf(item)}
            />
        }
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
