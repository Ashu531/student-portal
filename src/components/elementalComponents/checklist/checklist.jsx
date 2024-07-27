import React, { useEffect, useState } from 'react';
import './/checklist.css';
import plusIcon from '../../../assets/plusIcon.svg';
import caretDown from '../../../assets/caret-up.svg';


export default function ChoiceBox({
    list,
    onSelect,
    title,
    selected,
}) {

    const [ expanded, setExpanded ] = useState(false);

  return (
    <div style={{position: 'relative', width: '100%'}}>
        <Checklist 
            list={[...list]}
            onSelect={onSelect}
            expanded={expanded}
            selected={selected}
        />
        <DropTitle 
            expanded={expanded}
            title={title}
            leadingIcon={plusIcon}
            trailingIcon={caretDown}
            onClick={() => setExpanded(!expanded)}
        />
    </div>
  )
}

export function Checklist({
    list=[],
    type,
    selected,
    onSelect,
    expanded
}) {

  return (
    <div className={`checklist-container ${expanded ? 'checklist-expanded' : ''}`}>
        {list.map((item, index) => (
            <div 
                key={`${item}-${index}`} 
                className='row list-item'
                style={{gap: '10px'}}
                onClick={() => onSelect(item, index)}
            >
                <input type={'checkbox'} className='checkbox' checked={selected.has(item)} /> 
                <div className='label text-Poppins text-16'>{item}</div>
            </div>
        ))}
    </div>
  )
}

export const checklistTypes = {
    singleChoice: 1,
    multiChoice: 2
}


export function DropTitle({
    leadingIcon,
    trailingIcon,
    title,
    expanded,
    onClick
}) {

  return (
    <div className={`row droptitle ${expanded ? 'expanded' : ''}`} style={{gap: '10px',cursor:'pointer'}} onClick={onClick}>
        {leadingIcon && <img src={leadingIcon} style={{width: '20px', height: '20px'}}/>}
        <div className='text-Poppins text-weight-5 text-16 title'>{title}</div>
        {trailingIcon && 
            <img 
                src={trailingIcon} 
                style={{
                    width: '20px', 
                    height: '20px', 
                    marginLeft: 'auto', 
                    transform: expanded ? 'rotate(-180deg)' : 'none',
                    transition: 'transform 0.3s'
                }}
            />
        }
    </div>
  )
}





