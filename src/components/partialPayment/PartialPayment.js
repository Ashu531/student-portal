import React, { useState, useEffect } from 'react';
import Button from '../elementalComponents/button/Button';
import Table from '../elementalComponents/table/Table';
import Modal from '../elementalComponents/modal/Modal';
import { useNavigate } from 'react-router-dom';
import SmallTable from '../elementalComponents/smallTable/SmallTable';
import useScript from '../../hooks/useScript';
import { TailSpin } from 'react-loader-spinner';
import { getToken, logoutUser } from '../../services/authService';
import Pair from '../elementalComponents/pair/Pair';
import StudentDetails from '../elementalComponents/studentDetails/StudentDetails';
import Header from '../elementalComponents/header/Header';
import QuickViewModal from '../elementalComponents/quickViewModal/QuickViewModal';
import { downloadTransaction } from '../../services/dowmloadTransaction';
import { apiRequest } from '../../services/apiRequest';
import html2pdf from 'html2pdf.js';

export default function PartialPayment() {

    const navigate = useNavigate();

    const [installments, setInstallments] = useState([]);
    const [student, setStudent] = useState({});

    const [selectAll, setSelectAll] = useState(false);

    const [amount, setAmount] = useState(0);

    const [pendingAmount, setPendingAmount] = useState(0);

    const [confirmationDialog, setConfirmationDialog] = useState(false);

    const [studentCollapsed, setStudentCollapsed] = useState(true);

    const [modalData, setModalData] = useState({});

    const [easebuzzCheckout, setEasebuzzCheckout] = useState(null);

    const [loader, setLoader] = useState(false);

    const [quickView,setQuickView] = useState(false);

    const [quickViewState,setQuickViewState] = useState(false);

    const logout = async () => {
        const loggedOut = await logoutUser();
        if(loggedOut)
            navigate('/login', {replace: true});
    }

    const getModalData = async () => {
        const {ids, amount} = getSelectedInstallments();

        let res;
        await apiRequest({
            url: `/api/kid/v1/payment/${getToken()}/`,
            method: 'POST',
            data: {
                'ids': ids,
                'amount': amount,
            },
            onSuccess: async (data) => {
                res = data;
            },
            onError: (response) => {
                alert(response.data.error)
                res = response.data
            }
        })

        return res;
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

        let res;
        await apiRequest({
            url: `/api/kid/v1/school/installments/${getToken()}/`,
            method: 'GET',
            onSuccess: async (data) => {
                res = data;
            },
            onError: (response) => {
                alert(response.data.error)
                res = response.data
            }
        })

        return res;
    }

    const handleAmount = (isChecked, i) => {
        console.log(isChecked, i)
        if(i != -1){
            let installmentList = [...installments];
            installmentList[i]['is_mandatory'] = isChecked;
            setInstallments(installmentList);

            let newAmount = amount;
            if(isChecked){
                newAmount += parseFloat(installments[i]['amount']) + parseFloat(installments[i]['penalty']);
            } else {
                newAmount -= parseFloat(installments[i]['amount']) + parseFloat(installments[i]['penalty']);
                setSelectAll(isChecked);
            }
            setAmount(newAmount);
        } else {
            if(isChecked){
                setSelectAll(isChecked);

                let installmentList = [...installments];
                let amount = 0;
                installmentList.forEach((installment) => {
                    if((installment['status'] === 'due' || installment['status'] === 'overdue' || installment['status'] === 'upcoming') && installment['is_mandatory'] !== 'True'){
                        installment['is_mandatory'] = isChecked;
                        amount += parseFloat(installment['amount']) + parseFloat(installment['penalty']);
                    }
                });

                setInstallments(installmentList);
                setAmount(amount);
                
            } else {
                setSelectAll(isChecked);

                let amount = 0;
                setAmount(amount);

                let installmentList = [...installments];
                installmentList.forEach((installment) => {
                    if(installment['is_mandatory'] !== 'True')
                        installment['is_mandatory'] = isChecked;
                });

                setInstallments(installmentList);
            }
        }
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

        await apiRequest({
            url: `/api/kid/v1/log/${modalData.logNumber}/`,
            method: 'POST',
            data: JSON.stringify(res),
            onSuccess: async (data) => {},
            onError: (response) => {
                alert(response.data.error);
            }
        })
    }

    const handleProceedAndPay = async () => {
            let options = {
                access_key: modalData.key, // access key received via Initiate Payment
                onResponse: (response) => {
                    if(!response || !response.status){
                        logResponse(response);
                        closeModal();
                        alert(`some error occurred!`);
                    } else if(response.status && response.status.toLowerCase() === 'success'){
                        logResponse(response);
                        closeModal();
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
                        closeModal();
                        alert(response.error_Message);
                        closeModal();
                    } else if(response.status){
                        logResponse(response);
                        closeModal();
                        alert(`transaction cancelled!`);
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

        await apiRequest({
            url: `/api/kid/v1/payment_success_response/${getToken()}/`,
            method: 'POST',
            data: detail,
            onSuccess: async (data) => {},
            onError: (response) => {
                alert(response.data.error)
            }
        })
     
     }


    useEffect(() => {
        if(!confirmationDialog)  {
            setModalData({});
        }
    }, [confirmationDialog])

    useEffect(() => {
        let amount = 0;
        installments.forEach((installment) => {
            if(installment['is_mandatory'] === 'True' || installment['is_mandatory'] === true){
                amount += parseFloat(installment['amount']) + parseFloat(installment['penalty']);
            }
        })

        setAmount(amount.toFixed(2));
    }, [installments])

    useEffect(async () => {
        setLoader(true);
        const data = await getData();
        
        setStudent(data.student);

        data.data.forEach((installment, i) => {

            data.data[i]['is_mandatory'] = false;

        });

        const installments = data.data.filter(installment => installment['status'] != 'paid' && installment['enach_status'] != 'payment_in_progress')

        setInstallments(installments);
        setLoader(false);

        useScript('https://ebz-static.s3.ap-south-1.amazonaws.com/easecheckout/easebuzz-checkout.js', () => {
            setEasebuzzCheckout(new EasebuzzCheckout("7ITASSQJE1", 'prod'));
        });

    }, [])

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
            token : getToken(),
            onSuccess: async (data) => {
                newQuickViewState["transactionHistory"] = data.data;
                setQuickViewState(newQuickViewState);
            },
            onError: (response) => {
                alert(response.data.error)
            }
        })
    };

    return (
        <>
        <Header title="Pay Individually" icon={student.logo} openQuickView={()=>openQuickView()} />
        <div className={`partial-payment ${confirmationDialog ? 'open-modal' : ''}`}>
            <div className='wrapper container'>
                {!loader && <div className='content-container'>
                    
                    <StudentDetails 
                        name={student.name}
                        id={student.prn}
                        grade={student.course}
                        school={student.college}
                    />

                    <div className='heading'>Select Fees</div>

                    <Pair 
                        radius={'1rem'}
                        bgColor={'#5654BF'}
                        keyname={'Selected Amount :'}
                        value={`₹ ${amount}`}
                        style={{margin: installments.length > 0 ? '' : '1rem 0'}}
                    />
                    
                    <div style={{height: '2rem'}}></div>
                        <Table list={installments} handleCheckBox={handleAmount} selectAll={selectAll}/>
                        <SmallTable list={installments} handleCheckBox={handleAmount}/>
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

        </>
    )
}
