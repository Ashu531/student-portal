import React,{useEffect, useRef, useState} from 'react';
import './leadform.css';
import caretIcon from '../../../assets/caretIcon.svg';
import editIcon from '../../../assets/editIcon.svg';
import LoanDetailsForm, { loanFormInputTypes } from '../../forms/loanDetails.jsx';
import LeadDetailForm,{formViewTypes, studentFormInputTypes} from '../../forms/leadDetails.jsx';
import Button from '../button/Button';
import { amountValidation, basicValidation, dropdownValidation, emailValidation, mobileValidation } from '../../../helpers/validations.js';
import Lead, { leadState, requestData } from '../../entities/formDetails.js';
import { saveDraft, saveForm, editForm } from '../../../helpers/apis';
import { Bars, TailSpin } from "react-loader-spinner";
import ClickAwayListener from 'react-click-away-listener';
import axios from 'axios'

export default function LeadForm({
    token,
    onBackPress,
    instituteName,
    formData,
    setFormData,
    handleCloseLeadForm,
    edit,
}) {

    const [loader,setLoader] = useState(false)

    const handleSave = async (addAnother) => {
        setLoader(true);
    
        const nameError = basicValidation(formData.studentName);
        const mobileError = mobileValidation(formData.mobile);
        const emailError = emailValidation(formData.email);
        const borrowerNameError = basicValidation(formData.borrowerName);
        const courseError = basicValidation(formData.course);
        const courseFeeError = amountValidation(formData.courseFee);
        const loanAmountError = amountValidation(formData.loanAmount);
        const tenureError = amountValidation(formData.tenure);
        const advanceEmiError = dropdownValidation(formData.advanceEmi);
    
        if (
            nameError || mobileError || emailError ||
            borrowerNameError || courseError || courseFeeError || loanAmountError || tenureError || advanceEmiError
        ) {
            setLoader(false);
            alert("All the fields are mandatory to fill");
            return;
        }
    
        let res;
        try {
            if (edit) {
                res = await updateLead(requestData(formData), token);
            } else {
                res = await saveForm(requestData(formData), token);
            }
    
            console.log(res, "response");
    
            if (addAnother) {
                setFormData({ ...leadState });
            } else {
                onBackPress(res);
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while saving the lead.");
        } finally {
            setLoader(false);
        }
    };
    

    const updateLead = async (data, token) => {
        try {
            const response = await axios.put(`${API_URL}/api/loan/v1/loan-lead/${data.id}/`, data, {
                headers: {
                    token: `${token}`,
                },
            });
            return response.data; 
        } catch (error) {
            console.error(error);
            throw error; 
        }
    };
    
  return (
    
   <div className='lead-form-modal'>
       <ClickAwayListener onClickAway={() => handleCloseLeadForm()}>
       <div className='lead-form-modal-content'>
                <div className='lead-form-modal-header row'>
                    <div className='row'>
                        <img src={caretIcon} onClick={handleCloseLeadForm} style={{cursor:'pointer'}} />
                        <span className='lead-modal-header'>Lead Creation</span>
                    </div>
                    <div className='column' style={{alignItems:'flex-start'}}>
                        <span className='lead-modal-instructions' style={{justifyContent:'flex-start'}}>*Mandatory Fields<br/>**You must fill all mandatory fields to save a lead</span>
                    </div>
                </div>

                <EditableLeadForm 
                    instituteName={instituteName}
                    viewType={formViewTypes.CREATE}
                    previousFormData={formData}
                    formData={formData}
                    setFormData={(data) => {
                        setFormData(data)
                    }}
                />

                <div className='row' style={{gap: '1rem',width: '100%',justifyContent:'space-between'}}>
                    {/* <Button
                        text='Save Draft'
                        classes={{
                            borderRadius: 8,
                            border: '1px solid #8F14CC',
                            height: '44px',
                            width:'30%'
                        }}
                        textClass={{
                            color: '#8F14CC',
                            fontSize: '14px',
                            fontFamily: 'Poppins',
                            fontWeight: 600
                        }}
                        onClick={handleSaveDraft}
                    /> */}
                    {/* <Button 
                        text='Save & Add Another Lead'
                        classes={{
                            borderRadius: 8,
                            border: '1px solid #8F14CC',
                            height: '44px',
                            width:'30%'
                        }}
                        textClass={{
                            color: '#8F14CC',
                            fontSize: '14px',
                            fontFamily: 'Poppins',
                            fontWeight: 600
                        }}
                        onClick={()=>{handleSave(true)}}
                    /> */}
                    <Button 
                        text={ edit ? 'Update Lead' : 'Save Lead'}
                        classes={{
                            background: '#8F14CC',
                            borderRadius: '8px',
                            height: '44px',
                            width:'30%'
                        }}
                        textClass={{
                            color: '#FFF',
                            fontSize: '14px',
                            fontFamily: 'Poppins',
                            fontWeight: 600
                        }}
                        onClick={handleSave}
                    />
                </div>
       </div>
       </ClickAwayListener>
          {
            loader && 
              <div className="download-credenc-loader-white download-fullscreen-loader">
                <TailSpin color="#00BFFF" height={100} width={100}/>
              </div>
          }
   </div>
   
  )
}

export function EditableLeadForm ({
    instituteName,
    previousFormData,
    formData,
    setFormData,
    viewType,
    showHeadings=false,
    handleSave
}) {

    const [viewTypes, setViewTypes] = useState({
        lead: viewType,
        loan: viewType
    })

    const [editingStates, setEditingStates] = useState({
        lead: viewType != formViewTypes.VIEW,
        loan: viewType != formViewTypes.VIEW
    })

    const defaultState = {
        value: '',
        error: null,
        disabled: false
    };

    const defaultNameState = {
        ...defaultState,
        sameAsStudent: false
    }

    const defaultDropdownState = {
        value: -1,
        error: null
    }

    const [leadIdState, setLeadIdState] = useState({...defaultState, disabled: viewType != formViewTypes.CREATE});
    const [nameState, setNameState] = useState({...defaultState});
    const [instituteState, setInstituteState] = useState({...defaultState, value: instituteName, disabled: true});
    const [mobileState, setMobileState] = useState({...defaultState});
    const [emailState, setEmailState] = useState({...defaultState});
    const [borrowerNameState, setBorrowerNameState] = useState({...defaultNameState});
    const [courseState, setCourseState] = useState({...defaultState});
    const [courseFeeState, setCourseFeeState] = useState({...defaultState});
    const [loanAmountState, setLoanAmountState] = useState({...defaultState});
    const [tenureState, setTenureState] = useState({...defaultState});
    const [advanceEmiState, setAdvanceEmiState] = useState({...defaultDropdownState});

    useEffect(() => {
        if (previousFormData) {
            setLeadIdState({...leadIdState, value: previousFormData.application_id || ''});
            setNameState({...nameState, value: previousFormData.student_name || ''});
            setInstituteState({...instituteState, value: instituteName || '', disabled: true});
            setMobileState({...mobileState, value: previousFormData.applicant_phone || ''});
            setEmailState({...emailState, value: previousFormData.applicant_email || ''});
            setBorrowerNameState({
                ...borrowerNameState,
                value: previousFormData.borrower_name || '',
                sameAsStudent: previousFormData.student_name === previousFormData.borrower_name
            });
            setCourseState({...courseState, value: previousFormData.course || ''});
            setCourseFeeState({...courseFeeState, value: previousFormData.course_fee || ''});
            setLoanAmountState({...loanAmountState, value: previousFormData.loan_amount || ''});
            setTenureState({...tenureState, value: previousFormData.tenure || ''});
            setAdvanceEmiState({...advanceEmiState, value: previousFormData.advance_emi || -1});
        }
    }, [previousFormData]);


    const handleLeadIdChange = (str) => {
        setLeadIdState({...leadIdState, value: str});
    };
    
    const handleNameChange = (str) => {
        setNameState({...nameState, value: str});
    };

    const handleInstituteChange = (str) => {
        setInstituteState({...instituteState, value: str});
    };

    const handleMobileChange = (str) => {
        setMobileState({...mobileState, value: str});
    };

    const handleEmailChange = (str) => {
        setEmailState({...emailState, value: str});
    };

    const onLeadFormChange = (type, str) => {
        switch(type){
            case studentFormInputTypes.leadId: return handleLeadIdChange(str);
            case studentFormInputTypes.name: return handleNameChange(str);
            case studentFormInputTypes.institute: return handleInstituteChange(str);
            case studentFormInputTypes.mobile: return handleMobileChange(str);
            case studentFormInputTypes.email: return handleEmailChange(str);
        }
    }

    const handleBorrowerNameChange = (changeType, str, checked) => {
        switch(changeType){
            case 0: return setBorrowerNameState({...borrowerNameState, value: str});
            case 1: return setBorrowerNameState({...borrowerNameState, sameAsStudent: checked});
            case 2: return setBorrowerNameState({...borrowerNameState, value: str, sameAsStudent: checked});
        }
            
    };
    
    const handleCourseChange = (str) => {
        setCourseState({...courseState, value: str});
    };

    const handleCourseFeeChange = (str) => {
        setCourseFeeState({...courseFeeState, value: str});
    };

    const handleLoanAmountChange = (str) => {
        setLoanAmountState({...loanAmountState, value: str});
    };

    const handleTenureChange = (str) => {
        setTenureState({...tenureState, value: str});
    };

    const handleAdvanceEmiChange = (str) => {
        setAdvanceEmiState({...advanceEmiState, value: str});
    };

    const onLoanFormChange = (type, str, checked, changeType) => {
        switch(type){
            case loanFormInputTypes.name: return handleBorrowerNameChange(changeType, str, checked);
            case loanFormInputTypes.course: return handleCourseChange(str);
            case loanFormInputTypes.courseFee: return handleCourseFeeChange(str);
            case loanFormInputTypes.loanAmount: return handleLoanAmountChange(str);
            case loanFormInputTypes.tenure: return handleTenureChange(str);
            case loanFormInputTypes.advanceEmi: return handleAdvanceEmiChange(str);
        }
    }

    const setInitialLeadFormStates = () => {
        handleLeadIdChange(previousFormData?.application_id);
        handleNameChange(previousFormData?.student_name);
        handleInstituteChange(instituteName ? instituteName : '');
        handleMobileChange(previousFormData?.applicant_phone);
        handleEmailChange(previousFormData?.applicant_email);
    }

    const setInitialLoanFormStates = () => {
        handleBorrowerNameChange(2, previousFormData?.borrower_name, previousFormData?.student_name == previousFormData?.borrower_name);
        handleCourseChange(previousFormData?.course);
        handleCourseFeeChange(previousFormData?.course_fee);
        handleLoanAmountChange(previousFormData?.loan_amount);
        handleTenureChange(previousFormData.tenure);
        handleAdvanceEmiChange(previousFormData?.advance_emi);
    }

    const setInitialFilledStates = () => {
        setInitialLeadFormStates();
        setInitialLoanFormStates();
    }

    const saveChanges = (formType) => {
        if(formType == 0){
            handleSave();
            setEditingStates({...editingStates, lead: false, loan: false});
        }

        else if(formType == 1){
            handleSave();
            setEditingStates({...editingStates, lead: false, loan: false});
        }

        else {
            throw `incorrect form type, available options are 0, 1 but ${formType} was passed`;
        }
    }

    const discardChanges = (formType) => {
        if(formType == 0){
            setInitialLeadFormStates();
            setEditingStates({...editingStates, lead: false});
        }

        else if(formType == 1){
            setInitialLoanFormStates();
            setEditingStates({...editingStates, loan: false});
        }

        else {
            throw `incorrect form type, available options are 0, 1 but ${formType} was passed`;
        }
    }

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const error = basicValidation(leadIdState.value);
            if(error != 'cannot be empty'){
                setLeadIdState({...leadIdState, error: error})
            }

            if(error == null){
                setFormData({...formData, leadId: leadIdState.value});
            }

        }, 0)
    
        return () => clearTimeout(delayDebounce)
    }, [leadIdState.value]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const error = basicValidation(nameState.value);
            if(error != 'cannot be empty'){
                if(error == null){
                    setNameState({...nameState, error: error});
                }else{
                    setNameState({...nameState, error: `${error} student name`});
                }
                
            }

            if(borrowerNameState.sameAsStudent == true){
                if(error == null){
                    setBorrowerNameState({...borrowerNameState, value: nameState.value});
                }else{
                    setBorrowerNameState({...borrowerNameState, error: `${error} borrower name`});
                }
                
            }
            setFormData({...formData, studentName: nameState.value});
            // if(error == null){
            //     setFormData({...formData, studentName: nameState.value});
            // }

        }, 0)
    
        return () => clearTimeout(delayDebounce)
    }, [nameState.value]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const error = basicValidation(instituteState.value);
            if(error != 'cannot be empty'){
                setInstituteState({...instituteState, error: error});
            }

            if(error == null){
                setFormData({...formData, institute: instituteState.value});
            }

        }, 0)
    
        return () => clearTimeout(delayDebounce)
    }, [instituteState.value]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const error = mobileValidation(mobileState.value);
            if(error != 'cannot be empty'){
                if(error == null){
                    setMobileState({...mobileState, error: error});
                } else {
                    setMobileState({...mobileState, error: `${error} mobile number`});
                }
            }

            if(error == null){
                setFormData({...formData, mobile: mobileState.value});
            }
        }, 0)
    
        return () => clearTimeout(delayDebounce)
    }, [mobileState.value]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const error = emailValidation(emailState.value);
            if(error != 'cannot be empty'){
                if(error == null){
                    setEmailState({...emailState, error: error})
                } else {
                    setEmailState({...emailState, error: `${error} email`})
                }
            }

            if(error == null){
                setFormData({...formData, email: emailState.value});
            }
        }, 0)
    
        return () => clearTimeout(delayDebounce)
    }, [emailState.value]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const error = basicValidation(borrowerNameState.value);
            if(error != 'cannot be empty'){
                setBorrowerNameState({...borrowerNameState, error: error})
                // return
            }

            // if(error == null){
                setFormData({...formData, borrowerName: borrowerNameState.value, studentName: nameState.value});
            // }
        }, 0)
    
        return () => clearTimeout(delayDebounce)
    }, [borrowerNameState.value]);

    useEffect(() => {
        if(borrowerNameState.sameAsStudent){
            setBorrowerNameState({...borrowerNameState, value: nameState.value})
        }else{
            setBorrowerNameState({...borrowerNameState, value: borrowerNameState.value})
        }
    }, [borrowerNameState.sameAsStudent]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const error = basicValidation(courseState.value);
            if(error != 'cannot be empty'){
                if(error == null){
                    setCourseState({...courseState, error: error})
                } else {
                    setCourseState({...courseState, error: `${error} course name`})
                }
            }
            // if(error == null){
                setFormData({...formData, course: courseState.value});
            // }
        }, 0)
    
        return () => clearTimeout(delayDebounce)
    }, [courseState.value]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const error = amountValidation(courseFeeState.value);
            if(error != 'cannot be empty'){
                if(error == null){
                    setCourseFeeState({...courseFeeState, error: error})
                }else{
                    setCourseFeeState({...courseFeeState, error: `${error} course fee`})
                }
                
            }
            setFormData({...formData, courseFee: courseFeeState.value});

            // if(error == null){
            //     handleCourseFeeChange(courseFeeState.value);
            // }

        }, 0)
    
        return () => clearTimeout(delayDebounce)
    }, [courseFeeState.value]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const error = amountValidation(loanAmountState.value);
            if(error != 'cannot be empty'){
                if(error == null){
                    setLoanAmountState({...loanAmountState, error: error})
                }else{
                    setLoanAmountState({...loanAmountState, error: `${error} loan amount`})
                }
            }
            setFormData({...formData, loanAmount: loanAmountState.value});
            // if(error == null){
            //     // handleLoanAmountChange(loanAmountState.value);
            //     setFormData({...formData, loanAmount: loanAmountState.value});
            // }
        }, 0)
    
        return () => clearTimeout(delayDebounce)
    }, [loanAmountState.value]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const error = amountValidation(tenureState.value);
            if(error != 'cannot be empty'){
                setTenureState({...tenureState, error: error})
            }

            // if(error == null){
                setFormData({...formData, tenure: tenureState.value});
            // }
        }, 0)
    
        return () => clearTimeout(delayDebounce)
    }, [tenureState.value]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const error = dropdownValidation(advanceEmiState?.value?.toString());
            // if(error != 'cannot be empty'){
            //     setAdvanceEmiState({...advanceEmiState, error: error})
            // }

            if(error == null){
                setFormData({...formData, advanceEmi: advanceEmiState.value});
            }
        }, 0)
    
        return () => clearTimeout(delayDebounce)
    }, [advanceEmiState.value]);

    useEffect(() => {
        if(editingStates.lead == true){
            setViewTypes({...viewTypes, lead: formViewTypes.EDIT})
        } else {
            setViewTypes({...viewTypes, lead: formViewTypes.VIEW})
        }
    }, [editingStates.lead])

    useEffect(() => {
        if(editingStates.loan == true){
            setViewTypes({...viewTypes, loan: formViewTypes.EDIT})
        } else {
            setViewTypes({...viewTypes, loan: formViewTypes.VIEW})
        }
    }, [editingStates.loan])

    const initForm = () => {
        if(viewType == formViewTypes.CREATE && instituteName != null){
            setInstituteState({...instituteState, value: instituteName, disabled: true});
        }
    }

    useEffect(() => {
        initForm();
    }, [])

    useEffect(() => {
        setInitialFilledStates()
    }, [])

    return (
        <div 
            className='row full-width' 
            style={{
                flexWrap: 'wrap', 
                gap: '20px', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                marginTop: '1rem',
                overflow: 'scroll'
            }}>
            <div style={{flex: '1 1 0px'}}>
                {showHeadings && 
                    <div className='row' style={{justifyContent: 'space-between', alignItems: 'center', padding: '0 0 20px 0'}}>
                        {/* <div className='text-Poppins text-weight-6 text-20 form-heading'>Student Details</div> */}
                        {/* {!editingStates.lead && <img src={editIcon} onClick={() => setEditingStates({...editingStates, lead: true})}/>}
                        {editingStates.lead && 
                            <div className='row clickable-heading' style={{justifyContent: 'flex-end', gap: '25px', alignItems: 'baseline'}}>
                                <div className='clickable-text text-Poppins text-weight-6 text-16' onClick={() => discardChanges(0)}>Discard Changes</div>
                                <div className='clickable-text text-Poppins text-weight-6 text-16' onClick={() => saveChanges(0)}>Save</div>
                            </div>
                        } */}
                    </div>
                }
                <LeadDetailForm
                    viewType={viewTypes.lead} 
                    leadIdState={leadIdState}
                    nameState={nameState}
                    instituteState={instituteState}
                    mobileState={mobileState}
                    emailState={emailState}
                    onChange={onLeadFormChange}
                />
            </div>
            <div style={{flex: '1 1 0px'}}>
                {showHeadings && 
                    <div className='row' style={{justifyContent: 'space-between', alignItems: 'center', padding: '0 0 18px 0'}}>
                        {/* <div className='text-Poppins text-weight-6 text-20 form-heading'>Loan Details</div> */}
                        {/* {!editingStates.loan && <img src={editIcon} onClick={() => setEditingStates({...editingStates, loan: true})}/>}
                        {editingStates.loan && 
                            <div className='row clickable-heading' style={{justifyContent: 'flex-end', gap: '25px', alignItems: 'baseline'}}>
                                <div className='clickable-text text-Poppins text-weight-6 text-16' onClick={() => discardChanges(1)}>Discard Changes</div>
                                <div className='clickable-text text-Poppins text-weight-6 text-16' onClick={() => saveChanges(1)}>Save</div>
                            </div>
                        } */}
                    </div>
                }
                <LoanDetailsForm
                    viewType={viewTypes.loan} 
                    borrowerNameState={borrowerNameState}
                    courseState={courseState}
                    courseFeeState={courseFeeState}
                    loanAmountState={loanAmountState}
                    tenureState={tenureState}
                    advanceEmiState={advanceEmiState}
                    onChange={onLoanFormChange}
                />
            </div>
        </div>
    );
}



