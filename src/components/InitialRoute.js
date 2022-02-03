import React, { useEffect, useState } from "react";
import { Bars, TailSpin } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { delay, getToken } from "../services/authService";
import background from '../assets/background.png';


function InitialRoute() {
    const navigate = useNavigate();
    useEffect(() => {
        const token = getToken();
        if(token && token !== ''){
            navigate(`/home/${token}`, {replace: true});
        }
        else {
            navigate('/login', {replace: true});
        }
    }, []);

    return (
        <div className="credenc-loader fullscreen-loader" style={{backgroundImage: `url(${background})`}}>
          <TailSpin color="#00BFFF" height={100} width={100}/>
        </div>
    )
};

export default InitialRoute;
