import React from "react";

export default function StudentDetails({
    name,
    id,
    grade,
    school
}) {
  return (
    <div className="student-details">
      <div className="row">
        <div className="field">Name</div>
        <div className="value">{name}</div>
      </div>
      <div className="row">
        <div className="field">Admission No.</div>
        <div className="value">{id}</div>
      </div>
      <div className="row">
        <div className="field">Grade/Course</div>
        <div className="value">{grade}</div>
      </div>
      <div className="row">
        <div className="field">Institute</div>
        <div className="value">{school}</div>
      </div>
    </div>
  );
}
