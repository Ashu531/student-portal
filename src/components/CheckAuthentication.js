import React from "react";
import { Navigate, useParams, Outlet } from "react-router-dom";
import { getUser, getToken } from "../services/authService";


function CheckAuthentication() {
    const { token } = useParams();

    const getAuthStatus = () => {
      if(token == null){
        const auth = getUser(getToken());
        console.log('url incorrect', auth);
        return auth;
      }
      
      const auth = getUser(token);
      console.log('url correct', auth);
      return auth;
    }

    if(!getAuthStatus()){
      return <Navigate replace to='/login'/>;
    }

    return <Outlet />;
};

export default CheckAuthentication;
