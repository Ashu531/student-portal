import React, { useState } from "react";
import checkIcon from "../../../assets/check-icon.svg";

export default function CheckBox({ size = "2.2rem", setChecked, isChecked=false, disabled=false }) {

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
        background: `${isChecked ? "rgba(158, 60, 165, 1)" : "none"}`,
        border: `${isChecked ? "2px solid rgba(158, 60, 165, 1)" : ""}`,
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
