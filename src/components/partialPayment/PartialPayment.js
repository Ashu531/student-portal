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
import { delay, getToken, logoutUser } from '../../services/authService';
import Pair from '../elementalComponents/pair/Pair';
import PaymentOption from '../elementalComponents/paymentOption/PaymentOption';
import moneyIcon from '../../assets/money-icon.svg';
import handCoinsIcon from '../../assets/hand-coins.svg';
import coinsIcon from '../../assets/coins.svg';
import CurrencyEthIcon from '../../assets/currency-eth.svg';
import StudentDetails from '../elementalComponents/studentDetails/StudentDetails';
import Header from '../elementalComponents/header/Header';

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
        const data = await axios.get(`${API_URL}/api/kid/v1/school/installments/${getToken()}/`)
        .then(res => res.data)
        .catch(error => error.response.data);

        return data;
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
        return await axios.post(`${API_URL}/api/kid/v1/log/${modalData.logNumber}/`, JSON.stringify(res))
        .catch(err => err);
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
                        navigate('/success', {
                            state: {
                                ...response, 
                                'installmentsFrontend': installments.filter(installment => installment.is_mandatory === 'True' || installment.is_mandatory === true),
                                'studentFrontend': {...student}
                            }
                        });
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


    useEffect(() => {
        if(!confirmationDialog)  {
            setModalData({});
        }
    }, [confirmationDialog])

    useEffect(() => {
        let amount = 0;
        let pendingAmount = 0;
        installments.forEach((installment) => {
            if(installment['is_mandatory'] === 'True' || installment['is_mandatory'] === true){
                amount += parseFloat(installment['amount']) + parseFloat(installment['penalty']);
            }
        })

        setAmount(amount);
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

            data.data[i]['is_mandatory'] = false;

        });

        const installments = data.data.filter(installment => installment['status'] != 'paid' )

        setInstallments(installments);
        setLoader(false);

        useScript('https://ebz-static.s3.ap-south-1.amazonaws.com/easecheckout/easebuzz-checkout.js', () => {
            setEasebuzzCheckout(new EasebuzzCheckout("7ITASSQJE1", 'prod'));
        });

    }, [])

    return (
        <>
        <Header title="Pay Individually" icon={student.logo} />
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
        </>
    )
}
