import React, { useState } from 'react';
import collapseIcon from '../../../assets/caret-up.svg';
import expandIcon from '../../../assets/caret-down.svg';

export default function Collapsible({ student, collapsed, handleClick }) {

    return (
        <div className='collapsible' onClick={handleClick}>
            {collapsed ? 
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div className='row' style={{width: '85%'}}>
                        <div className='field'>Name</div>
                        <div className='value'>{student.name}</div>
                    </div>
                    <img src={expandIcon}/>
                </div>
             :
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div className='header'>Student Details</div>
                    <img src={collapseIcon}/>
                </div>
            }
            
            {
            !collapsed && <div className="content">
                <div className='row'>
                    <div className='field'>Name</div>
                    <div className='value'>{student.name}</div>
                </div>
                <div className='row'>
                    <div className='field'>College</div>
                    <div className='value'>{student.college}</div>
                </div>
                <div className='row'>
                    <div className='field'>Course</div>
                    <div className='value'>{student.course}</div>
                </div>
                <div className='row'>
                    <div className='field'>Unique ID</div>
                    <div className='value'>{student.id}</div>
                </div>
            </div>
            }
        </div>
    )
}
