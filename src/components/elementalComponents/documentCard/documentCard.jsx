import React, { useEffect, useState } from 'react';
import pendingIcon from '../../../assets/pendingIcon.svg'
import './documentCard.css';

export default function DocumentCard({
    title,
    desc,
    instruction,
    isMandatory=true,
    onRemove,
    onClick
}) {

  return (
    <div className='document-card-container' onClick={onClick}> 
        {!isMandatory && <div className='close-button' onClick={onRemove}>X</div>}
        <div className='row'>
            <div className='document-card-header'>
                {title}
            </div>
            <div className='pending-icon-content'>
                <img src={pendingIcon} height={12} width={12} style={{objectFit: 'contain'}} />
            </div>
        </div>
        <div className='column'>
            <div className='document-card-desc'>
                {desc}
            </div>
            <div className='document-card-desc'>
                {instruction}
            </div>
        </div>
        
    </div>
  )
}



