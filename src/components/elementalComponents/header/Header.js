import React, { useEffect, useState } from 'react';
import backIcon from '../../../assets/caret-right.svg';
import shikshaIcon from '../../../assets/shikshaIcon.svg'
import { useParams, useNavigate } from 'react-router-dom';
import { getToken } from '../../../services/authService';

export default function Header({title, back=true, icon}) {

    const navigate = useNavigate();

    const _goBack=()=>{
        navigate(`/installments/${getToken()}`, {replace: true});
    }

    return (
        <div className='header-component'>
            <div className='heading'>
                {
                    back && 
                    <div className='backIcon' onClick={()=>_goBack()}>
                        <img src={backIcon} alt="backIcon" height={20} width={20} />
                    </div> 
                }
               
                <span className="title">{title}</span>
            </div>
            <div className='sikshaIcon'>
                {icon && <img src={`data:image/png;base64, ${icon}`} className='shikshaIcon' height={32}/>}
            </div>
        </div>
    )
}
