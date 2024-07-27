import React, { useEffect, useState } from 'react';
import { Dropdown } from '../../components/elementalComponents/dropdown/dropdown.jsx';
import { Input } from '../../components/elementalComponents/input/input.jsx';
import { formViewTypes } from './leadDetails.jsx';

export default function LoanDetailsForm({
    viewType,
    borrowerNameState,
    courseState,
    courseFeeState,
    loanAmountState,
    tenureState,
    advanceEmiState,
    onChange
}) {

    const nameLabel = () => 'Borrower Name';
    const courseLabel = () => 'Course';
    const courseFeeLabel = () => 'Course Fee';
    const loanAmountLabel = () => 'Loan Amount';
    const tenureLabel = () => 'Tenure (in months)';
    const advanceEmiLabel = () => 'Advance EMI';

    const advanceEmiOptions = [
        {id: 0, label: 0, disabled: false},
        {id: 1, label: 1, disabled: false},
        {id: 2, label: 2, disabled: false},
        {id: 3, label: 3, disabled: false},
        {id: 4, label: 4, disabled: false},
    ]

    const getLabel = (type) => {
        
        switch(type){
            case loanFormInputTypes.name: return nameLabel();
            case loanFormInputTypes.course: return courseLabel();
            case loanFormInputTypes.courseFee: return courseFeeLabel();
            case loanFormInputTypes.loanAmount: return loanAmountLabel();
            case loanFormInputTypes.tenure: return tenureLabel();
            case loanFormInputTypes.advanceEmi: return advanceEmiLabel();
        }
        
    }


    const nameRequired = () => viewType == formViewTypes.CREATE;
    const courseRequired = () => viewType == formViewTypes.CREATE;
    const courseFeeRequired = () => viewType == formViewTypes.CREATE;
    const loanAmountRequired = () => viewType == formViewTypes.CREATE;
    const tenureRequired = () => viewType == formViewTypes.CREATE;
    const advanceEmiRequired = () => viewType == formViewTypes.CREATE;

    const getRequired = (type) => {

        if(viewType == formViewTypes.CREATE){
            return true;
        }

        switch(type){
            case loanFormInputTypes.name: return nameRequired();
            case loanFormInputTypes.course: return courseRequired();
            case loanFormInputTypes.courseFee: return courseFeeRequired();
            case loanFormInputTypes.loanAmount: return loanAmountRequired();
            case loanFormInputTypes.tenure: return tenureRequired();
            case loanFormInputTypes.advanceEmi: return advanceEmiRequired();
        }

    }


    const nameCheck = () => false;
    const courseCheck = () => false;
    const courseFeeCheck = () => false;
    const loanAmountCheck = () => false;
    const tenureCheck = () => false;
    const advanceEmiCheck = () => false;

    const getCheck = (type) => {
        switch(type){
            case loanFormInputTypes.name: return nameCheck();
            case loanFormInputTypes.course: return courseCheck();
            case loanFormInputTypes.courseFee: return courseFeeCheck();
            case loanFormInputTypes.loanAmount: return loanAmountCheck();
            case loanFormInputTypes.tenure: return tenureCheck();
            case loanFormInputTypes.advanceEmi: return advanceEmiCheck();
        }
    }


    const namePlaceholder = () => '';
    const coursePlaceholder = () => '';
    const courseFeePlaceholder = () => '';
    const loanAmountPlaceholder = () => '';
    const tenurePlaceholder = () => '';
    const advanceEmiPlaceholder = () => '-Select-';
    
    const getPlaceholder = (type) => {
        switch(type){
            case loanFormInputTypes.name: return namePlaceholder();
            case loanFormInputTypes.course: return coursePlaceholder();
            case loanFormInputTypes.courseFee: return courseFeePlaceholder();
            case loanFormInputTypes.loanAmount: return loanAmountPlaceholder();
            case loanFormInputTypes.tenure: return tenurePlaceholder();
            case loanFormInputTypes.advanceEmi: return advanceEmiPlaceholder();
        }
    }

    const getValue = (type) => {
        switch(type){
            case loanFormInputTypes.name: return borrowerNameState.value;
            case loanFormInputTypes.course: return courseState.value;
            case loanFormInputTypes.courseFee: return courseFeeState.value;
            case loanFormInputTypes.loanAmount: return loanAmountState.value;
            case loanFormInputTypes.tenure: return tenureState.value;
            case loanFormInputTypes.advanceEmi: return advanceEmiState.value;
        }
    }


    const nameDisabled = () => borrowerNameState.disabled || borrowerNameState.sameAsStudent;
    const courseDisabled = () => courseState.disabled;
    const courseFeeDisabled = () => courseFeeState.disabled;
    const loanAmountDisabled = () => loanAmountState.disabled;
    const tenureDisabled = () => tenureState.disabled;
    const advanceEmiDisabled = () => advanceEmiState.disabled;

    const getDisabled = (type) => {

        if(viewType == formViewTypes.VIEW){
            return true;
        }

        switch(type){
            case loanFormInputTypes.name: return nameDisabled();
            case loanFormInputTypes.course: return courseDisabled();
            case loanFormInputTypes.courseFee: return courseFeeDisabled();
            case loanFormInputTypes.loanAmount: return loanAmountDisabled();
            case loanFormInputTypes.tenure: return tenureDisabled();
            case loanFormInputTypes.advanceEmi: return advanceEmiDisabled();
        }

    }

    const getError = (type) => {

        switch(type){
            case loanFormInputTypes.name: return borrowerNameState.error;
            case loanFormInputTypes.course: return courseState.error;
            case loanFormInputTypes.courseFee: return courseFeeState.error;
            case loanFormInputTypes.loanAmount: return loanAmountState.error;
            case loanFormInputTypes.tenure: return tenureState.error;
            case loanFormInputTypes.advanceEmi: return advanceEmiState.error;
        }

    }

    const getType = (type) => {

        switch(type){
            case loanFormInputTypes.name: return "text";
            case loanFormInputTypes.course: return "text";
            case loanFormInputTypes.courseFee: return "number";
            case loanFormInputTypes.loanAmount: return "number";
            case loanFormInputTypes.tenure: return "number";
            case loanFormInputTypes.advanceEmi: return "number";
        }

    }

  return (
    <div className='column' style={{width: '100%', gap:'15px'}}>

        <Input
            label={getLabel(loanFormInputTypes.name)}
            required={getRequired(loanFormInputTypes.name)}
            showCheck={getCheck(loanFormInputTypes.name)}
            disabler={viewType != formViewTypes.VIEW}
            disablerLabel={'Same as Student'}
            disablerState={borrowerNameState.sameAsStudent}
            onDisablerStateChange={(value) => onChange(loanFormInputTypes.name, null, value, 1)}
            placeholder={getPlaceholder(loanFormInputTypes.name)}
            value={getValue(loanFormInputTypes.name)}
            onChange={(str) => onChange(loanFormInputTypes.name, str, null, 0)}
            disabled={getDisabled(loanFormInputTypes.name)}
            error={getError(loanFormInputTypes.name)}
            type={getType(loanFormInputTypes.name)}
            mandatory={true}
        />
        
        <Input
            label={getLabel(loanFormInputTypes.course)}
            required={getRequired(loanFormInputTypes.course)}
            showCheck={getCheck(loanFormInputTypes.course)}
            placeholder={getPlaceholder(loanFormInputTypes.course)}
            value={getValue(loanFormInputTypes.course)}
            onChange={(str) => onChange(loanFormInputTypes.course, str)}
            disabled={getDisabled(loanFormInputTypes.course)}
            error={getError(loanFormInputTypes.course)}
            type={getType(loanFormInputTypes.course)}
            mandatory={true}
        />

        <Input
            label={getLabel(loanFormInputTypes.courseFee)}
            required={getRequired(loanFormInputTypes.courseFee)}
            showCheck={getCheck(loanFormInputTypes.courseFee)}
            placeholder={getPlaceholder(loanFormInputTypes.courseFee)}
            leadingText={'₹'}
            value={getValue(loanFormInputTypes.courseFee)}
            onChange={(str) => onChange(loanFormInputTypes.courseFee, str)}
            disabled={getDisabled(loanFormInputTypes.courseFee)}
            error={getError(loanFormInputTypes.courseFee)}
            type={getType(loanFormInputTypes.courseFee)}
            mandatory={true}
        />

        <Input
            label={getLabel(loanFormInputTypes.loanAmount)}
            required={getRequired(loanFormInputTypes.loanAmount)}
            showCheck={getCheck(loanFormInputTypes.loanAmount)}
            placeholder={getPlaceholder(loanFormInputTypes.loanAmount)}
            leadingText={'₹'}
            value={getValue(loanFormInputTypes.loanAmount)}
            onChange={(str) => onChange(loanFormInputTypes.loanAmount, str)}
            disabled={getDisabled(loanFormInputTypes.loanAmount)}
            error={getError(loanFormInputTypes.loanAmount)}
            type={getType(loanFormInputTypes.loanAmount)}
            mandatory={true}
        />

        <Input
            label={getLabel(loanFormInputTypes.tenure)}
            required={getRequired(loanFormInputTypes.tenure)}
            showCheck={getCheck(loanFormInputTypes.tenure)}
            placeholder={getPlaceholder(loanFormInputTypes.tenure)}
            // leadingText={'₹'}
            value={getValue(loanFormInputTypes.tenure)}
            onChange={(str) => onChange(loanFormInputTypes.tenure, str)}
            disabled={getDisabled(loanFormInputTypes.tenure)}
            error={getError(loanFormInputTypes.tenure)}
            type={getType(loanFormInputTypes.tenure)}
        />

        <Dropdown 
            items={advanceEmiOptions}
            label={getLabel(loanFormInputTypes.advanceEmi)}
            required={getRequired(loanFormInputTypes.advanceEmi)}
            showCheck={getCheck(loanFormInputTypes.advanceEmi)}
            placeholder={getPlaceholder(loanFormInputTypes.advanceEmi)}
            value={getValue(loanFormInputTypes.advanceEmi)}
            onChange={(str) => onChange(loanFormInputTypes.advanceEmi, str)}
            disabled={getDisabled(loanFormInputTypes.advanceEmi)}
            error={getError(loanFormInputTypes.advanceEmi)}
        />

    </div>
  )
}


export const loanFormInputTypes = {
    name: 0,
    course: 1,
    courseFee: 2,
    loanAmount: 3,
    tenure: 4,
    advanceEmi: 5,
}