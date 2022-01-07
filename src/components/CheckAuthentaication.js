import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

const CheckAuthentication = (ActualComponent) => {
  class Authenticate extends Component {
    render() {
      const { authkey } = this.props;
      return (
        <>
          {authkey ? (
            <ActualComponent {...this.props} />
          ) : (
            <Redirect to="/login" />
          )}
        </>
      );
    }
  }
  const mapStateToProps = (state) => ({
    authkey: state.auth_token,
  });
  return connect(mapStateToProps)(Authenticate);
};

export default CheckAuthentication;
