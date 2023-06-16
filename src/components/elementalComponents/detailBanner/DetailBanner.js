import React, { useEffect,useState } from 'react';
import Button from '../button/Button';
import checkIcon from '../../../assets/blackCheck.svg'
import awaitIcon from '../../../assets/awaitIcon.svg'

export default function DetailBanner({ 
    handleSubmit, 
    dashboardStatus
}) 
{

    const [heading,setHeading] = useState('')
    const [subHeading,setSubHeading] = useState('')
    const [buttonText,setButtonText] = useState('')

    useEffect(()=>{
        if(dashboardStatus === 'initiated'){
            setHeading('Your fee Auto-Pay mandate is under review!')
            setSubHeading('Your bank is in the process of approving your Auto-Pay mandate. Check back in 24 hours!')
        }else if(dashboardStatus === 'setup_done'){
            setHeading('Your fee Auto-Pay has been set up!')
            setSubHeading('Sit back and relax, your child’s fee will be auto-deducted once the due date comes.')
            setButtonText('See Details')
        }
    },[])

    return (
        <div className='detail-banner'>
                <div className='detail-banner-content'>
                    <img src={dashboardStatus === 'setup_done' ?  checkIcon : awaitIcon} alt="status-icon" height={25} width={25} style={{objectFit:'contain'}}/>
                    <p className='title'>{heading}</p>
                    <p className='sub-title'>{subHeading}</p>
                </div>
                {
                    dashboardStatus === 'setup_done' && 
                    <div className='button-container'>
                        <Button 
                            text={buttonText} 
                            classes='button-small button-primary' 
                            handleClick={handleSubmit}
                        />
                    </div>
                }
                
        </div>
    )
}
