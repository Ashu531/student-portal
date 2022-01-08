import React, { useState, useEffect } from 'react';
import Button from '../elementalComponents/button/Button';
import logo from '../../assets/credenc-logo-big.png';
import collegeLogo from '../../assets/credenc-text-logo.png';
import Table from '../elementalComponents/table/Table';
import Modal from '../elementalComponents/modal/Modal';

export default function Home() {

    const [installments, setInstallments] = useState([
        {'name': 'Installment Name', 'amount': 10000, 'penalty': 1000, 'start_date': '2021 Jan 16', 'due_date': '2021 Jan 16', 'end_date': '2021 Jan 16', 'status': 'overdue', 'is_selected': false},
        {'name': 'Installment Name', 'amount': 10000, 'penalty': 1000, 'start_date': '2021 Jan 16', 'due_date': '2021 Jan 16', 'end_date': '2021 Jan 16', 'status': 'due', 'is_selected': false},
        {'name': 'Installment Name', 'amount': 10000, 'penalty': 1000, 'start_date': '2021 Jan 16', 'due_date': '2021 Jan 16', 'end_date': '2021 Jan 16', 'status': 'due', 'is_selected': false},
        {'name': 'Installment Name', 'amount': 10000, 'penalty': 1000, 'start_date': '2021 Jan 16', 'due_date': '2021 Jan 16', 'end_date': '2021 Jan 16', 'status': 'paid', 'is_selected': false},
        {'name': 'Installment Name', 'amount': 10000, 'penalty': 1000, 'start_date': '2021 Jan 16', 'due_date': '2021 Jan 16', 'end_date': '2021 Jan 16', 'status': 'overdue', 'is_selected': false},
        {'name': 'Installment Name', 'amount': 10000, 'penalty': 1000, 'start_date': '2021 Jan 16', 'due_date': '2021 Jan 16', 'end_date': '2021 Jan 16', 'status': 'due', 'is_selected': false},
    ]);

    const [selectAll, setSelectAll] = useState(false);

    const [amount, setAmount] = useState(0);

    const [confirmationDialog, setConfirmationDialog] = useState(false);

    const getModalData = () => {
        return {
            'name': 'John Doe',
            'email': 'johndoe@gmail.com',
            'phone': '9876543210',
            'amount': amount
        }
    }

    const handleAmount = (isChecked, i) => {
        if(i != -1){
            let installmentList = [...installments];
            installmentList[i]['is_selected'] = isChecked;
            setInstallments(installmentList);

            let newAmount = amount;
            if(isChecked){
                newAmount += installments[i]['amount'] + installments[i]['penalty'];
            } else {
                newAmount -= installments[i]['amount'] + installments[i]['penalty'];
                setSelectAll(isChecked);
            }
            setAmount(newAmount);
        } else {
            if(isChecked){
                setSelectAll(isChecked);

                let installmentList = [...installments];
                let amount = 0;
                installmentList.forEach((installment) => {
                    installment['is_selected'] = isChecked;
                    amount += installment['amount'] + installment['penalty'];
                });

                setInstallments(installmentList);
                setAmount(amount);
                
            } else {
                setSelectAll(isChecked);

                let amount = 0;
                setAmount(amount);

                let installmentList = [...installments];
                installmentList.forEach((installment) => {
                    installment['is_selected'] = isChecked;
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

    return (
        <>
        <div className={`home ${confirmationDialog ? 'open-modal' : ''}`}>
            <div className='container'>
                <div className='content-container'>
                    <div className='header-container'>
                        <div className='header'>
                            <div className='title'>Select Installments</div>
                            <div className='subtitle'>Select the installment you want to pay</div>
                        </div>
                        <img src={logo} className='logo'/>
                    </div>
                    <div className='header-container sub-header-container'>
                        <div className='college-container'>
                            <img src={collegeLogo} className='college-logo'/>
                            <div className='mini-header grow'>
                                <div className='subtitle'>College</div>
                                <div className='title'>Durham College</div>
                            </div>
                            <div className='mini-header'>
                                <div className='subtitle'>Name</div>
                                <div className='title'>John Doe</div>
                            </div>
                            <div className='mini-header'>
                                <div className='subtitle'>Course</div>
                                <div className='title'>Btech-ECE</div>
                            </div>
                            <div className='mini-header'>
                                <div className='subtitle'>Unique ID</div>
                                <div className='title'>ABC1234</div>
                            </div>
                        </div>
                    </div>
                    <Table list={installments} handleCheckBox={handleAmount} selectAll={selectAll}/>
                </div>
                <div className='button-container'>
                    <Button text='Proceed' handleClick={handleProceed}/>
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
