import React, { useState } from "react";
import checkIcon from "../../../assets/checkIcon.svg";

export default function CheckBox({ size = "1.8rem", setChecked, isChecked=false }) {

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
        background: `${isChecked ? "#73E286" : "none"}`,
      }}
    >
      {isChecked && (
        <img
          style={{ height: `${size}`, width: `${size}`, margin: 0 }}
          src={checkIcon}
          alt="check icon"
        />
      )}
    </div>
  );
}
