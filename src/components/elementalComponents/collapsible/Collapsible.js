import React, { useState } from "react";
import collapseIcon from "../../../assets/caret-up.svg";
import expandIcon from "../../../assets/caret-down.svg";

export default function Collapsible({
  student,
  students,
  title,
  collapsed,
  handleClick,
  width,
  handleStudentClick
}) {
  return (
    <div className="collapsible" onClick={handleClick} style = {{
      boxShadow: collapsed ? 'none' : '0px 4px 4px rgba(0, 0, 0, 0.25)',
      width: width 
    }}>
        <div className="collapsible-row">
          <div>
            <div className="field">{title}</div>
            <div className="value">{student.name}</div>
          </div>
          
          <img src={expandIcon} />
          
        </div>

      {!collapsed && <div className="dropdown-container">
        {students.length > 1 &&

            students.map((student) => (
              <div className="collapsible-row dropdown" onClick={() => handleStudentClick(student)}>
                <div className="value">{student.name}</div>
              </div>
            ))
          
        }
      </div>}

      
      </div>
  );
}
