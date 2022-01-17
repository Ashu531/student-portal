import React from 'react';
import logo from '../../assets/credenc-logo.svg';
import logo2 from '../../assets/credenc-text-logo.png';
import successIcon from '../../assets/check-circle.svg';
import Button from '../elementalComponents/button/Button';
import background from '../../assets/background.png';

export default function Success() {
    return (
        <div className='success' style={{backgroundImage: `url(${background})`}}>
            <img src={logo} className='logo'/>
            <img src={logo2} className='logo-right'/>
                <div className='container'>
                    <img src={successIcon} className='icon'/>
                    <div className='header'>
                        <div className='title'>Payment Successful</div>
                        <div className='subtitle'>Your fees payment has been made!</div>
                        <div style={{display:'flex', justifyContent:'space-evenly', margin:'1.2rem 0'}}>
                        <img src={logo} className='header-logo-small'/>
                        <img src={logo2} className='header-logo'/>
                        </div>
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
                            <div className='value'>03/01/2021 14:17</div>
                        </div>
                        <div className='pair'>
                            <div className='key'>Amount</div>
                            <div className='value'>INR 14000</div>
                        </div>
                        <div className='pair'>
                            <div className='key'>Mode Of Payment</div>
                            <div className='value'>NEFT</div>
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
