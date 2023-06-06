import React, { useState, useEffect } from 'react';
import { Stepper } from 'react-form-stepper';

const stepperArray = [
    {label: 'Applied'}, {label: 'Approved'}, {label: 'Disbursed'}
]

export default function Steps({status}) {

    const [stepStatus,setStepStatus] = useState(0);

    useEffect(()=>{
      if(status === 'applied'){
        setStepStatus(0)
      }else if(status === 'approved'){
        setStepStatus(1)
      }else{
        setStepStatus(2)
      }
    },[])

    return (
        <div className='steps-container' style={innerWidth > 500 ? {width: '132vw',marginLeft: '-21vw'} : {width: '130vw',marginLeft: '-22vw'}}>
            <Stepper
                steps={stepperArray}
                activeStep={stepStatus}
                styleConfig={{
                    activeBgColor: '#404040',
                    activeTextColor:'#ffffff',
                    completedTextColor:'#ffffff',
                    completedBgColor: '#96C70A',
                    size: 30,
                    circleFontSize: 14,
                    labelFontSize: 12
                }}
            />
        </div>
    )
}
