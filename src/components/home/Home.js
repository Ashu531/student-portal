import React, { useState, useEffect } from 'react';
import Button from '../elementalComponents/button/Button';
import logo from '../../assets/credenc-logo.svg';
import Table from '../elementalComponents/table/Table';
import Modal from '../elementalComponents/modal/Modal';
import background from '../../assets/background.png';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
import Steps from '../elementalComponents/steps/Steps';
import ConfirmationModal from '../elementalComponents/confirmationModal/ConfirmModal';
import DetailBanner from '../elementalComponents/detailBanner/DetailBanner';
import {ChatWidget} from "@papercups-io/chat-widget";
import CredencLoanModal from '../elementalComponents/loanModal/LoanModal';
import LoanSuccess from '../elementalComponents/loan-success/LoanSuccess';

export default function Home() {

    const [token, setToken] = useState('');
    const navigate = useNavigate();

    const [installments, setInstallments] = useState([]);
    const [adhocInstallments, setAdhocInstallments] = useState([]);

    const [paymentPlans, setPaymentPlans] = useState([]);

    
    const [student, setStudent] = useState({});
    const [students, setStudents] = useState([]);

    const [selectAll, setSelectAll] = useState(false);

    const [amount, setAmount] = useState(0);
    const [adhocAmount, setAdhocAmount] = useState(0);

    const [pendingAmount, setPendingAmount] = useState(0);

    const [confirmationDialog, setConfirmationDialog] = useState(false);

    const [studentCollapsed, setStudentCollapsed] = useState(true);

    const [modalData, setModalData] = useState({});

    const [easebuzzCheckout, setEasebuzzCheckout] = useState(null);
    const [dashboardType,setDashboardType] = useState({})

    const [nonPaidStatus,setNonPaidStatus] = useState(false)

    const [applicationStatus, setApplicationStatus] = useState(false)

    const [noAcademicFeeState,setNoAcademicFeeState] = useState(false)

    const [confirmModalData,setConfirmModalData] = useState({
        title: '',
        subHeading: '',
        description: '',
        buttonText:'',
        successImage: false,
        type: 2
   })

    const [autopayDetails,setAutopayDetails] = useState(false)

    const [credencLoanModal,setCredencLoanModal] = useState(false)

    const [loader, setLoader] = useState(false);

    const [loanSuccess,setLoanSuccess] = useState(false)

    const [loanData,setLoanData] = useState(false)

    const [instituteLogo,setInstituteLogo] = useState('')

    const logout = async () => {
        const loggedOut = await logoutUser();
        if(loggedOut)
            navigate('/login', {replace: true});
    }

    const getData = async () => {
        const data = await axios.get(`${API_URL}/api/kid/v1/school/installments/${getToken()}/`)
        .then(res => res.data)
        .catch(error => {
            alert(error.response.data.error)
            return error.response.data
        });

        return data;
    }

    const getSelectedInstallments = () => {
        const selectedInstallments = adhocInstallments.filter(installment => installment.is_mandatory === 'True' || installment.is_mandatory === true);
        const selectedids = selectedInstallments.map(installment => installment.id);
        return {
            'ids': selectedids,
            'amount': adhocAmount
        }
    }

    const getModalData = async () => {
        const {ids, amount} = getSelectedInstallments();
        // console.log(ids, amount);
        const data = await axios.post(`${API_URL}/api/kid/v1/payment/${getToken()}/`, {
            'ids': ids,
            'amount': amount,
        }).then(res => res.data)
        .catch(err => alert(error.response.data.error));

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
                'amount': adhocAmount,
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

    const handleAmount = (isChecked, i) => {
        if(i != -1){
            let installmentList = [...adhocInstallments];
            installmentList[i]['is_mandatory'] = isChecked;
            setAdhocInstallments(installmentList);

            let newAmount = amount;
            if(isChecked){
                newAmount += parseFloat(adhocInstallments[i]['amount']) + parseFloat(adhocInstallments[i]['penalty']);
            } else {
                newAmount -= parseFloat(adhocInstallments[i]['amount']) + parseFloat(adhocInstallments[i]['penalty']);
                setSelectAll(isChecked);
            }
            setAdhocAmount(newAmount.toFixed(2));
        } else {
            if(isChecked){
                setSelectAll(isChecked);

                let installmentList = [...adhocInstallments];
                let amount = 0;
                installmentList.forEach((installment) => {
                    if((installment['status'] === 'due' || installment['status'] === 'overdue' || installment['status'] === 'upcoming') && installment['is_mandatory'] !== 'True'){
                        installment['is_mandatory'] = isChecked;
                        amount += parseFloat(installment['amount']) + parseFloat(installment['penalty']);
                    }
                });

                setAdhocInstallments(installmentList);
                setAdhocAmount(amount.toFixed(2));
                
            } else {
                setSelectAll(isChecked);

                let amount = 0;
                setAdhocAmount(amount.toFixed(2));

                let installmentList = [...adhocInstallments];
                installmentList.forEach((installment) => {
                    if(installment['is_mandatory'] !== 'True')
                        installment['is_mandatory'] = isChecked;
                });

                setAdhocInstallments(installmentList);
            }
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
                        alert(`some error occurred!`);
                    } else if(response.status && response.status.toLowerCase() === 'success'){
                        logResponse(response);
                        navigate('/success', {
                            state: {
                                ...response, 
                                'installmentsFrontend': adhocInstallments.filter(installment => installment.is_mandatory === 'True' || installment.is_mandatory === true),
                                'studentFrontend': {...student},
                                'instituteLogo': instituteLogo
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
        if(!confirmationDialog)  {
            setModalData({});
        }
    }, [confirmationDialog])

    useEffect(() => {
        let amount = 0;
        let pendingAmount = 0;

        if(installments.length === 0){
            setNoAcademicFeeState(true)
        }else{
            setNoAcademicFeeState(false)
        }

        installments.forEach((installment) => {
            if(installment['is_mandatory'] === 'True' || installment['is_mandatory'] === true){
                amount += parseFloat(installment['amount']) + parseFloat(installment['penalty']);
            }

            if(installment['status'] !== 'paid'){
                pendingAmount += parseFloat(installment['amount']) + parseFloat(installment['penalty']);
            }
        })

        setAmount(amount.toFixed(2));
        setPendingAmount(pendingAmount.toFixed(2));
    }, [installments])

    useEffect(() => {
        let amount = 0;
        adhocInstallments.forEach((installment) => {
            if(installment['is_mandatory'] === 'True' || installment['is_mandatory'] === true){
                amount += parseFloat(installment['amount']) + parseFloat(installment['penalty']);
            }
        })

        setAdhocAmount(amount.toFixed(2));
    }, [adhocInstallments])

    useEffect(() => {
        if(token != ''){
            saveToken(token);
            initHome();
            window.history.replaceState(null, "", `/installments/${token}`)
        }
    }, [token]);

    const initHome = async () => {
        setLoader(true);
        const data = await getData();
        if(data.status_code === 401){
            await logout();
            return;
        }else{
            setStudent(data.student);
            setInstituteLogo(data.student.logo)
        }

        setDashboardType(data.dashboard_type)
        let status = data.dashboard_type.banner
        setApplicationStatus(status)

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

        data.adhoc.forEach((installment, i) => {
            if(installment['is_mandatory'] !== 'True'){
                data.adhoc[i]['is_mandatory'] = false;
            }
        });
        setAdhocInstallments(data.adhoc);
        getAdhocData(data.data)

        setPaymentPlans(data.plans);

        setLoader(false);
    }

    useEffect(() => {

        setStudents([...getStudents()]);
        
        initHome();

        useScript('https://ebz-static.s3.ap-south-1.amazonaws.com/easecheckout/easebuzz-checkout.js', () => {
            setEasebuzzCheckout(new EasebuzzCheckout("7ITASSQJE1", 'prod'));
        });

    }, [])

    const getAdhocData=(data)=>{
        data.forEach((item,index)=>{
            if(item.status != 'paid'){
                setNonPaidStatus(true)
            }
        })
    }

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
        setCredencLoanModal(true)
        // navigate(`/credenc-loan`, {replace: true});
    }

    const openCancellationModal=()=>{
        setConfirmModalData({
            title: 'Loan Application Cancellation',
            subHeading: 'Are you sure you want to cancel your loan application with Credenc?',
            description: 'Once this action is performed, you will have to pay all pending fee using other payment methods or apply for loan again.',
            buttonText: 'Yes, cancel my Loan.',
            successImage: false,
            handleSubmit: cancelLoan,
            type: 1
        })
        setApplicationStatus(true)
    }

    const cancelLoan=async()=>{
        
        await axios.post(`${API_URL}/api/kid/v1/loan/cancel/${getToken()}/`, {
            application_id: dashboardType.application_id
        }).then(res => {
            closeConfirmModal()
        }).catch(err => {
            alert(err.response.data.error)
            closeConfirmModal()
        });
    }

    const closeConfirmModal=()=>{
        setApplicationStatus(false)
        initHome()
    }

    useEffect(()=>{
        if(dashboardType.name === 'loan'){
            setConfirmModalData({
                title: 'Loan Application Rejected',
                subHeading: 'Your loan application was denied for fee payment. Apply for a loan again or try paying with other available payment methods.',
                description: `To know more about your loan application contact us on help@credenc.com`,
                buttonText: 'Go to Dashboard',
                successImage: false,
                handleSubmit: bannerCancellation,
                type: 1
            })
        }else if(dashboardType.name === 'autopay'){
            if(dashboardType.status === 'setup_done'){
                setConfirmModalData({
                    title: 'Auto-Pay Set up Successful!',
                    buttonText: 'Back to Dashboard',
                    successImage: true,
                    handleSubmit: bannerCancellation,
                    type: 2
                })
            }else if(dashboardType.status === 'setup_cancel'){
                setConfirmModalData({
                    title: 'Auto-Pay Set up Unsuccessful',
                    subHeading: 'Your auto-pay has not been set up. Try again! ',
                    buttonText: 'Back to Dashboard',
                    successImage: false,
                    handleSubmit: bannerCancellation,
                    type: 2
                })
            }
            else if(dashboardType.status === 'initiated'){
                setConfirmModalData({
                    title: 'Auto-Pay Initiation Unsuccessful',
                    subHeading: 'Your auto-pay has not been set up. Try again! ',
                    buttonText: 'Back to Dashboard',
                    successImage: false,
                    handleSubmit: bannerCancellation,
                    type: 1
                })
            }
            
        }
        
        setApplicationStatus(dashboardType.banner)

    },[dashboardType.status])

    const bannerCancellation=async()=>{
        await axios.post(`${API_URL}/api/kid/v1/banner/cancel/${getToken()}/`, {
            application_id: dashboardType.application_id,
            type: dashboardType.name
        }).then(res => {
            closeConfirmModal()
        }).catch(err => {
            err.response.data
            closeConfirmModal()
        });
    }

    const handleAutopayModal=()=>{
        let cancelAutopayFlow = true
        let applicationId = dashboardType.application_id
        navigate('/autopay',{
            state: {
                cancelAutopayFlow, 
                applicationId
            }
        })
    }

    const closeConfirmationModal=()=>{
        setApplicationStatus(false)
    }

    const closeLoanModal=()=>{
        setCredencLoanModal(false)
    }

    const applyCredencLoan=async()=>{
        let data = {
            'name': student.name,
            'email': student.email,
            'phone_number': '',
            'relation': 'Self',
            'amount': String(pendingAmount),
            'remark': '',
            'tenure': '',
            'course_name': student.course_id,
            'applicant_name': student.name,
            'college': student.college_id
        }

        await axios.post(`${API_URL}/api/kid/v1/loan/${getToken()}/`, data).then(res => {
            if(res.data.status){
                setLoanData(res.data.data)
                closeLoanModal()
                navigate(`/credenc-loan`, {
                    replace: true,
                    state: res.data.data
                });
            }
        }).catch(err => {
            alert(err.response.data.error)
        });
        
    }

    return (
        <>
        <Header title="Student Fee Ledger" back={false} icon={student?.logo} />
        <div className={`home ${confirmationDialog ? 'open-modal' : ''}`}>
            <div className='container'>
                {!loader && <div className='content-container'>

                    <div className='hideOnDesktop'>
                        <Collapsible 
                            title={'Student'}
                            students={students}
                            student={student} 
                            collapsed={studentCollapsed}
                            handleClick={() => setStudentCollapsed(!studentCollapsed)}
                            handleStudentClick={(student) => setToken(student.token)}
                        />
                    </div>

                    <div className='hideOnMobile'>
                        <div className="student-details" style={{background: '#404040', alignItems: 'flex-start', justifyContent: 'flex-end', padding: '1rem 2rem', position: 'relative', overflow: 'visible'}}>
                            <div className="row">
                                <div className="field" style={{color: '#FFFFFF'}}>Institute</div>
                                <div className="value" style={{color: '#FFFFFF'}}>{student.college}</div>
                            </div>
                            <div style={{position: 'absolute', left: '0'}}>
                                <Collapsible
                                    title={'Student'}
                                    students={students}
                                    student={student} 
                                    collapsed={studentCollapsed}
                                    handleClick={() => setStudentCollapsed(!studentCollapsed)}
                                    handleStudentClick={(student) => setToken(student.token)}
                                />
                            </div>
                            <div className="row">
                                <div className="field" style={{color: '#FFFFFF'}}>Grade/Course</div>
                                <div className="value" style={{color: '#FFFFFF'}}>{student.course}</div>
                            </div>
                            <div className="row">
                                <div className="field" style={{color: '#FFFFFF'}}>Admission No.</div>
                                <div className="value" style={{color: '#FFFFFF'}}>{student.prn}</div>
                            </div>
                        </div>
                    </div>

                    
                    
                    <div className='hideOnDesktop'>
                        <StudentDetails 
                            name={student.name}
                            id={student.prn}
                            grade={student.course}
                            school={student.college}
                        />
                    </div>                 

                    {adhocInstallments.length > 0 && 
                     <div className='pair-heading tooltip' style={{margin: '1rem 0 0.8rem 0'}}>
                         ADD ON FEE
                         <span style={{ display: 'inline-block', padding: '6px 2px 0 2px', cursor: 'pointer'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M10 1.875C8.39303 1.875 6.82214 2.35152 5.486 3.24431C4.14985 4.1371 3.10844 5.40605 2.49348 6.8907C1.87852 8.37535 1.71762 10.009 2.03112 11.5851C2.34463 13.1612 3.11846 14.6089 4.25476 15.7452C5.39106 16.8815 6.8388 17.6554 8.4149 17.9689C9.99099 18.2824 11.6247 18.1215 13.1093 17.5065C14.594 16.8916 15.8629 15.8502 16.7557 14.514C17.6485 13.1779 18.125 11.607 18.125 10C18.1227 7.84581 17.266 5.78051 15.7427 4.25727C14.2195 2.73403 12.1542 1.87727 10 1.875ZM9.6875 5.625C9.87292 5.625 10.0542 5.67998 10.2084 5.783C10.3625 5.88601 10.4827 6.03243 10.5536 6.20373C10.6246 6.37504 10.6432 6.56354 10.607 6.7454C10.5708 6.92725 10.4815 7.0943 10.3504 7.22541C10.2193 7.35652 10.0523 7.44581 9.8704 7.48199C9.68854 7.51816 9.50004 7.49959 9.32874 7.42864C9.15743 7.35768 9.01101 7.23752 8.908 7.08335C8.80499 6.92918 8.75 6.74792 8.75 6.5625C8.75 6.31386 8.84878 6.0754 9.02459 5.89959C9.20041 5.72377 9.43886 5.625 9.6875 5.625ZM10.625 14.375C10.2935 14.375 9.97554 14.2433 9.74112 14.0089C9.5067 13.7745 9.375 13.4565 9.375 13.125V10C9.20924 10 9.05027 9.93415 8.93306 9.81694C8.81585 9.69973 8.75 9.54076 8.75 9.375C8.75 9.20924 8.81585 9.05027 8.93306 8.93306C9.05027 8.81585 9.20924 8.75 9.375 8.75C9.70652 8.75 10.0245 8.8817 10.2589 9.11612C10.4933 9.35054 10.625 9.66848 10.625 10V13.125C10.7908 13.125 10.9497 13.1908 11.0669 13.3081C11.1842 13.4253 11.25 13.5842 11.25 13.75C11.25 13.9158 11.1842 14.0747 11.0669 14.1919C10.9497 14.3092 10.7908 14.375 10.625 14.375Z" fill="black"/>
                            </svg>
                        </span>
                        <div className='tooltiptext'>Additional charges, not part of the Academic Fee. </div>
                     </div>
                    }

                    <Table 
                        heading={'Add-On Fee Breakup'}
                        list={adhocInstallments} 
                        handleCheckBox={handleAmount} 
                        selectAll={selectAll}
                    />

                    <SmallTable 
                        heading={'Add-On Fee Breakup'}
                        list={adhocInstallments} 
                        handleCheckBox={handleAmount}
                    />

                    <div className='button-container'>
                        <Button 
                            text={`Pay ₹ ${adhocAmount} Now `} 
                            handleClick={handleProceed}
                            classes={`button-small button-primary ${adhocAmount > 0 ? '' : 'disabled'}`}
                            align={'flex-end'}
                        />
                    </div>

                    {
                        noAcademicFeeState && 
                        <div className='paid-status' style={{marginTop: 24}}>
                            <div className='icon-circle'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#a8cfff" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>
                            </div>
                            <div className='status-text'>
                                You dont have any academic fee to pay.
                            </div>    
                        </div>
                    }

                    {
                        (!nonPaidStatus && !noAcademicFeeState) && 
                        <div className='paid-status' style={{marginTop: 24}}>
                            <div className='icon-circle'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#a8cfff" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>
                            </div>
                            <div className='status-text'>
                                The fee has been paid in full. Summary of the same is given below.
                            </div>    
                        </div>
                    }

                    {   dashboardType.name === 'autopay' &&
                        <div style={dashboardType.status == 'setup_cancel' ? {display:'none',visibility:'hidden'} : {width:'100%',marginTop: 24}}>
                            <DetailBanner 
                                dashboardStatus={dashboardType.status}
                                handleSubmit={handleAutopayModal}
                            />
                        </div>
                    }
                    {
                        dashboardType.name === 'loan' && 
                        <div className='steps' style={dashboardType.status == 'cancelled' || dashboardType.status == 'denied' ? {display:'none',visibility:'hidden'} : null}>
                                <div className='steps-header'>Loan Status</div>
                                <Steps status={dashboardType.status} />
                        </div>
                    }
                   
                   {
                        dashboardType.name === 'loan' && dashboardType.status === 'applied' && 
                        <div className='paid-status' style={{marginTop: 12}}>
                            <div className='icon-circle'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#a8cfff" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>
                            </div>
                            <div className='status-text'>
                                 You have successfully applied for loan with Credenc! If you wish to cancel your loan, you can do it before the approval by <b style={{textDecoration: 'underline',cursor:'pointer'}} onClick={openCancellationModal}>Clicking Here</b>.
                            </div>    
                        </div>
                    }

                    {
                        dashboardType.name === 'loan' && dashboardType.status === 'disbursed' && 
                        <div className='paid-status'>
                            <div className='icon-circle'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#a8cfff" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>
                            </div>
                            <div className='status-text'>
                             Your fee has been successfully paid by Credenc! No more financial worries for you!
                            </div>    
                        </div>
                    }


                    <div className='pair-heading tooltip' style={{margin: '1rem 0 0.8rem 0'}}>
                         ACADEMIC FEE
                         <span style={{ display: 'inline-block', cursor: 'pointer'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M10 1.875C8.39303 1.875 6.82214 2.35152 5.486 3.24431C4.14985 4.1371 3.10844 5.40605 2.49348 6.8907C1.87852 8.37535 1.71762 10.009 2.03112 11.5851C2.34463 13.1612 3.11846 14.6089 4.25476 15.7452C5.39106 16.8815 6.8388 17.6554 8.4149 17.9689C9.99099 18.2824 11.6247 18.1215 13.1093 17.5065C14.594 16.8916 15.8629 15.8502 16.7557 14.514C17.6485 13.1779 18.125 11.607 18.125 10C18.1227 7.84581 17.266 5.78051 15.7427 4.25727C14.2195 2.73403 12.1542 1.87727 10 1.875ZM9.6875 5.625C9.87292 5.625 10.0542 5.67998 10.2084 5.783C10.3625 5.88601 10.4827 6.03243 10.5536 6.20373C10.6246 6.37504 10.6432 6.56354 10.607 6.7454C10.5708 6.92725 10.4815 7.0943 10.3504 7.22541C10.2193 7.35652 10.0523 7.44581 9.8704 7.48199C9.68854 7.51816 9.50004 7.49959 9.32874 7.42864C9.15743 7.35768 9.01101 7.23752 8.908 7.08335C8.80499 6.92918 8.75 6.74792 8.75 6.5625C8.75 6.31386 8.84878 6.0754 9.02459 5.89959C9.20041 5.72377 9.43886 5.625 9.6875 5.625ZM10.625 14.375C10.2935 14.375 9.97554 14.2433 9.74112 14.0089C9.5067 13.7745 9.375 13.4565 9.375 13.125V10C9.20924 10 9.05027 9.93415 8.93306 9.81694C8.81585 9.69973 8.75 9.54076 8.75 9.375C8.75 9.20924 8.81585 9.05027 8.93306 8.93306C9.05027 8.81585 9.20924 8.75 9.375 8.75C9.70652 8.75 10.0245 8.8817 10.2589 9.11612C10.4933 9.35054 10.625 9.66848 10.625 10V13.125C10.7908 13.125 10.9497 13.1908 11.0669 13.3081C11.1842 13.4253 11.25 13.5842 11.25 13.75C11.25 13.9158 11.1842 14.0747 11.0669 14.1919C10.9497 14.3092 10.7908 14.375 10.625 14.375Z" fill="black"/>
                            </svg>
                        </span>
                        <div className='tooltiptext'>Mandatory fee for the academic program</div>
                     </div>
                    <Pair 
                        radius={'1rem'}
                        bgColor={'#5654BF'}
                        keyname={'Outstanding Fee :'}
                        value={`₹ ${pendingAmount}`}
                    />

                    <div style={{height: '1rem'}}></div>

                    {paymentPlans.length > 0 && 
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', margin: '0 0 1rem 0' }}>
                            <div className='heading' style={{ width: 'auto', margin: '1rem 0 0 0' }}>Payment Plans</div>
                            <div style={{ 
                                color: '#5E5E5E',
                                textAlign: 'center',
                                fontFamily: 'Poppins',
                                fontSize: '12px',
                                fontStyle: 'normal',
                                fontWeight: '500',
                                lineHeight: 'normal'
                             }}>*Applicable to Academic Fee only.</div>
                        </div>
                    }
                    <div className='payment-options-container'>
                        {paymentPlans.map((plan, index) => {
                            if(plan?.name === "FULL_PAYMENT"){
                                return <PaymentOption
                                    key={index}
                                    icon={moneyIcon}
                                    tag={plan.tag}
                                    heading={'PAY IN FULL'}
                                    description={'Pay the whole school fee in one go!'}
                                    bgColor={'#A8CFFF'}
                                    onClick={navigateToPaymentPage}
                                    disabled={plan?.disabled}
                                />
                            }

                            if(plan?.name === "INDIVIDUAL_PAYMENT"){
                                return <PaymentOption
                                    icon={coinsIcon}
                                    heading={'PAY INDIVIDUALLY'}
                                    tag={plan.tag}
                                    description={'Break up the fees as per your convenience!'}
                                    bgColor={'#D6D6FF'}
                                    onClick={navigateToPartialPaymentPage}
                                    disabled={plan?.disabled}
                                />
                            }

                            if(plan?.name === "LOAN"){
                                return <PaymentOption
                                    icon={handCoinsIcon}
                                    tag={plan.tag}
                                    heading={'PAY WITH NO COST EMI'}
                                    description={'Pay full fee using Credenc loan!'}
                                    bgColor={'#FFD45C'}
                                    onClick={navigateToLoanPage}
                                    disabled={plan?.disabled}
                                />
                            }

                            if(plan?.name === "AUTO_PAY"){
                                return <PaymentOption
                                    icon={CurrencyEthIcon}
                                    heading={'SET UP AUTO-PAY'}
                                    description={'Set up auto-payment at regular intervals!'}
                                    bgColor={'#E3FB72'}
                                    tag={plan.tag}
                                    onClick={navigateToAutopay}
                                    disabled={plan?.disabled}
                                />
                            }

                            return ''
                        })}
                        
                    </div>

                    <div style={{height: '2.5rem'}}></div>

                    <Table list={installments} selectAll={selectAll}/>
                    <SmallTable list={installments} showStatus={true}/>

                    {/* <div className='button-container'>
                        <Button 
                            text='LOGOUT' 
                            handleClick={logout}
                            classes={`button-small button-primary`}
                            align={'flex-end'}
                        />
                    </div> */}
                </div>}

                {loader && 
                    <div className="credenc-loader" style={{background: 'none'}}>
                        <TailSpin color="#00BFFF" height={100} width={100}/>
                    </div>
                }
            </div>
        </div>
        { applicationStatus &&
            <ConfirmationModal
                modalData={confirmModalData}
                student={student}
                amount={pendingAmount}
                handleClose={closeConfirmationModal}
                installments_count={dashboardType.installments_count}
            />
        }
        {confirmationDialog && <Modal 
            data={modalData} 
            handleSubmit={handleProceedAndPay}
            handleClose={closeModal}
        />}
        {
            credencLoanModal && 
            <CredencLoanModal 
                closeLoanModal={()=>closeLoanModal()}
                applyLoan={()=>applyCredencLoan()}
            />
        }
        {
            loanSuccess && 
            <LoanSuccess loanData={loanData} adhocLoan={false} />
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
