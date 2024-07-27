import React, { Component } from "react";
import { Outlet, Navigate } from "react-router-dom";

const CheckAuthentication = (ActualComponent) => {
  class Authenticate extends Component {
    render() {
      const authkey = localStorage.getItem('fms-student-portal');
      return (
        <>
          {authkey ? (
            <ActualComponent {...this.props} />
          ) : (
            <Navigate to="/login" />
          )}
        </>
      );
    }
  }

  return Authenticate;
};

export default CheckAuthentication;
