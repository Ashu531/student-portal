import React, { useEffect, useState } from 'react';
import logo from '../../assets/credenc-logo.svg';
import successIcon from '../../assets/check-circle.svg';
import Button from '../elementalComponents/button/Button';
import background from '../../assets/background.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../../services/authService';
import { downloadPdf } from '../../services/downloadPdf';

export default function Success() {

    const navigate = useNavigate(); 
    const {state} = useLocation();

    let credencLogo = logo;

    const navigateToHomePage = () => {
        navigate(`/installments`, {replace: true});
    }

    const logout = async () => {
        const loggedOut = await logoutUser();
        if(loggedOut)
            navigate('/login', {replace: true});
    }

    const getTxnId = () => {
        let length = state['txnid'].length;
        return `${state['txnid'].substring(0, 2)}...${state['txnid'].substring(length - length/5, length)}`;
    }

    useEffect(() => {
        if(!state)
            navigate('/', {replace: true});
        else{
            credencLogo = state.merchant_logo;
        }
    }, []);

    return (
        (state && <div className='success'>
            <img src={credencLogo} className='logo'/>
            <div className='logout-button'>
                    <Button 
                        text='Go to Dashboard' 
                        handleClick={navigateToHomePage} 
                        classes='button-white'
                    />
            </div>
            <div className='wrapper container'>
                <div style={{width: '100%', display:'flex', justifyContent:'space-between', alignItems: 'center', margin:'1.2rem 0'}}>
                    <img src={credencLogo} className='header-logo-small'/>
                    <div className='responsive-logout'>
                        <img src={`data:image/png;base64, ${state.studentFrontend.logo}`} className='header-logo'/>
                        <Button 
                            text='Go to Dashboard' 
                            handleClick={navigateToHomePage} 
                            classes='button-white'
                        />
                    </div>
                </div>
                <div className='header'>
                    <img src={successIcon} className='icon'/>
                    <div className='title'>Payment Successful</div>
                    <div className='subtitle'>Your fees payment has been made</div>
                </div>
                <div className='receipt-container'>
                    <div className='pair'>
                        <div className='key'>Transaction ID</div>
                        {/* <div className='value tooltip'>{getTxnId()}
                            <span className='tooltiptext'>{state.txnid}</span>
                        </div> */}
                        <div className='value'>{state.txnid}</div>
                    </div>
                    <div className='pair'>
                        <div className='key'>College</div>
                        <div className='value'>{state.udf4}</div>
                    </div>
                    <div className='pair'>
                        <div className='key'>{`Date & Time`}</div>
                        {console.log('added on', state.addedon)}
                        <div className='value'>{(new Date(`${state.addedon} UTC`)).toLocaleString()}</div>
                    </div>
                    <div className='pair'>
                        <div className='key'>Amount</div>
                        <div className='value'>INR {state.amount}</div>
                    </div>
                    <div className='pair'>
                        <div className='key'>Mode Of Payment</div>
                        <div className='value'>{state.mode}</div>
                    </div>
                </div>
                <div className='small-wrapper' style={{margin: '1.5rem 0', width: '100%'}}>
                    <Button 
                        text='Download Acknowledgement' 
                        handleClick={() => downloadPdf({...state, addedon: (new Date(`${state.addedon} UTC`)).toLocaleString()})} 
                        classes='button-big button-primary'/>
                </div>
            </div>
        </div>)
    )
}
