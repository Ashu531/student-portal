import React from 'react';
import logo from '../../assets/credenc-logo-big.png';
import logo2 from '../../assets/credenc-text-logo.png';
import successIcon from '../../assets/check-circle.svg';
import Button from '../elementalComponents/button/Button';

export default function Success() {
    return (
        <div className='success'>
            <img src={logo} className='logo'/>
            <img src={logo2} className='logo-right'/>
            <div className='container'>
                <img src={successIcon} className='icon'/>
                <div className='header'>
                    <div className='title'>Payment Successful</div>
                    <div className='subtitle'>Your fees payment has been made!</div>
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
                <Button text='Download Receipt' handleClick={() => console.log('downloaded')}/>
            </div>
        </div>
    )
}
