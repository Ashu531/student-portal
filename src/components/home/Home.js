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

export default function Home() {

    let { id, phone } = useParams();

    const [installments, setInstallments] = useState([
        {amount: "12000.0", due_date: "2022-01-20", expire_date: "2022-01-20", id: 25488, is_mandatory: "True", name: "sem1", penalty: 0, start_date: "2022-01-13", status: "overdue"},
        {amount: "12000.0", due_date: "2022-01-20", expire_date: "2022-01-20", id: 25488, is_mandatory: "True", name: "sem1", penalty: 0, start_date: "2022-01-13", status: "overdue"},
        {amount: "12000.0", due_date: "2022-01-20", expire_date: "2022-01-20", id: 25488, is_mandatory: "True", name: "sem1", penalty: 0, start_date: "2022-01-13", status: "due"},
        {amount: "12000.0", due_date: "2022-01-20", expire_date: "2022-01-20", id: 25488, is_mandatory: "True", name: "sem1", penalty: 0, start_date: "2022-01-13", status: "due"},
        {amount: "12000.0", due_date: "2022-01-20", expire_date: "2022-01-20", id: 25488, is_mandatory: "True", name: "sem1", penalty: 0, start_date: "2022-01-13", status: "paid"},
        {amount: "12000.0", due_date: "2022-01-20", expire_date: "2022-01-20", id: 25488, is_mandatory: "True", name: "sem1", penalty: 0, start_date: "2022-01-13", status: "paid"} 
    ]);
    const [student, setStudent] = useState({});

    const [selectAll, setSelectAll] = useState(false);

    const [amount, setAmount] = useState(0);

    const [confirmationDialog, setConfirmationDialog] = useState(false);

    const [studentCollapsed, setStudentCollapsed] = useState(true);

    const getModalData = () => {
        return {
            'name': student.name,
            'email': student.email,
            'phone': phone,
            'amount': amount
        }
    }

    const getData = async () => {
        const data = await axios.get(`${API_URL}/api/kid/v1/installments/${id}/`)
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

    const handleProceed = () => {
        if(amount > 0){
            setConfirmationDialog(true);
        }else{
            setConfirmationDialog(false);
        }
    }

    const handleProceedAndPay = () => {
        console.log('successful');
    }

    const closeModel = () => {
        setConfirmationDialog(false);
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
        console.log(student);
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
            data={getModalData()} 
            handleSubmit={handleProceedAndPay}
            handleClose={closeModel}
        />}
        </>
    )
}
