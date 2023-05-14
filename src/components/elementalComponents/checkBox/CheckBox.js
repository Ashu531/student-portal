import React, { useState } from "react";
import checkIcon from "../../../assets/check-icon.svg";

export default function CheckBox({ size = "1.8rem", setChecked, isChecked=false, disabled=false }) {

  const handleClick = (e) => {
    e.stopPropagation();
    setChecked(!isChecked);
  };
  
  return (
    <div
      className="checkBox"
      onClick={(e) => handleClick(e)}
      style={{
        width: `${size}`,
        height: `${size}`,
        border: `${isChecked ? "" : "1px solid #BFBFBF"}`,
        pointerEvents: `${disabled ? 'none': ''}`
      }}
    >
      {isChecked && (
        <img
          style={{ height: '1.8rem', width: '1.8rem', margin: 0 }}
          src={checkIcon}
          alt="check icon"
        />
      )}
    </div>
  );
}
