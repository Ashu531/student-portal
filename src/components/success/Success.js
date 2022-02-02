import React, { useEffect } from 'react';
import logo from '../../assets/credenc-logo.svg';
import logo2 from '../../assets/credenc-text-logo.png';
import successIcon from '../../assets/check-circle.svg';
import Button from '../elementalComponents/button/Button';
import background from '../../assets/background.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../../services/authService';

export default function Success() {

    const navigate = useNavigate();
    const {state} = useLocation();

    let credencLogo = logo;

    const logout = async () => {
        const loggedOut = await logoutUser();
        if(loggedOut)
            navigate('/login');
    }

    useEffect(() => {
        if(!state)
            navigate('/');
        else{
            console.log(state);
            credencLogo = state.merchant_logo;
        }
    }, []);

    return (
        <div className='success' style={{backgroundImage: `url(${background})`, backgroundSize: 'cover'}}>
            <img src={credencLogo} className='logo'/>
            <img src={logo2} className='logo-right'/>
            <div className='logout-button'>
                    <Button 
                        text='Logout' 
                        handleClick={logout} 
                        classes='button-white'
                    />
            </div>
            <div className='wrapper container'>
                <div style={{width: '100%', display:'flex', justifyContent:'space-between', alignItems: 'center', margin:'1.2rem 0'}}>
                    <img src={credencLogo} className='header-logo-small'/>
                    <div className='responsive-logout'>
                        <img src={logo2} className='header-logo'/>
                        <Button 
                            text='Logout' 
                            handleClick={logout} 
                            classes='button-white'
                        />
                    </div>
                </div>
                <div className='header'>
                    <img src={successIcon} className='icon'/>
                    <div className='title'>Payment Successful</div>
                    <div className='subtitle'>{state.txnid}</div>
                </div>
                <div className='receipt-container'>
                    <div className='pair'>
                        <div className='key'>Transaction ID</div>
                        <div className='value'>XYZ123456</div>
                    </div>
                    <div className='pair'>
                        <div className='key'>College</div>
                        <div className='value'>Durham College</div>
                    </div>
                    <div className='pair'>
                        <div className='key'>{`Date & Time`}</div>
                        <div className='value'>{state.addedon}</div>
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
                        text='Download Receipt' 
                        handleClick={() => console.log('downloaded')} 
                        classes='button-big button-primary'/>
                </div>
            </div>
        </div>
    )
}
