import React, { useEffect, useState } from 'react';
import Button from '../button/Button';
import InputField from '../inputField/InputField';
import { getToken } from '../../../services/authService';
import axios from 'axios';
import Select from 'react-select';
import constant from '../../../config/constant'
import useScript from '../../../hooks/useScript';
import Modal from '../../elementalComponents/modal/Modal';
import { useNavigate } from 'react-router';

const relations = [
    { value: 'Father', label: 'Father' },
    { value: 'Mother', label: 'Mother' },
    { value: 'Brother', label: 'Brother' },
    { value: 'Sister', label: 'Sister' },
  ];

export default function InstituteForm({
    title,
    description,
    onlySignUp,
    handleFormSubmit,
    mobileNumber,
    closeApplyForLoan,
    openApplyForLoan,
    handleLinkExpired
}) {

    const [relation,setRelation] = useState('')
    const [requiredField,setRequiredField] = useState([]);
    const [instituteDetails,setInstituteDetails] = useState([]); 
    const [dropDownDetails,setDropDownDetails] = useState([]);
    const [dropDownOption,setDropDownOptions] = useState([])
    const [slug,setSlug] = useState('')
    const [batchId,setBatchId] = useState('')
    const [adhocData,setAdhocData] = useState({});
    const [confirmationDialog, setConfirmationDialog] = useState(false);
    const [loader, setLoader] = useState(false);
    const [easebuzzCheckout, setEasebuzzCheckout] = useState(null);
    const [modalData, setModalData] = useState({});
    const [student,setStudent] = useState({})
    const [installment,setInstallment] = useState([])
    const [buttonData,setButtonData] = useState([])
    const [collegeData,setCollegeData] = useState({})
    const [totalAmount,setTotalAmount] = useState({
        amount: '',
        min_amount: '',
        max_amount: ''
    })
    const [paramsInfo,setParamsInfo] = useState({
        studentName: '',
        phoneNumber: '',
        email : '',
        parentName: '',
        parentNumber: '',
        enrollNumber: ''
    })
    const [urlQuery,setUrlQuery] = useState([])
    const navigate = useNavigate();


    useEffect(() => {
       getFieldData()

       useScript('https://ebz-static.s3.ap-south-1.amazonaws.com/easecheckout/easebuzz-checkout.js', () => {
        setEasebuzzCheckout(new EasebuzzCheckout("7ITASSQJE1", 'prod'));
      });
    }, [])

    useEffect(() => {
        if(!confirmationDialog)  {
            setModalData({});
        }
    }, [confirmationDialog])

    const closeModal = () => {
        setConfirmationDialog(false);
    }

    const getFieldData=async()=>{

        let params = window.location.pathname
        let url = params.substring(7,params.length)
        setSlug(url)

        let urldata = {
            'domain': onlySignUp ? 'signup' : 'adhoc'
        }

        const data = await axios.post(`${API_URL}/api/fees/v2/fetch/fields/${url}`,urldata)
        .then(res => {
            setRequiredField(res.data.data)
            settleParamsData(res.data.data)
            if(!onlySignUp){
                setAdhocData(res.data.adhoc)
                segregateAmountData(res.data.adhoc.amount)
            }
            setButtonData(res.data.button)
            if(res?.data?.college?.length > 0){
                setCollegeData(res?.data?.college[0])
            }
            // getDropdownData(res.data.data)
        })
        .catch(error => {
            if(error.response.status === 406){
                handleLinkExpired()
            }
        });

        return data;

    }

    const segregateAmountData=(data)=>{
        if(parseInt(data.min_amount) === parseInt(data.max_amount)){
            setTotalAmount({
                ...totalAmount,
                amount: data.max_amount
            })
            
        }else{
            setTotalAmount({
                ...totalAmount,
                min_amount: data.min_amount,
                max_amount: data.max_amount
            })
        }
    }

    const settleParamsData=(item)=>{
        
        let urlQueryParams= []
        let params = window.location.search
        let url = params.substring(1,params.length)
        // let url = 'app_id=1684141351252-5612-3686bd1c&status=failure'
        const query_params = url.split('&');
        let queryArray = [];
        query_params.forEach((item,i)=>{
            let query = item.split('=')
            queryArray.push(query);
            queryArray.forEach((el,index)=>{
                if(index === queryArray.length -1){
                    let data = {
                        'name' : el[0],
                        'value' : el[1]
                    }
                    urlQueryParams.push(data)
                }
            })
        })
        let urlData = [...urlQueryParams]
        setUrlQuery([...urlQueryParams])

        let details = [...item]
        if(item?.length > 0){
            for(let i = 0; i < details.length; i++){
                urlData && urlData.forEach((node,index)=>{
                        if(node.name.toLowerCase() === details[i].label.toLowerCase()){
                            details[i]={
                                'label': details[i].label,
                                'value' : node.value,
                                'type' : details[i].type
                            }
                        }
                        if(node.name === 'phone%20number' && details[i].label.toLowerCase() === 'phone number'){
                            details[i]={
                                'label': details[i].label,
                                'value' : node.value,
                                'type' : details[i].type
                            }
                        }

                        if(node.name === 'parent%20name' && details[i].label.toLowerCase() === 'parent name'){
                            details[i]={
                                'label': details[i].label,
                                'value' : node.value,
                                'type' : details[i].type
                            }
                        }

                        if(node.name === 'parent%20number' && details[i].label.toLowerCase() === 'parent number'){
                            details[i]={
                                'label': details[i].label,
                                'value' : node.value,
                                'type' : details[i].type
                            }
                        }

                        if(node.name === 'enrollment%20number' && details[i].label.toLowerCase() === 'enrollment number'){
                            details[i]={
                                'label': details[i].label,
                                'value' : node.value,
                                'type' : details[i].type
                            }
                        }
                })
                setInstituteDetails(details)
                setRequiredField(details)
            }
        }
    }

    const handleField=(item,e)=>{
        let data = {}
        let details = [...instituteDetails];
        if(details?.length > 0){
            for(let i = 0; i < details.length; i++){
                const set = details[i];

                if(set.label === item.label){
                    details[i] = {
                        'label': item.label,
                        'value' : e
                    }
                    // array.splice[index,0,data]
                    setInstituteDetails(details)
                }
                else{
                    data = {
                        'label': item.label,
                        'value' : e
                    }
                    setInstituteDetails([...details,data])
                }
            }
        }else{
            data = {
                'label': item.label,
                'value' : e
            }
            setInstituteDetails([data])
        }
    }

    const handleDropdown=(e,item)=>{

        let details = [...dropDownDetails];

        if(item.label == 'Grade/Course'){
            details[0] = {
                'label': item.label,
                 'value' : e.value,
                 'id' : e.id
            }
            
            setBatchId(e.id)
            if(details?.length > 1){
                details.pop()
            }
            setDropDownDetails(details)
            // getAcademicYearValue()
        }else{
            details[1] = {
                'label': item.label,
                 'value' : e.value,
                 'id' : e.id
            }
            setDropDownDetails(details)
        }
    }

    const getAcademicYearValue=async()=>{
        if(batchId){
            await axios.get(`${API_URL}/api/fees/v2/otf/batches/${batchId}/`)
            .then(res => {
                setDropDownOptions(res.data.data)
            })
            .catch(error => {
                alert(error.response.data.error)
                return error.response.data
            });
        }else{
            setDropDownOptions([])
        }
    }

    const getGradeData=async(e)=>{
        await axios.get(`${API_URL}/api/fees/v2/otf/grades/${slug}`)
        .then(res => {
            setDropDownOptions(res.data.data)
            // getDropdownData(res.data.data)
        })
        .catch(error => {
            alert(error.response.data.error)
            return error.response.data
        });
    }

    const handleDropDownOpen=(e,item)=>{
        if(item.label == 'Grade/Course'){
            getGradeData()
        }else{
            let details = [...dropDownDetails]
            getAcademicYearValue()
        }
    }


    const handleLoanSubmit=()=>{
       openApplyForLoan(instituteDetails,collegeData,adhocData,totalAmount);
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
                    navigate('/adhoc-success', {
                        state: {
                            ...response,
                            'installmentsFrontend': installment,
                            'studentFrontend': {...student},
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

    const getModalData = async () => {

        let data = {
            name: '',
            email: '',
            phone_number : '',
            parent_name : '',
            parent_number :  '',
            uid : '',
            slug : '',
            amount: '',
        };

        instituteDetails && instituteDetails.forEach((item,index)=>{
            if(item.label === 'Name'){
                data.name = item.value
            }else if(item.label === 'Phone Number'){
                data.phone_number = item.value
            }else if(item.label === 'Email'){
                data.email = item.value
            }else if(item.label === 'Parent Name'){
                data.parent_name = item.value
            }
            else if(item.label === 'Parent Number'){
                data.parent_number = item.value
            }
            else if(item.label === 'Enrollment Number'){
                data.uid = item.value
            }else{
                data[`${item.label}`]=item.value
            }
        })

        data.slug = slug;

        Object.keys(data).forEach(
            key => (data[key] == null || data[key] == '') && delete data[key],
        );

        data['amount'] = totalAmount.amount;
        
        const response = await axios.post(`${API_URL}/api/fees/v2/otf/payment/`,data).
        then(res => res.data)
        .catch(error => {
            alert(error.response.data.error)
            return error.response.data
        });
        return response;
    }


    const logResponse = async (res) => {
        return await axios.post(`${API_URL}/api/kid/v1/log/${modalData.logNumber}/`, JSON.stringify(res))
        .catch(error => {
            alert(error.response.data.error)
            return error.response.data
        });
    }

    const handleProceed = async () => {
        setLoader(true);
        const res = await getModalData();

        if(res.data && res.student) {
            const { student, data, log_no: logNumber,installment } = res;
            setModalData({
                'student': student,
                'key': data,
                'logNumber': logNumber,
                'amount': totalAmount.amount
            });
            setInstallment(installment)
            setStudent(student)
            setConfirmationDialog(true);
            setLoader(false);
            return;
        }
    
        setLoader(false);
        if(res.error && res.message){
            confirm(`some error occurred: ${res.message}`);
        }
    }

    const handleSignupForm=()=>{
        let details = [...instituteDetails];
        dropDownDetails?.length > 0 && dropDownDetails?.map((item,index)=>{
           details.push(item)
        })

        if(mobileNumber?.length > 0){
            let data = {
                'label': 'Phone Number',
                'value' : mobileNumber
            }
            details.push(data)
        }
        handleFormSubmit(details)
    }

    const validateEmail = (email) => {
        let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(email.match(mailformat)) return true
        else return false
    };

    const validateNumber=(number)=>{
        let numformat = /^[0-9]+$/;
        if(number.length != 10) return false
        if(number.match(numformat)) return true
        else return false
    }

    const validateAlphabet=(alpha)=>{
        let aplhaformat = /^[a-zA-Z_ ]+$/;
        if(alpha.match(aplhaformat)) return true
        else return false
    }

    const handleButtonClick=(data)=>{
        let submit = true;
        if(data.action === 15){
            handleSignupForm()
        }else{
            if(instituteDetails.length > requiredField.length - 3){
                instituteDetails && instituteDetails.forEach((item,index)=>{
                    if(item.label === 'Email'){
                        let status = validateEmail(item.value)
                        if(!status) {
                            submit = false;
                            alert('Please Enter valid Email')
                            return;
                        }
                    }else if(item.label === 'Phone Number'){
                        let status = validateNumber(item.value)
                        if(!status) {
                            submit = false;
                            alert('Please Enter valid Mobile Number')
                            return;
                        }
                    }else if(item.label === 'Parent Number'){
                        let status = validateNumber(item.value)
                        if(!status) {
                            submit = false;
                            alert('Please Enter valid Parent Number')
                            return;
                        }
                    }else if(item.label === 'Name'){
                        let status = validateAlphabet(item.value)
                        if(!status) {
                            submit = false;
                            alert('Please Enter valid Name')
                            return;
                        }
                    } 
                })
                if(totalAmount?.min_amount !== totalAmount?.max_amount){
                    if(parseInt(totalAmount.amount) < totalAmount.min_amount || parseInt(totalAmount.amount) > totalAmount.max_amount){
                        submit = false;
                        alert('Amount should be within the range');
                        return;
                    }
                }
                if(submit){
                    if(data.action === 13) handleProceed()
                    else if(data.action === 14) handleLoanSubmit()
                    // else if(data.action === 15) handleSignupForm()
                }
                
            }
            else{
                alert("All the fields are mandatory to fill")
            }
        }
            
    }

    const handleAmount=(e)=>{
        setTotalAmount({
            ...totalAmount,
            amount: e
        })
    }

    return (
        <div className='institute'>
            <div className='institute-container'>
            <div className="institute-application">
                   <div className='institute-header-content'>
                      <div className='college-icon'>
                            <img src={collegeData?.logo} alt='college_logo' height={32} width={62} style={{objectFit:"contain"}} />
                        </div>
                       <p className="institute-application-heading">{collegeData?.name}</p>
                       {
                           adhocData?.amount_name?.length > 0 &&
                           <p className='institute-application-header'>{adhocData?.amount_name}</p>
                       }
                       {/* <p className='institute-application-subheading'>{description}</p> */}
                      
                   </div>
                   
                    
                        <div className='form-content'>
                            {requiredField && requiredField.map((item,index)=>{
                                return(
                                    item.type === 1 ?
                                        <div className="formDiv" key={index}>
                                            <label className="label">{item.label}{item.mandate === true && <span className='astrix'>*</span>}</label>
                                            <InputField 
                                                handleChange={(e)=>handleField(item,e)} 
                                                maxLength={30} 
                                                value={item.value} 
                                                disabled={item.value}  
                                              />
                                        </div>
                                     : item.type === 2 ? 
                                        <div className="formDiv" key={index}>
                                            <label className="label">{item.label}{item.mandate === true && <span className='astrix'>*</span>}</label>
                                            <InputField 
                                              handleChange={(e)=>handleField(item,e)} 
                                              maxLength={10} 
                                              value={item.value}
                                              disabled={item.value} 
                                              inputType="tel"
                                              />
                                        </div>
                                    :
                                        <div className="formDiv" key={index}>
                                            <label className="label">{item.label}{item.mandate === true && <span className='astrix'>*</span>}</label>
                                            
                                            <Select
                                                onChange={(e)=>handleDropdown(e,item)}
                                                options={dropDownOption}
                                                styles={select}
                                                onFocus={(e)=>handleDropDownOpen(e,item)}
                                                noOptionsMessage={({inputValue}) => !inputValue ? noOptionsText : "Please select course/grade first"}
                                            />
                                        </div>
                                )
                            })}
                            {
                                !onlySignUp && 
                                        <div className="formDiv">
                                            <div className='formDivContent'>
                                                <label className="label">Amount</label>
                                                {
                                                   parseInt(totalAmount.min_amount) > 0 && 
                                                   <label className="label" style={{fontWeight: 400,fontSize: 12}}>Hint: You can enter from ₹{totalAmount.min_amount} to ₹{totalAmount.max_amount}</label>
                                                }
                                            </div>
                                            <InputField 
                                              handleChange={(e)=>handleAmount(e)} 
                                              maxLength={10} 
                                              value={ parseInt(totalAmount.min_amount) ===  parseInt(totalAmount.max_amount) ? totalAmount.max_amount : totalAmount.amount} 
                                              disabled={adhocData?.amount?.min_amount === adhocData?.amount?.max_amount}
                                              inputType="tel"
                                            />
                                        </div>
                            }
                        </div>
               </div>
               {/* {
                   onlySignUp ? 
                   <div className='button-container'>
                        <Button 
                            text='Submit' 
                            classes='button'
                            handleClick={()=>handleSignupForm()}
                        />
                    </div> :
                    <div className='button-container'>
                        <Button 
                        text='Apply For Loan' 
                        classes='button'
                        handleClick={()=>handleLoanSubmit()}
                        />
                    <div className='divider'/>
                            <Button 
                                text={`Pay In Full (₹${adhocData?.amount})`} 
                                classes='button'
                                handleClick={()=>handleProceed()}
                    />
                        
                    </div>
               } */}

               <div className='button-container'>
                   {buttonData?.length > 0 && buttonData.map((item,index)=>{
                       return(
                        <>
                        <Button 
                            text={item.text} 
                            classes='button'
                            handleClick={()=>handleButtonClick(item)}
                            key={index}
                        />
                        {
                            index !== buttonData?.length - 1 && <div className='divider' />
                        }
                        
                        </>
                       )
                   })}
                        
               </div>
                
               </div>
               {confirmationDialog && <Modal 
                    data={modalData} 
                    handleSubmit={handleProceedAndPay}
                    handleClose={closeModal}
                    showEmail={requiredField && requiredField.findIndex(item => item.label == 'Email') >= 0}
                />}
            </div>
    )
}

const select = {
    height: 54,
    width: '100%'
}



