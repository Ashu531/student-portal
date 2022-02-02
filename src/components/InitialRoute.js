import React, { useEffect, useState } from "react";
import { Bars } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { getToken } from "../services/authService";
import background from '../assets/background.png';


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
        <div className="credenc-loader fullscreen-loader" style={{backgroundImage: `url(${background})`, backgroundSize: 'cover'}}>
          <Bars color="#00BFFF" height={100} width={100}/>
        </div>
    )
};

export default InitialRoute;
