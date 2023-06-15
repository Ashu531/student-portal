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
import Steps from '../elementalComponents/steps/Steps';
import ConfirmationModal from '../elementalComponents/confirmationModal/ConfirmModal';
import DetailBanner from '../elementalComponents/detailBanner/DetailBanner';

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

    const [confirmModalData,setConfirmModalData] = useState({
        title: '',
        subHeading: '',
        description: '',
        buttonText:'',
        successImage: false,
        type: 2
   })

    const [autopayDetails,setAutopayDetails] = useState(false)

    const [loader, setLoader] = useState(false);

    const logout = async () => {
        const loggedOut = await logoutUser();
        if(loggedOut)
            navigate('/login', {replace: true});
    }

    const getData = async () => {
        const data = await axios.get(`${API_URL}/api/kid/v1/school/installments/${getToken()}/`)
        .then(res => res.data)
        .catch(error => error.response.data);

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
        .catch(err => err.response.data);

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
            setAdhocAmount(newAmount);
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
                setAdhocAmount(amount);
                
            } else {
                setSelectAll(isChecked);

                let amount = 0;
                setAdhocAmount(amount);

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

            if(installment['status'] !== 'paid'){
                pendingAmount += parseFloat(installment['amount']) + parseFloat(installment['penalty']);
            }
        })

        setAmount(amount);
        setPendingAmount(pendingAmount);
    }, [installments])

    useEffect(() => {
        let amount = 0;
        adhocInstallments.forEach((installment) => {
            if(installment['is_mandatory'] === 'True' || installment['is_mandatory'] === true){
                amount += parseFloat(installment['amount']) + parseFloat(installment['penalty']);
            }
        })

        setAdhocAmount(amount);
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
            logout()
        }else{
            setStudent(data.student);
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
        navigate(`/credenc-loan`, {replace: true});
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
                                <div className="field" style={{color: '#FFFFFF'}}>School</div>
                                <div className="value" style={{color: '#FFFFFF'}}>{student.college}</div>
                            </div>
                            <div style={{position: 'absolute', left: '0'}}>
                                <Collapsible 
                                    width={'20rem'}
                                    title={'Student'}
                                    students={students}
                                    student={student} 
                                    collapsed={studentCollapsed}
                                    handleClick={() => setStudentCollapsed(!studentCollapsed)}
                                    handleStudentClick={(student) => setToken(student.token)}
                                />
                            </div>
                            <div className="row">
                                <div className="field" style={{color: '#FFFFFF'}}>Grade</div>
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

                    <Table 
                        heading={'Add-Ons'}
                        list={adhocInstallments} 
                        handleCheckBox={handleAmount} 
                        selectAll={selectAll}
                    />

                    <SmallTable 
                        heading={'Add-Ons'}
                        list={adhocInstallments} 
                        handleCheckBox={handleAmount}
                    />

                    {adhocAmount > 0 && <div className='button-container'>
                        <Button 
                            text={`Pay ₹ ${adhocAmount} Now `} 
                            handleClick={handleProceed}
                            classes={`button-small button-primary`}
                            align={'flex-end'}
                        />
                    </div>}

                    <div style={{height: '1rem'}}></div>
                    <Pair 
                        radius={'1rem'}
                        bgColor={'#5654BF'}
                        keyname={'Pending Fee :'}
                        value={`₹ ${pendingAmount}`}
                    />

                    {
                        !nonPaidStatus && 
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

                    <div className='heading'>Payment Plans</div>
                    <div className='payment-options-container'>
                        {paymentPlans.map((plan, index) => {
                            if(plan?.name === "full"){
                                return <PaymentOption
                                    key={index}
                                    icon={moneyIcon}
                                    heading={'PAY IN FULL'}
                                    description={'Pay the whole school fee in one go!'}
                                    bgColor={'#A8CFFF'}
                                    onClick={navigateToPaymentPage}
                                    disabled={plan?.disabled}
                                />
                            }

                            if(plan?.name === "individual"){
                                return <PaymentOption
                                    icon={coinsIcon}
                                    heading={'PAY INDIVIDUALLY'}
                                    description={'Break up the fees as per your convenience!'}
                                    bgColor={'#D6D6FF'}
                                    onClick={navigateToPartialPaymentPage}
                                    disabled={plan?.disabled}
                                />
                            }

                            if(plan?.name === "loan"){
                                return <PaymentOption
                                    icon={handCoinsIcon}
                                    tag={'Recommended'}
                                    heading={'PAY WITH CREDENC'}
                                    description={'Pay full fee using Credenc loan!'}
                                    bgColor={'#FFD45C'}
                                    onClick={navigateToLoanPage}
                                    disabled={plan?.disabled}
                                />
                            }

                            if(plan?.name === "autopay"){
                                return <PaymentOption
                                    icon={CurrencyEthIcon}
                                    heading={'SET UP AUTO-PAY'}
                                    description={'Set up auto-payment at regular intervals!'}
                                    bgColor={'#E3FB72'}
                                    onClick={navigateToAutopay}
                                    disabled={plan?.disabled}
                                />
                            }

                            return ''
                        })}
                        

                    </div>
                    <div style={{height: '2rem'}}></div>
                    <Table list={installments} selectAll={selectAll}/>
                    <SmallTable list={installments} showStatus={true}/>

                    <div className='button-container'>
                        <Button 
                            text='LOGOUT' 
                            handleClick={logout}
                            classes={`button-small button-primary`}
                            align={'flex-end'}
                        />
                    </div>
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
            />
        }
        {confirmationDialog && <Modal 
            data={modalData} 
            handleSubmit={handleProceedAndPay}
            handleClose={closeModal}
        />}
        </>
    )
}
