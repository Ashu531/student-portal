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
    description
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
        const data = await axios.get(`${API_URL}/api/fees/v2/adhoc/link/${url}/`)
        .then(res => {
            setRequiredField(res.data.data)
            setAdhocData(res.data.adhoc)
            // getDropdownData(res.data.data)
        })
        .catch(error => error.response.data);

        return data;

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

        if(item.label === 'Grade'){
            details[0] = {
                'label': item.label,
                 'selectedValue' : e.value,
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
                 'selectedValue' : e.value,
            }
            setDropDownDetails(details)
        }
    }

    const getAcademicYearValue=async()=>{
        await axios.get(`${API_URL}/api/fees/v2/adhoc/batches/${batchId}/`)
        .then(res => {
            setDropDownOptions(res.data.data)
        })
        .catch(error => error.response.data);
    }

    const getGradeData=async(e)=>{
        await axios.get(`${API_URL}/api/fees/v2/adhoc/grades/${slug}`)
        .then(res => {
            setDropDownOptions(res.data.data)
            // getDropdownData(res.data.data)
        })
        .catch(error => error.response.data);
    }

    const handleDropDownOpen=(e,item)=>{
        if(item.label === 'Grade'){
            getGradeData()
        }else{
            let details = [...dropDownDetails]
            getAcademicYearValue()
        }
    }


    const handleLoanSubmit=()=>{
       let data = {

       }


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
            else if(item.label === 'Enrollment Number'){
                data.uid = item.value
            }
        })

        data.slug = slug;

        Object.keys(data).forEach(
            key => (data[key] == null || data[key] == '') && delete data[key],
        );
        
        const response = await axios.post(`${API_URL}/api/fees/v2/adhoc/student/`,data).
        then(res => res.data)
        .catch(err => err.response.data);
    
        return response;
    }


    const logResponse = async (res) => {
        return await axios.post(`${API_URL}/api/kid/v1/log/${modalData.logNumber}/`, JSON.stringify(res))
        .catch(err => err);
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
                'amount': adhocData?.amount
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

    return (
        <div className='institute'>
            <div className='institute-container'>
            <div className="institute-application">
                   <div className='institute-header-content'>
                       <p className="institute-application-heading">{title}</p>
                       <p className='institute-application-subheading'>{description}</p>
                       {
                           adhocData?.amount_name?.length > 0 &&
                           <p className='institute-application-subheading'>{adhocData?.amount_name}</p>
                       }
                   </div>
                    <form className='form'>
                        <div className='form-content'>
                            {requiredField && requiredField.map((item,index)=>{
                                return(
                                    item.type === 1 ?
                                        <div className="formDiv" key={index}>
                                            <label className="label">{item.label}</label>
                                            <InputField handleChange={(e)=>handleField(item,e)} maxLength={30} />
                                        </div>
                                     : item.type === 2 ? 
                                        <div className="formDiv" key={index}>
                                            <label className="label">{item.label}</label>
                                            <InputField handleChange={(e)=>handleField(item,e)} maxLength={10} />
                                        </div>
                                    :
                                        <div className="formDiv" key={index}>
                                            <label className="label">{item.label}</label>
                                            <Select
                                                onChange={(e)=>handleDropdown(e,item)}
                                                options={dropDownOption}
                                                styles={select}
                                                onFocus={(e)=>handleDropDownOpen(e,item)}
                                            />
                                        </div>
                                )
                            })}
                        </div>
                    </form>
               </div>
               
                <div className='button-container'>
                    <Button 
                    text='Apply For Loan' 
                    classes='button'
                    handleClick={()=>handleLoanSubmit()}
                    />
                    <div className='divider'/>
                    {
                        !loader && 
                        <Button 
                            text={`Pay In Full (₹${adhocData?.amount})`} 
                            classes='button'
                            handleClick={()=>handleProceed()}
                        />
                    }
                    
                </div>
               </div>
               {confirmationDialog && <Modal 
                    data={modalData} 
                    handleSubmit={handleProceedAndPay}
                    handleClose={closeModal}
                />}
            </div>
    )
}

const select = {
    height: 54,
    width: '100%'
}


