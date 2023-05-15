import React, { useState, useEffect } from 'react';
import Button from '../elementalComponents/button/Button';
import logo from '../../assets/credenc-logo.svg';
import Table from '../elementalComponents/table/Table';
import Modal from '../elementalComponents/modal/Modal';
import background from '../../assets/background.png';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Collapsible from '../elementalComponents/collapsible/Collapsible';
import SmallTable from '../elementalComponents/smallTable/SmallTable';
import useScript from '../../hooks/useScript';
import { Bars, TailSpin } from 'react-loader-spinner';
import { delay, getStudents, getToken, logoutUser, saveToken } from '../../services/authService';
import Pair from '../elementalComponents/pair/Pair';
import PaymentOption from '../elementalComponents/paymentOption/PaymentOption';
import moneyIcon from '../../assets/money-icon.svg';
import handCoinsIcon from '../../assets/hand-coins.svg';
import coinsIcon from '../../assets/coins.svg';
import CurrencyEthIcon from '../../assets/currency-eth.svg';
import StudentDetails from '../elementalComponents/studentDetails/StudentDetails';
import Header from '../elementalComponents/header/Header';

export default function Home() {

    const [token, setToken] = useState('');
    const navigate = useNavigate();

    const [installments, setInstallments] = useState([]);
    const [student, setStudent] = useState({});
    const [students, setStudents] = useState([]);

    const [selectAll, setSelectAll] = useState(false);

    const [amount, setAmount] = useState(0);

    const [pendingAmount, setPendingAmount] = useState(0);

    const [confirmationDialog, setConfirmationDialog] = useState(false);

    const [studentCollapsed, setStudentCollapsed] = useState(true);

    const [modalData, setModalData] = useState({});

    const [easebuzzCheckout, setEasebuzzCheckout] = useState(null);

    const [loader, setLoader] = useState(false);

    const logout = async () => {
        const loggedOut = await logoutUser();
        if(loggedOut)
            navigate('/login', {replace: true});
    }

    const getModalData = async () => {
        const {ids, amount} = getSelectedInstallments();
        // console.log(ids, amount);
        const data = await axios.post(`${API_URL}/api/kid/v1/payment/${getToken()}/`, {
            'ids': ids,
            'amount': amount,
        }).then(res => res.data)
        .catch(err => err.response.data);

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
        const data = await axios.get(`${API_URL}/api/kid/v1/installments/${getToken()}/`)
        .then(res => res.data)
        .catch(error => error.response.data);

        return data;
    }

    const handleAmount = (isChecked, i) => {
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
                    if((installment['status'] === 'due' || installment['status'] === 'overdue') && installment['is_mandatory'] !== 'True'){
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

    const closeModal = () => {
        setModalData({});
        setConfirmationDialog(false);
    }

    const logResponse = async (res) => {
        return await axios.post(`${API_URL}/api/kid/v1/log/${modalData.logNumber}/`, JSON.stringify(res))
        .catch(err => err);
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
                        navigate('/success', {
                            state: {
                                ...response, 
                                'installmentsFrontend': installments.filter(installment => installment.is_mandatory === 'True' || installment.is_mandatory === true),
                                'studentFrontend': {...student}
                            }
                        });
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

    useEffect(() => {
        let amount = 0;
        let pendingAmount = 0;
        installments.forEach((installment) => {
            if(installment['is_mandatory'] === 'True' || installment['is_mandatory'] === true){
                amount += parseFloat(installment['amount']) + parseFloat(installment['penalty']);
            }

            pendingAmount += parseFloat(installment['amount']) + parseFloat(installment['penalty']);
        })

        setAmount(amount);
        setPendingAmount(pendingAmount);
    }, [installments])

    useEffect(() => {
        if(token != ''){
            saveToken(token);
            initHome();
        }
    }, [token]);

    const initHome = async () => {
        setLoader(true);
        const data = await getData();
        setStudent(data.student);

        data.data.forEach((installment, i) => {
            if(data.selected){
                const id = data.selected.find(id => id === installment['id']);
                if(id){
                    data.data[i]['is_mandatory'] = 'True';
                }
            }
            if(installment['status'] !== 'due' && installment['status'] !== 'overdue'){
                data.data[i]['is_mandatory'] = false;
            }
        });

        setInstallments(data.data);
        setLoader(false);
    }

    useEffect(() => {

        setStudents([...getStudents()]);
        
        initHome();

        useScript('https://ebz-static.s3.ap-south-1.amazonaws.com/easecheckout/easebuzz-checkout.js', () => {
            setEasebuzzCheckout(new EasebuzzCheckout("7ITASSQJE1", 'prod'));
        });

    }, [])

    const navigateToPaymentPage = () => {
        navigate(`/payment`, {replace: true});
    }

    const navigateToPartialPaymentPage = () => {
        navigate(`/partial-payment`, {replace: true});
    }

    const navigateToAutopay=()=>{
        navigate(`/autopay`, {replace: true});
    }

    const navigateToLoanPage=()=>{
        navigate(`/credenc-loan`, {replace: true});
    }

    return (
        <>
        <Header title="Student Fee Ledger" back={false} />
        <div className={`home ${confirmationDialog ? 'open-modal' : ''}`}>
            <div className='container'>
                {!loader && <div className='content-container'>
                    <Collapsible 
                        students={students}
                        student={student} 
                        collapsed={studentCollapsed}
                        handleClick={() => setStudentCollapsed(!studentCollapsed)}
                        handleStudentClick={(student) => setToken(student.token)}
                    />

                    <StudentDetails 
                        name={student.name}
                        id={student.id}
                        grade={student.course}
                        school={student.college}
                    />

                    <Pair 
                        radius={'1rem'}
                        bgColor={'#5654BF'}
                        keyname={'Pending Fee :'}
                        value={`₹ ${pendingAmount}`}
                    />

                    <div className='heading'>Payment Plans</div>
                    <div className='payment-options-container'>
                        <PaymentOption
                            icon={moneyIcon}
                            heading={'PAY IN FULL'}
                            description={'Pay the whole school fee in one go!'}
                            bgColor={'#A8CFFF'}
                            onClick={navigateToPaymentPage}
                        />
                        <PaymentOption
                            icon={handCoinsIcon}
                            tag={'Recommended'}
                            heading={'PAY WITH CREDENC'}
                            description={'Pay full fee using Credenc loan!'}
                            bgColor={'#FFD45C'}
                            onClick={navigateToLoanPage}
                        />
                        <PaymentOption
                            icon={CurrencyEthIcon}
                            heading={'SET UP AUTO-PAY'}
                            description={'Set up auto-payment at regular intervals!'}
                            bgColor={'#E3FB72'}
                            onClick={navigateToAutopay}
                        />
                        <PaymentOption
                            icon={coinsIcon}
                            heading={'PAY INDIVIDUALLY'}
                            description={'Break up the fees as per your convenience!'}
                            bgColor={'#D6D6FF'}
                            onClick={navigateToPartialPaymentPage}
                        />
                    </div>
                    <div style={{height: '2rem'}}></div>
                    <Table list={installments} selectAll={selectAll}/>
                    <SmallTable list={installments} dependent={!studentCollapsed} showStatus={true}/>
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
        </>
    )
}
