import React, { useState, useEffect } from 'react';
import Button from '../elementalComponents/button/Button';
import logo from '../../assets/credenc-logo.svg';
import logo2 from '../../assets/credenc-text-logo.png';
import Table from '../elementalComponents/table/Table';
import Modal from '../elementalComponents/modal/Modal';
import background from '../../assets/background.png';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Collapsible from '../elementalComponents/collapsible/Collapsible';
import SmallTable from '../elementalComponents/smallTable/SmallTable';
import useScript from '../../hooks/useScript';

export default function Home() {

    let { token } = useParams();

    const [installments, setInstallments] = useState([]);
    const [student, setStudent] = useState({});

    const [selectAll, setSelectAll] = useState(false);

    const [amount, setAmount] = useState(0);

    const [confirmationDialog, setConfirmationDialog] = useState(false);

    const [studentCollapsed, setStudentCollapsed] = useState(true);

    const [modalData, setModalData] = useState({});

    const [easebuzzCheckout, setEasebuzzCheckout] = useState(null);

    const getModalData = async () => {
        const {ids, amount} = getSelectedInstallments();
        console.log(ids, amount);
        const data = await axios.post(`${API_URL}/api/kid/v1/payment/${token}/`, {
            'ids': ids,
            'amount': amount,
        }).then(res => res.data)
        .catch(err => console.log(err));

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
        const data = await axios.get(`${API_URL}/api/kid/v1/installments/${token}/`)
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
                    installment['is_mandatory'] = isChecked;
                    amount += parseFloat(installment['amount']) + parseFloat(installment['penalty']);
                });

                setInstallments(installmentList);
                setAmount(amount);
                
            } else {
                setSelectAll(isChecked);

                let amount = 0;
                setAmount(amount);

                let installmentList = [...installments];
                installmentList.forEach((installment) => {
                    installment['is_mandatory'] = isChecked;
                });

                setInstallments(installmentList);
            }
        }
    }

    const handleProceed = async () => {
        if(amount > 0){
            const {student, data} = await getModalData();
            setModalData({
                'student': student,
                'key': data,
                'amount': amount
            });
            setConfirmationDialog(true);
        }else{
            setConfirmationDialog(false);
        }
    }

    const closeModel = () => {
        setConfirmationDialog(false);
    }

    const handleProceedAndPay = () => {
        let options = {
            access_key: modalData.key, // access key received via Initiate Payment
            onResponse: (response) => {
                console.log(response);
            },
            theme: "#4530B1" // color hex
        }
        if(easebuzzCheckout)
            easebuzzCheckout.initiatePayment(options);
    }

    useEffect(() => {
        console.log(amount);
    }, [amount])

    useEffect(() => {
        let amount = 0;
        installments.forEach((installment) => {
            if(installment['is_mandatory']){
                amount += parseFloat(installment['amount']) + parseFloat(installment['penalty']);
            }
        })

        setAmount(amount)
    }, [installments])

    useEffect(async () => {
        const data = await getData();
        // setInstallments(data.data);
        setStudent(data.student);
        setInstallments(data.data);
        console.log(student);

        useScript('https://ebz-static.s3.ap-south-1.amazonaws.com/easecheckout/easebuzz-checkout.js', () => {
            setEasebuzzCheckout(new EasebuzzCheckout("7ITASSQJE1", 'prod'));
        });

    }, [])

    return (
        <>
        <div className={`home ${confirmationDialog ? 'open-modal' : ''}`} style={{backgroundImage: `url(${background})`}}>
            <div className='wrapper container'>
                <div className='content-container'>
                    <div className='logo-container'>
                        <img src={logo} className='header-logo-small'/>
                        <img src={`data:image/png;base64,${student.logo}`} className='header-logo'/>
                    </div>
                    <div className='header-container'>
                        <div className='header'>
                            <div className='title'>Select Installments</div>
                            <div className='subtitle'>Select the installment you want to pay</div>
                        </div>
                        <img src={logo} className='logo'/>
                    </div>
                    <div className='sub-header-container'>
                        <div className='college-container'>
                            <img src={`data:image/png;base64,${student.logo}`} className='college-logo'/>
                            <div className='mini-header grow'>
                                <div className='subtitle'>College</div>
                                <div className='title'>{student.college}</div>
                            </div>
                            <div className='mini-header'>
                                <div className='subtitle'>Name</div>
                                <div className='title'>{student.name}</div>
                            </div>
                            <div className='mini-header'>
                                <div className='subtitle'>Course</div>
                                <div className='title'>{student.course}</div>
                            </div>
                            <div className='mini-header'>
                                <div className='subtitle'>Unique ID</div>
                                <div className='title'>{student.id}</div>
                            </div>
                        </div>
                    </div>
                    <Table list={installments} handleCheckBox={handleAmount} selectAll={selectAll}/>
                    <Collapsible 
                        student={student} 
                        collapsed={studentCollapsed}
                        handleClick={() => setStudentCollapsed(!studentCollapsed)}/>
                    <SmallTable list={installments} handleCheckBox={handleAmount} dependent={!studentCollapsed}/>
                </div>
                <div className='button-container'>
                    <Button 
                        text='Proceed' 
                        handleClick={handleProceed}
                        classes='small-wrapper button-small button-primary'/>
                </div>
            </div>
        </div>
        {confirmationDialog && <Modal 
            data={modalData} 
            handleSubmit={handleProceedAndPay}
            handleClose={closeModel}
        />}
        </>
    )
}
