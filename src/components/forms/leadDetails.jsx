import React, { useEffect, useState } from 'react';
import { Input } from '../../components/elementalComponents/input/input.jsx';


export const createLeadFormState = {
    leadId: '',
    name: '',
    institute: '',
    mobile: '',
    email: ''
}

export default function LeadDetailForm({
    viewType,
    leadIdState,
    nameState,
    instituteState,
    mobileState,
    emailState,
    onChange,
}) {

    const leadIdLabel = () => `${instituteState.value} Lead ID`;
    const nameLabel = () => 'Student Name';
    const instituteLabel = () => 'Institute';
    const mobileLabel = () => 'Mobile';
    const emailLabel = () => 'Email';

    const getLabel = (type) => {
        
        switch(type){
            case studentFormInputTypes.leadId: return leadIdLabel();
            case studentFormInputTypes.name: return nameLabel();
            case studentFormInputTypes.institute: return instituteLabel();
            case studentFormInputTypes.mobile: return mobileLabel();
            case studentFormInputTypes.email: return emailLabel();
        }
        
    }


    const leadIdRequired = () => false;
    const nameRequired = () => viewType == formViewTypes.CREATE;
    const instituteRequired = () => viewType == formViewTypes.CREATE;
    const mobileRequired = () => viewType == formViewTypes.CREATE;
    const emailRequired = () => viewType == formViewTypes.CREATE;

    const getRequired = (type) => {

        switch(type){
            case studentFormInputTypes.leadId: return leadIdRequired();
            case studentFormInputTypes.name: return nameRequired();
            case studentFormInputTypes.institute: return instituteRequired();
            case studentFormInputTypes.mobile: return mobileRequired();
            case studentFormInputTypes.email: return emailRequired();
        }

    }


    const leadIdCheck = () => false;
    const nameCheck = () => false;
    const instituteCheck = () => false;
    const mobileCheck = () => false;
    const emailCheck = () => false;

    const getCheck = (type) => {
        switch(type){
            case studentFormInputTypes.leadId: return leadIdCheck();
            case studentFormInputTypes.name: return nameCheck();
            case studentFormInputTypes.institute: return instituteCheck();
            case studentFormInputTypes.mobile: return mobileCheck();
            case studentFormInputTypes.email: return emailCheck();
        }
    }


    const leadIdPlaceholder = () => '';
    const namePlaceholder = () => '';
    const institutePlaceholder = () => '';
    const mobilePlaceholder = () => '';
    const emailPlaceholder = () => '';
    
    const getPlaceholder = (type) => {
        switch(type){
            case studentFormInputTypes.leadId: return leadIdPlaceholder();
            case studentFormInputTypes.name: return namePlaceholder();
            case studentFormInputTypes.institute: return institutePlaceholder();
            case studentFormInputTypes.mobile: return mobilePlaceholder();
            case studentFormInputTypes.email: return emailPlaceholder();
        }
    }

    const getValue = (type) => {
        switch(type){
            case studentFormInputTypes.leadId: return leadIdState.value;
            case studentFormInputTypes.name: return nameState.value;
            case studentFormInputTypes.institute: return instituteState.value;
            case studentFormInputTypes.mobile: return mobileState.value;
            case studentFormInputTypes.email: return emailState.value;
        }
    }

    const leadIdDisabled = () => leadIdState.disabled;
    const nameDisabled = () => nameState.disabled;
    const instituteDisabled = () => instituteState.disabled;
    const mobileDisabled = () => mobileState.disabled;
    const emailDisabled = () => emailState.disabled;

    const getDisabled = (type) => {

        if(viewType == formViewTypes.VIEW){
            return true;
        }

        switch(type){
            case studentFormInputTypes.leadId: return leadIdDisabled();
            case studentFormInputTypes.name: return nameDisabled();
            case studentFormInputTypes.institute: return instituteDisabled();
            case studentFormInputTypes.mobile: return mobileDisabled();
            case studentFormInputTypes.email: return emailDisabled();
        }

    }

    const getError = (type) => {

        switch(type){
            case studentFormInputTypes.leadId: return leadIdState.error;
            case studentFormInputTypes.name: return nameState.error;
            case studentFormInputTypes.institute: return instituteState.error;
            case studentFormInputTypes.mobile: return mobileState.error;
            case studentFormInputTypes.email: return emailState.error;
        }

    }

    const getType = (type) => {

        switch(type){
            case studentFormInputTypes.leadId: return "text";
            case studentFormInputTypes.name: return "text";
            case studentFormInputTypes.institute: return "text";
            case studentFormInputTypes.mobile: return "number";
            case studentFormInputTypes.email: return "text";
        }

    }


  return (
    <div className='column' style={{width: '100%', gap:'15px'}}>
        
        {/* <Input
            label={getLabel(studentFormInputTypes.leadId)}
            required={getRequired(studentFormInputTypes.leadId)}
            showCheck={getCheck(studentFormInputTypes.leadId)}
            placeholder={getPlaceholder(studentFormInputTypes.leadId)}
            value={getValue(studentFormInputTypes.leadId)}
            onChange={(str) => onChange(studentFormInputTypes.leadId, str)}
            disabled={getDisabled(studentFormInputTypes.leadId)}
            error={getError(studentFormInputTypes.leadId)}
            type={getType(studentFormInputTypes.leadId)}
        /> */}

        <Input
            label={getLabel(studentFormInputTypes.name)}
            required={getRequired(studentFormInputTypes.name)}
            showCheck={getCheck(studentFormInputTypes.name)}
            placeholder={getPlaceholder(studentFormInputTypes.name)}
            value={getValue(studentFormInputTypes.name)}
            onChange={(str) => onChange(studentFormInputTypes.name, str)}
            disabled={getDisabled(studentFormInputTypes.name)}
            error={getError(studentFormInputTypes.name)}
            type={getType(studentFormInputTypes.name)}
        />

        <Input
            label={getLabel(studentFormInputTypes.institute)}
            required={getRequired(studentFormInputTypes.institute)}
            showCheck={getCheck(studentFormInputTypes.institute)}
            placeholder={getPlaceholder(studentFormInputTypes.institute)}
            value={getValue(studentFormInputTypes.institute)}
            onChange={(str) => onChange(studentFormInputTypes.institute, str)}
            disabled={getDisabled(studentFormInputTypes.institute)}
            error={getError(studentFormInputTypes.institute)}
            type={getType(studentFormInputTypes.institute)}
        />

        <Input
            label={getLabel(studentFormInputTypes.mobile)}
            required={getRequired(studentFormInputTypes.mobile)}
            showCheck={getCheck(studentFormInputTypes.mobile)}
            placeholder={getPlaceholder(studentFormInputTypes.mobile)}
            value={getValue(studentFormInputTypes.mobile)}
            onChange={(str) => onChange(studentFormInputTypes.mobile, str)}
            disabled={getDisabled(studentFormInputTypes.mobile)}
            error={getError(studentFormInputTypes.mobile)}
            type={getType(studentFormInputTypes.mobile)}
            maxLength={10}
        />

        <Input
            label={getLabel(studentFormInputTypes.email)}
            required={getRequired(studentFormInputTypes.email)}
            showCheck={getCheck(studentFormInputTypes.email)}
            placeholder={getPlaceholder(studentFormInputTypes.email)}
            value={getValue(studentFormInputTypes.email)}
            onChange={(str) => onChange(studentFormInputTypes.email, str)}
            disabled={getDisabled(studentFormInputTypes.email)}
            error={getError(studentFormInputTypes.email)}
            type={getType(studentFormInputTypes.email)}
        />

    </div>
  )
}


export const studentFormInputTypes = {
    leadId: 0,
    name: 1,
    institute: 2,
    mobile: 3,
    email: 4
}

export const formViewTypes = {
    CREATE: 0,
    EDIT: 1,
    VIEW: 2
}
