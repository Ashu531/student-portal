import React, { useState, useEffect } from 'react';
import Table from '../elementalComponents/table/Table';
import Modal from '../elementalComponents/modal/Modal';
import { useNavigate, useLocation } from 'react-router-dom';
import SmallTable from '../elementalComponents/smallTable/SmallTable';
import { TailSpin } from 'react-loader-spinner';
import { getStudents, getToken, logoutUser, saveToken } from '../../services/authService';
import PaymentOption from '../elementalComponents/paymentOption/PaymentOption';
import moneyIcon from '../../assets/money-icon.svg';
import handCoinsIcon from '../../assets/hand-coins.svg';
import coinsIcon from '../../assets/coins.svg';
import CurrencyEthIcon from '../../assets/currency-eth.svg';
import StudentDetails from '../elementalComponents/studentDetails/StudentDetails';
import Header from '../elementalComponents/header/Header';
import ConfirmationModal from '../elementalComponents/confirmationModal/ConfirmModal';
import LoanSuccess from '../elementalComponents/loan-success/LoanSuccess';
import QuickViewModal from '../elementalComponents/quickViewModal/QuickViewModal';
import { apiRequest } from '../../services/apiRequest';
import html2pdf from 'html2pdf.js';

export default function Home() {

    const paymentPlans = [
        {
            name: 'LOAN',
            tag: 'No Cost EMI',
            description: 'Pay full fee using loan!',
            bgColor: '#FFD45C',
            disabled: false,
        }
    ];

    const navigate = useNavigate();

    const [installments, setInstallments] = useState([]);
    const [adhocInstallments, setAdhocInstallments] = useState([]);

    
    const [student, setStudent] = useState({});
    const [studentDetails, setStudentDetails] = useState([]);

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

    const [credencLoanModal,setCredencLoanModal] = useState(false)

    const [loader, setLoader] = useState(false);

    const [loanSuccess,setLoanSuccess] = useState(false)

    const [loanData,setLoanData] = useState(false)

    const [instituteLogo,setInstituteLogo] = useState('')

    const [quickViewState,setQuickViewState] = useState(false);

    const [quickView,setQuickView] = useState(false);

    useEffect(()=>{
        getStudentDetails()
    },[])

    const  getStudentDetails=async()=>{
        await apiRequest({
            url: `/api/auth/v1/student_data/`,
            method: 'GET',
            token: getToken(),
            onSuccess: async (data) => {
                setStudentDetails(data.user_data)
            },
            onError: (response) => {
                alert(response.data.error)
            }
        })
    }

    const handleStudentClick = async () => {

        let newQuickViewState = {};
        newQuickViewState["student"] = student;

        await apiRequest({
            url: `/api/kid/v1/transactions/${student?.id}/`,
            method: 'GET',
            token: getToken(),
            onSuccess: async (data) => {
                newQuickViewState["transactionHistory"] = data.data
                setQuickViewState(newQuickViewState);
            },
            onError: (response) => {
                alert(response.data.error)
                setQuickViewState(newQuickViewState);
            }
        })
    };

    const logout = async () => {
        const loggedOut = await logoutUser();
        if(loggedOut)
            navigate('/login', {replace: true});
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
                res = response.data;
                alert(response.data.error);
            }
        })

        return res;
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
                alert(response.data.error);
                res = response.data;       
            }
        })

        return res;
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

        await apiRequest({
            url: `/api/kid/v1/loan/cancel/${getToken()}/`,
            method: 'POST',
            data: {
                application_id: dashboardType.application_id
            },
            onSuccess: async (data) => {
                closeConfirmModal()
            },
            onError: (response) => {
                alert(response.data.error)
                closeConfirmModal()
            }
        })
    }

    const closeConfirmModal=()=>{
        setApplicationStatus(false)
        initHome()
    }

    const bannerCancellation=async()=>{

        await apiRequest({
            url: `/api/kid/v1/banner/cancel/${getToken()}/`,
            method: 'POST',
            data: {
                application_id: dashboardType.application_id,
                type: dashboardType.name
            },
            onSuccess: async (data) => {
                closeConfirmModal()
            },
            onError: (response) => {
                alert(response.data.error)
                closeConfirmModal()
            }
        })
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

    const applyCredencLoan=async()=>{
        await apiRequest({
            url: `/api/loan/v1/loan-lead/${studentDetails.lead_id}/`,
            method: 'GET',
            data: {},
            token: getToken(),
            onSuccess: async (data) => {
                if(data.status){
                    navigate(`/loan`, {
                        replace: true,
                        state: { 
                            "loan_data" : data.data,
                            "student_data" : studentDetails
                    }
                    });
                }
            },
            onError: (response) => {
                alert(response.data.error)
            }
        })
    }

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

    return (
        <>
        <Header 
         title="Student Fee Ledger" 
         back={false} 
         icon={student?.logo} 
         openQuickView={()=>openQuickView()} 
        />
        <div className={`home ${confirmationDialog ? 'open-modal' : ''}`}>
            <div className='container'>
                {!loader && <div className='content-container'>                  
                    {/* <div className='hideOnDesktop'> */}
                        <StudentDetails 
                            name={studentDetails.full_name}
                            phone_number={studentDetails.phone_number}
                            email={studentDetails.email}
                            school={studentDetails.institute}
                        />
                    {/* </div>                  */}

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
                                    type='online'
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
                                    type='online'
                                />
                            }

                            if(plan?.name === "LOAN"){
                                return <PaymentOption
                                    icon={handCoinsIcon}
                                    tag={plan.tag}
                                    heading={'PAY WITH NO COST EMI'}
                                    description={'Pay full fee using loan!'}
                                    bgColor={'#FFD45C'}
                                    onClick={applyCredencLoan}
                                    disabled={plan?.disabled}
                                    type="loan"
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

                </div>}

                {loader && 
                    <div className="credenc-loader" style={{background: 'none'}}>
                        <TailSpin color="#00BFFF" height={100} width={100}/>
                    </div>
                }
            </div>
        </div>
        { applicationStatus && 
            (
                dashboardType.status != 'setup_done_by_admin' && 
                dashboardType.status != 'setup_cancel_by_admin'
            ) &&
            <ConfirmationModal
                modalData={confirmModalData}
                student={student}
                amount={pendingAmount}
                error={dashboardType.error}
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
            loanSuccess && 
            <LoanSuccess loanData={loanData} adhocLoan={false} />
        }
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