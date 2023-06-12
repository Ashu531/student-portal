import React, { useEffect } from 'react';
import Button from '../button/Button';
import checkIcon from '../../../assets/blackCheck.svg'

export default function DetailBanner({ 
    handleSubmit, 
    buttonText,
    heading,
    subHeading, 
}) 
{

    return (
        <div className='detail-banner'>
                <div className='detail-banner-content'>
                    <img src={checkIcon} alt="status-icon" height={25} width={25} style={{objectFit:'contain'}}/>
                    <p className='title'>{heading}</p>
                    <p className='sub-title'>{subHeading}</p>
                </div>
                <div className='button-container'>
                    <Button 
                        text={buttonText} 
                        classes='button-small button-primary' 
                        handleClick={handleSubmit}
                    />
                </div>
        </div>
    )
}
