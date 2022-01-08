import React, { useState } from 'react'
import check from '../../../assets/check-circle.svg';

export default function Field({
    placeholder,
    validate=false,
    icon,
    handleChange,
    validity,
    maxLength=10,
    width='',
    height='',
    margin='',
    value
}) {

    return (
        <div className='field-container' style={{width, height, margin}}>
            {icon && <img className='icon' src={icon}/>}
            <div className='value'>{value}</div>
        </div>
        
    )
}
