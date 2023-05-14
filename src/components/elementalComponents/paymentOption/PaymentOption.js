import React from 'react'

import arrow from '../../../assets/arrow-right.svg';

export default function PaymentOption({
    icon,
    tag,
    heading,
    description,
    bgColor,
    onClick
}) {
  return (
    <div className='payment-option' style={{background: bgColor}} onClick={onClick}>
        <div className='row'>
            <img src={icon} className='icon'/>
            {tag && <div className='tag'>{tag}</div>}
        </div>
        <div className='row'>
            <div className='heading'>{heading}</div>
            <img src={arrow} className='icon'/>
        </div>
        <div className='desc'>{description}</div>
    </div>
  )
}
