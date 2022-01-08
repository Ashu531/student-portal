import React, { useState, useEffect } from 'react'

export default function Button({
    text='',
    handleClick,
    background='',
    margin='',
    counterValue=0,
    counterText='',
    size='button-big'
}) {

    const [counter, setCounter] = useState(counterValue);
    useEffect(() => {
        const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
        return () => clearInterval(timer);
    }, [counter]);

    return (
        <div style={{width: '100%'}}>
            {counter > 0 && <button 
                className={`${size} disabled`}
                style={{background, margin, fontWeight:'500', color:'rgba(255, 255, 255, 0.6)'}}
            >
                {counterText} {counter} sec..
            </button>}
            {counter == 0 && <button 
                className={`${size}`} 
                onClick={handleClick} 
                style={{background, margin}}
            >
                {text}
            </button>}
        </div>
    )
}
