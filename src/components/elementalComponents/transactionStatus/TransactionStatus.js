import React, { useState, useEffect } from 'react'
import successIcon from '../../../assets/successIcon.svg'
import failureIcon from '../../../assets/failureIcon.svg'
import closeIcon from '../../../assets/closeIcon.svg'

export default function TransactionStatus({title,description,icon}) {

    return (
        <div className='transaction-status'>
            <img src={icon ? successIcon : failureIcon } height={35} width={35} />
            <div className='title'>
                {title}
            </div>
            {
                description && 
                <div className='description'>
                    {description} 
                </div>
            }
            
        </div>
    )
}
