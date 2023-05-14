import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { TailSpin } from 'react-loader-spinner';
import useScript from '../../hooks/useScript';
import { getToken } from '../../services/authService';
import Button from '../elementalComponents/button/Button';
import Modal from '../elementalComponents/modal/Modal';
import Pair from '../elementalComponents/pair/Pair';
import SmallTable from '../elementalComponents/smallTable/SmallTable';
import StudentDetails from '../elementalComponents/studentDetails/StudentDetails';

export default function Payment() {

  const [installments, setInstallments] = useState([]);
  const [student, setStudent] = useState({});
  const [amount, setAmount] = useState(0);

  const [studentCollapsed, setStudentCollapsed] = useState(true);

  const [loader, setLoader] = useState(false);

  const [modalData, setModalData] = useState({});
  const [confirmationDialog, setConfirmationDialog] = useState(false);

  const [easebuzzCheckout, setEasebuzzCheckout] = useState(null);

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
    installments.forEach((installment) => {
        amount += parseFloat(installment['amount']) + parseFloat(installment['penalty']);
    })

    setAmount(amount);
}, [installments])

useEffect(async () => {
    setLoader(true);
    const data = await getData();
    setStudent(data.student);

    data.data.forEach((installment, i) => {

        if(installment['status'] !== 'due' && installment['status'] !== 'overdue'){
            data.data[i]['is_mandatory'] = false;
        } else {
            data.data[i]['is_mandatory'] = true;
        }

    });

    setInstallments(data.data);
    setLoader(false);

    useScript('https://ebz-static.s3.ap-south-1.amazonaws.com/easecheckout/easebuzz-checkout.js', () => {
        setEasebuzzCheckout(new EasebuzzCheckout("7ITASSQJE1", 'prod'));
    });

}, [])

  return (
    <>
        <div className={`payment ${confirmationDialog ? 'open-modal' : ''}`}>
            <div className='wrapper container'>
                {!loader && <div className='content-container'>

                    <StudentDetails
                        name={student.name}
                        id={student.id}
                        grade={student.course}
                        school={student.college}
                    />

                    <div className='heading'>Fee Summary</div>

                    <Pair 
                        radius={'1rem'}
                        bgColor={'#5654BF'}
                        keyname={'Total Amount :'}
                        value={`₹ ${amount}`}
                    />
                    
                    <SmallTable list={installments} dependent={!studentCollapsed}/>
                </div>}

                {!loader && <div className='button-container'>
                    <Button 
                        text='Proceed' 
                        handleClick={handleProceed}
                        classes={`small-wrapper button-small button-primary ${amount > 0 ? '': 'disabled'}`}/>
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
