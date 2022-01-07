import React, { useState } from 'react'
import check from '../../../assets/check-circle.svg';

export default function InputField({
    placeholder,
    validate=false,
    icon,
    handleChange,
    validity,
    maxLength=10,
    width='',
    height='',
    margin=''
}) {

    return (
        <div className='input-container' style={{width, height, margin}}>
            {icon && <img className='icon' src={icon}/>}
            <input 
                className='input-field' 
                placeholder={placeholder}
                onChange={(e) => handleChange(e.target.value)}
                maxLength={maxLength}
            ></input>
            {validate && validity && <img className='icon' src={check}/>}
        </div>
        
    )
}
