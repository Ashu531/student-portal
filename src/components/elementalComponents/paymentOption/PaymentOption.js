import React from 'react'
import credencPaymentLogo from '../../../assets/credencPaymentLogo.svg'
import onlinePaymentIcon from '../../../assets/onlinePaymentIcon.svg'

export default function PaymentOption({
    icon,
    tag,
    heading,
    description,
    bgColor,
    onClick,
    disabled,
    type
}) {

    const getArrow = () => {
        return  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="12" viewBox="0 0 28 12" fill="none">
                    <path d="M1.64014 5.95996H26.6401" stroke={bgColor} stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M27 5.96C23.76 6.32 20.52 8.12 20.16 11" stroke={bgColor} stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M27 5.96004C23.76 5.60004 20.52 3.80004 20.16 0.920044" stroke={bgColor} stroke-width="1.5" stroke-linecap="round"/>
                </svg>
    }

  return (
    <div className='payment-option' style={ disabled ? {opacity: 0.5,background: '#EBEBEB'} : {background: bgColor}} onClick={!disabled && onClick}>
        <div className='row'>
            <div className='row' style={{justifyContent:'flex-start'}}>
                <img src={icon} className='icon'/>
                {tag && <div className='tag'>{tag}</div>}
            </div>
            <div>
                {type === 'loan' && <img src={credencPaymentLogo} className='icon' />}
                {type === 'online' && <img src={onlinePaymentIcon} className='icon' />}
            </div>
        </div>
        <div className='row'>
            <div className='heading'>{heading}</div>
        </div>
        <div className='row'>
            <div className='desc'>{description}</div>
            <div className='icon-back'>{getArrow()}</div>
        </div>
    </div>
  )
}
