import React, { useEffect, useState } from "react";
import { Bars } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { getToken } from "../services/authService";
import background from '../assets/background.svg';


function InitialRoute() {
    const navigate = useNavigate();
    useEffect(() => {
        const token = getToken();
        if(token && token !== ''){
            navigate(`/home/${token}`);
        }
        else {
            navigate('/login');
        }
    }, []);

    return (
        <div style={{width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundImage: `url(${background})`, backgroundSize: 'cover'}}>
          <Bars color="#00BFFF" height={100} width={100}/>
        </div>
    )
};

export default InitialRoute;
