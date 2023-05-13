import React, { useEffect, useState } from 'react';
import backIcon from '../../../assets/caret-right.svg';
import shikshaIcon from '../../../assets/shikshaIcon.svg'

export default function Header({title}) {

    return (
        <div className='header'>
            <div className='heading'>
                <div className='backIcon'>
                    <img src={backIcon} alt="backIcon" height={20} width={20} />
                </div>
                <span className="title">{title}</span>
            </div>
            <div className='sikshaIcon'>
                <img src={shikshaIcon} alt='shikshaIcon' height={32} width={28} />
            </div>
        </div>
    )
}
