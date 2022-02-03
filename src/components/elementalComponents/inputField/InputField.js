import React, { useState } from 'react'
import check from '../../../assets/check-circle.svg';

export default function InputField({
    placeholder,
    validate=false,
    icon,
    handleChange,
    validity,
    error,
    maxLength=10,
    width='',
    height='',
    margin='',
    inputType='text'
}) {

    return (
        <div style={{ width: '100%' }}>
            <div className='small-wrapper input-container' style={{width, height, margin}}>
                {icon && <img className='icon' src={icon} style={{margin: '0.4rem'}}/>}
                <input 
                    className='input-field' 
                    placeholder={placeholder}
                    onChange={(e) => handleChange(e.target.value)}
                    maxLength={maxLength}
                    type={inputType}
                ></input>
                {validate && validity && <img className='icon' src={check}/>}
            </div>
            {error && <div className='error'>
                {error}
            </div>}
        </div>
        
    )
}
