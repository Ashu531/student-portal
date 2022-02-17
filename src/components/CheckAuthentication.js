import React, { useEffect, useState } from "react";
import { Bars, TailSpin } from "react-loader-spinner";
import { Outlet, Navigate, useParams } from "react-router-dom";
import { authenticateUser, delay } from "../services/authService";
import background from '../assets/background.png';


function CheckAuthentication() {
    const {token} = useParams();
    const [authStatus, setAuthStatus] = useState(null);

    useEffect(async () => {
      let authRes = await authenticateUser(token);
      setAuthStatus(authRes);
    }, [])

    // useEffect(() => {
    //   console.log( 'authres', authStatus);
    // }, [setAuthStatus]);

    if(authStatus == null){
      return (
        <div className="credenc-loader fullscreen-loader" style={{backgroundImage: `url(${background})`, backgroundSize: 'cover'}}>
          <TailSpin color="#00BFFF" height={100} width={100}/>
        </div>
      );
    }
    else if(authStatus == true) {
      return <Outlet />;
    }

    return <Navigate replace to='/login'/>;
};

export default CheckAuthentication;
