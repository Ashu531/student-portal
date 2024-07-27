import React,{useEffect, useState, useRef} from 'react';
import caretIcon from '../../assets/caretIcon.svg'
import DocumentCard from '../../components/elementalComponents/documentCard/documentCard.jsx';
import TabBar from '../../components/elementalComponents/tabBar/tabBar.jsx';
import Upload, { uploadtStates } from '../../components/elementalComponents/upload/upload.jsx';
import axios from 'axios';
import FinancialForm from '../../components/elementalComponents/financialForm/financialForm.jsx';
import LeadForm, { EditableLeadForm } from '../../components/elementalComponents/leadForm/leadform.jsx';
import { formViewTypes } from '../../components/forms/leadDetails.jsx';
import { leadState, requestData } from '../entities/formDetails.js';
import ChoiceBox, { Checklist } from '../../components/elementalComponents/checklist/checklist.jsx';
import { Bars, TailSpin } from "react-loader-spinner";
import { useNavigate, useLocation } from 'react-router-dom';
import './/loan.css'
import { getToken } from '../../services/authService';
import Button from '../elementalComponents/loanButton/button.jsx';

const documentTypes = [
    'Aadhaar Card', 
    'Passport', 
    'Driving License', 
    'Voter ID', 
    'Landline Bill', 
    'Electricity Bill', 
    'Gas Bill', 
    'Water Bill',
    'Others'
]

export default function Loan({
    instituteName,
    leadOverview,
    ...props
}) {

const initialFormState = {
        leadId: '',
        studentName: '',
        institute: '',
        mobile: '',
        email: '',
        borrowerName: '',
        course: '',
        courseFee: '',
        loanAmount: '',
        tenure: '',
        advanceEmi: '-1'
      }

 const [tab,setTab] = useState(0);
 const [documentValue,setDocumentValue] = useState('PAN Card')

 const [selectedDocTypes, setSelectedDocTypes] = useState(new Set([]));
 const [currentUploadState, setCurrentUploadState] = useState(uploadtStates.drop);

const [selectedFiles, setSelectedFiles] = useState([]);
const [deletedFiles, setDeletedFiles] = useState([]);
const [verifiedFiles, setVerifiedFiles] = useState([]);
const [loader,setLoader] = useState(false)
const [loanData,setLoanData] = useState({})
const [formData,setFormData] = useState({...initialFormState})
const [studentData,setStudentData] = useState({});

const {state} = useLocation();
const navigate = useNavigate();

useEffect(() => {
    if(!state)
        navigate('/', {replace: true});
    else{
        setLoanData(state.loan_data)
        setStudentData(state.student_data)
        setFormData(state.loan_data)
    }
}, [loanData]);

const switchToDropState = () => {
    setCurrentUploadState(uploadtStates.drop)
}

const switchToPreviewState = () => {
    setCurrentUploadState(uploadtStates.preview)
}

const switchToUploadedState = () => {
    setCurrentUploadState(uploadtStates.uploaded)
}

const removeFile = (i) => {
    let selected = [...deletedFiles];
    
    selected.forEach((file, idx) => {
      if(idx == i)
        selected[idx] = -1;
    });

    setDeletedFiles([...selected]);
    setVerifiedFiles([]);
    switchToDropState();
}

const getDocumentType = () => {
    switch(documentValue){
        case 'PAN Card': return 'pan'
        case 'Aadhaar Card': return 'aadhar'
        case 'Bank Statement': return 'statement'
        case 'Passport': return 'passport' 
        case 'Driving License': return 'license' 
        case 'Voter ID': return 'voter' 
        case 'Landline Bill': return 'landline' 
        case 'Electricity Bill': return 'electricity_bill' 
        case 'Gas Bill': return 'gas_bill' 
        case 'Water Bill': return 'water_bill'
        case 'Others': return 'other'
    }
}

  const handleBack=()=>{
    navigate('/',{
        replace: true
    })
  }

  const handleTabNavigation = (i) => {
    setTab(i);
 }

const handleDocumentsCard=(data)=>{
setDocumentValue(data)
    if(documentValue != data){
        removeFile(0)
    }
    
}
console.log(documentValue,"valuee")
const handleDocTypeSelection = (docType) => {
        if(selectedDocTypes.has(docType)){
            setSelectedDocTypes(prev => {prev.delete(docType); return new Set(prev);})
        } else {
            setSelectedDocTypes(prev => new Set(prev.add(docType)));
        }
}

const saveLead=async()=>{
    if(loanData.id){
        try {
            const response = await axios.put(`${API_URL}/api/loan/v1/loan-lead/${loanData.id}/`, formData, {
                headers: {
                    token: `${getToken()}`,
                },
            });
            return response.data; 
        } catch (error) {
            console.error(error);
            throw error; 
        }
    }else{
        await axios.post(`${API_URL}/api/loan/v1/loan-lead/`, requestData(formData), {
            headers: {
                token: `${getToken()}`,
            },
        }).then(res => {
            alert("Data Saved Successfully")
        })
        .catch(err => {
           return err.response
        })
    }
}

  return (
    <div className='lead-detail-page'>
        <div className='lead-page-header full-width'>
            <div className='row full-width'>
                <div className='row' style={{marginLeft: 24}}>
                    <img src={caretIcon} onClick={()=>handleBack()} style={{cursor:'pointer'}}/>
                    <div className='column' style={{marginTop: 20,marginLeft: 12}}>
                        <span className='lead-page-heading' >{studentData?.full_name}</span>
                        <span className='lead-page-subheading'> {studentData?.phone_number}</span>
                    </div>
                </div>
            </div>
        </div>
        <div className='lead-page-content'>
            <TabBar 
                items={["Details", "Financials", "Documents"]}
                handleTabNumber={handleTabNavigation}
                selected={tab}
            />
            {
                tab === 0 && 
                Object.keys(loanData).length > 0 && <div className="scrollable-form-container">
                    <EditableLeadForm
                        instituteName={studentData?.institute}
                        viewType={formViewTypes.CREATE}
                        previousFormData={loanData}
                        formData={formData}
                        setFormData={setFormData}
                        showHeadings={true}
                    />
                    <div style={{width: '25%',position:'fixed',bottom: 40,left: 56}}>
                        <Button 
                          text='Save'
                            classes={{
                                background: '#8F14CC',
                                borderRadius: '8px',
                                height: '44px'
                            }}
                            textClass={{
                                color: '#FFF',
                                fontSize: '14px',
                                fontFamily: 'Poppins',
                                fontWeight: 600
                            }}
                            onClick={()=>saveLead()}
                        />
                    </div>
              </div>
            }
            {
                tab === 1 && 
                <div className='financials-container row full-width'>
                    <FinancialForm 
                        leadData={loanData}
                        token={getToken()}
                    />
                </div>
            }
            {
                tab === 2 && 
                <div className='document-container row full-width'>
                    <div className='column' style={{gap:20}}>
                        <div style={{...(documentValue === 'PAN Card' ? {background: '#F7F0FF',borderRadius: 8} : null), width: '100%'}}>
                            <DocumentCard
                                onClick={()=>handleDocumentsCard('PAN Card')}
                                title={'PAN Card'}
                                desc={'Upload a clear image of your Document clearly stating your name and date of birth.'}
                                instruction={'Format: PDF, PNG, JPEG, JPG.'}
                            />
                        </div>
                        <div style={{...(documentValue === 'Aadhaar Card' ? {background: '#F7F0FF',borderRadius: 8} : null), width: '100%'}}>
                            <DocumentCard
                                onClick={()=>handleDocumentsCard('Aadhaar Card')}
                                title={'Aadhaar Card'}
                                desc={'Upload a clear image of your Document clearly stating your name and date of birth.'}
                                instruction={'Format: PDF, PNG, JPEG, JPG.'}
                            />
                        </div>
                        <div style={{...(documentValue === 'Bank Statement' ? {background: '#F7F0FF',borderRadius: 8} : null), width: '100%'}}>
                            <DocumentCard
                                onClick={()=>handleDocumentsCard('Bank Statement')}
                                title={'Bank Statement'}
                                desc={'Upload a clear image of your Document clearly stating your name and date of birth.'}
                                instruction={'Format: PDF, PNG, JPEG, JPG.'}
                            />
                        </div>
                        {/* <div className='add-info-container row full-width'>
                            <div className='row'>
                                <img src={addIcon} height={20} width={20} style={{objectFit:'contain'}} />
                                <span className='add-doc-text'>Additional Documents</span>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ffffff" viewBox="0 0 256 256"><path d="M210.83,98.83l-80,80a4,4,0,0,1-5.66,0l-80-80a4,4,0,0,1,5.66-5.66L128,170.34l77.17-77.17a4,4,0,1,1,5.66,5.66Z"></path></svg>
                        </div> */}
                        <div style={{width: '100%'}}>
                            <ChoiceBox 
                                list={documentTypes}
                                onSelect={(docType) => handleDocTypeSelection(docType)}
                                title={'Additional Documents'}
                                selected={selectedDocTypes}
                            />
                        </div>

                        {Array.from(selectedDocTypes).map((docType, index) => (
                            <div style={{...(documentValue === docType ? {background: '#F7F0FF',borderRadius: 8} : null), width: '100%'}}>
                                <DocumentCard
                                    onClick={()=>handleDocumentsCard(docType)}
                                    id={`${docType}-${index}`}
                                    title={docType}
                                    desc={'Upload a clear image of your Document clearly stating your name and date of birth.'}
                                    instruction={'Format: PDF, PNG, JPEG, JPG.'}
                                    isMandatory={false}
                                    onRemove={() => {
                                        handleDocTypeSelection(docType)
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className='row' style={{border: '1px solid #8F14CC', borderRadius: '8px', justifyContent: 'center'}}>
                        <Upload 
                            showBorder={true} 
                            token={props?.token} 
                            selectedFiles={selectedFiles}
                            setSelectedFiles={setSelectedFiles}
                            deletedFiles={deletedFiles}
                            setDeletedFiles={setDeletedFiles}
                            verifiedFiles={verifiedFiles}
                            setVerifiedFiles={setVerifiedFiles}
                            removeFile={removeFile}
                            getDocumentType={getDocumentType}
                            currentUploadState={currentUploadState}
                            onDrop={switchToPreviewState}
                            onCancel={() => removeFile(0)}
                            onUpload={() => {
                                switchToUploadedState();
                                setTimeout(() => switchToDropState(), 3000)
                            }}
                            leadID={studentData?.lead_id}
                            getDocumentType={()=>getDocumentType()}
                            documentValue={documentValue}
                        />
                    </div>
                </div>    
            }
        </div>
        {
        loader && 
          <div className="credenc-loader-white fullscreen-loader" style={{position:'absolute'}}>
            <TailSpin color="#00BFFF" height={100} width={100}/>
          </div>
        }
    </div>
  )
}
