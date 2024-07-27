import React, { useEffect, useState } from 'react';
import './dropdown.css';

import { Label } from '../input/input.jsx';

export function Dropdown({
    label,
    items=[],
    required=false,
    showCheck=false,
    value,
    onChange,
    disabled,
    error,
    classes='',
    placeholder,
  }) {

    const defaultPlaceholder = 'Select';
    const [dropdownValue, setDropdownValue] = useState(placeholder ? placeholder : defaultPlaceholder);

    return (
      <div className={`${classes} column`}style={{width: '100%', gap: '8px'}}>
  
        <Label showCheck={showCheck} error={error} label={label} required={required} />

        <div style={{textAlign: 'start', width: '100%'}}>
            <select
                onChange={(e) => onChange != null ? e.target.value == placeholder ? onChange('') : onChange(e.target.value) : setDropdownValue(e.target.value)}
                className="dropdown text-Poppins text-16 text-weight-5"
                disabled = {disabled}
                value={value ? value : dropdownValue}
                style={{
                    color: (value && value == -1) || (value == null && dropdownValue == placeholder) ? '#8C8C8C' : '#0B090D',
                    outline: error ? '1px solid #DE3B4F' : '1px solid #EAEAEA',
                    background: '#ffffff'
                }}
            >
                {placeholder && <option>{placeholder}</option>}
                {items.map((item, index) => (
                    <option key={index} value={item.value} disabled={item.disabled}>
                        {item.label}
                    </option>
                ))}
            </select>
    
            <div style={{textAlign: 'start'}}>
                <div className="input-error text-Poppins text-12" style={{visibility: error ? 'visible' : 'hidden'}}>{error || 'error'}</div>
            </div>
        </div>
      </div>
    );
  }
