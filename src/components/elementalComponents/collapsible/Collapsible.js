import React, { useState } from "react";
import collapseIcon from "../../../assets/caret-up.svg";
import expandIcon from "../../../assets/caret-down.svg";

export default function Collapsible({
  student,
  students,
  collapsed,
  handleClick,
  handleStudentClick
}) {
  return (
    <div className="collapsible" onClick={handleClick}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="row" style={{ width: "85%" }}>
          <div className="field">Student</div>
          <div className="value">{student.name}</div>
        </div>
        <img src={expandIcon} />
      </div>

      {!collapsed &&
        <div style={{background: 'rgba(255, 255, 255, 0.1)', borderRadius: '0.8rem', overflow: 'hidden'}}>
          {students.map((student) => (
                <div className="selectable" onClick={() => handleStudentClick(student)}>{student.name}</div>
          ))}
      </div>
}
    </div>
  );
}
