import React, { useState, useEffect } from 'react'
import successIcon from '../../../assets/successIcon.svg'
import closeIcon from '../../../assets/closeIcon.svg'

export default function TransactionStatus({title,description}) {

    return (
        <div className='transaction-status'>
            <img src={successIcon} height={35} width={35} />
            <div className='title'>
                {title}
            </div>
            {
                description && 
                <div className='description'>
                    Your auto-pay has been initiated and you will be get a confirmation up within 24 hours. 
                </div>
            }
            
        </div>
    )
}
