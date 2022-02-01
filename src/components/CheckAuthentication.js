import React, { useEffect, useState } from "react";
import { Bars } from "react-loader-spinner";
import { Outlet, Navigate, useParams } from "react-router-dom";
import { authenticateUser } from "../services/authService";
import background from '../assets/background.svg';


function CheckAuthentication() {
    const {token} = useParams();
    const [authStatus, setAuthStatus] = useState(null);

    useEffect(async () => {
      let authRes = await authenticateUser(token);
      setAuthStatus(authRes);
    }, [])

    useEffect(() => {
      console.log( 'authres', authStatus);
    }, [setAuthStatus]);

    if(authStatus == null){
      return (
        <div style={{width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundImage: `url(${background})`, backgroundSize: 'cover'}}>
          <Bars color="#00BFFF" height={100} width={100}/>
        </div>
      );
    }
    else if(authStatus == true) {
      return <Outlet />;
    }

    return <Navigate replace to='/login'/>;
};

export default CheckAuthentication;
