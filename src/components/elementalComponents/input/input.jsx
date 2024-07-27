import React, { useState } from "react";
import './input.css';
import errorIcon from '../../../assets/cross.svg';
import checkIcon from '../../../assets/check.svg';
import SwitchComponent from "../switch/switch.jsx";

export function Input({
  autoFocus = false,
  label,
  required=false,
  showCheck=false,
  disabler=false,
  disablerLabel='',
  disablerState,
  onDisablerStateChange,
  placeholder,
  leadingText,
  value,
  onChange,
  disabled,
  onEnter,
  error,
  type = "text",
  classes='',
  maxLength=100,
  mandatory=false
}) {

  const handleKey = (e) => {
    if (e.keyCode === 13) {
      onEnter();
    }
  };

  const inputChange = e => {
    let currValue = e.target.value;


    if(leadingText && currValue.length >= leadingText.length){
      currValue = currValue.substring(leadingText.length + 2);
    }

    if (type == "number") {

      if(currValue.length > 0 && isNaN(currValue))
        return;

      if(onChange != null){
        onChange(currValue);
      }

    } 
    
    else if(onChange != null) onChange(currValue);

  }

  return (
    <div className={`${classes} column`}style={{width: '100%', gap: '8px'}}>

      <Label 
        showCheck={showCheck} 
        error={error} 
        label={label} 
        required={required} 
        disabler={disabler} 
        disablerLabel={disablerLabel} 
        disablerState={disablerState}
        onDisablerStateChange={onDisablerStateChange}
        mandatory={mandatory}
      />

      <div style={{textAlign: 'start', width: '100%'}}>
        <input
          className="input text-Poppins text-16 text-weight-5"
          placeholder={placeholder}
          value={leadingText ? `${leadingText}  ${value}` : value}
          onChange={inputChange}
          disabled={disabled}
          autoFocus={autoFocus ? true : false}
          onKeyDown={handleKey}
          type={'text'}
          maxLength={maxLength}
          onWheel={(e) => e.target.blur()}
          style={
            {border: error ? '1px solid #DE3B4F' : '1px solid #EAEAEA'}
          }
        ></input>
        <div className="input-error text-Poppins text-12" style={{visibility: error ? 'visible' : 'hidden'}}>{error || 'error'}</div>
      </div>
    </div>
  );
}

export function Label({
  showCheck,
  error,
  label,
  required,
  disabler,
  disablerLabel,
  disablerState,
  onDisablerStateChange,
  mandatory
}) {
  return (
    <div className="row" style={{justifyContent: 'space-between'}}>
      <div className="row label text-Poppins text-12 text-weight-5" style={{gap: '5px',flex: 'auto'}}>
          <div className={required ? 'required' : ''}>{label} {mandatory && '**'}</div>

          {(error || showCheck) && <img 
            src={error ? errorIcon : checkIcon}
            style={{width: '14px', height: '14px'}}
          />}
      </div>
      {(disabler || disablerLabel || disablerState || onDisablerStateChange) && <SwitchComponent 
        label={disablerLabel} 
        checked={disablerState}
        onChange={onDisablerStateChange}
        enabled={disabler}
      />}
    </div>
  );
}

