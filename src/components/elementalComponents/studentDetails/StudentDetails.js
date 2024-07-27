import React from "react";

export default function StudentDetails({
    name,
    id,
    email,
    school,
    phone_number
}) {
  return (
    <div className="student-details">
      <div className="row">
        <div className="field">Name</div>
        <div className="value">{name}</div>
      </div>
      <div className="row">
        <div className="field">Phone Number</div>
        <div className="value">{phone_number}</div>
      </div>
      <div className="row">
        <div className="field">Email</div>
        <div className="value">{email}</div>
      </div>
      <div className="row">
        <div className="field">Institute</div>
        <div className="value">{school}</div>
      </div>
    </div>
  );
}
