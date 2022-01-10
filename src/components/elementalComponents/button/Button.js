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

    const getClasses = () => {
        if(background === '')
            return `${size}-wrapper`;

        else
            return `${size}-wrapper-coloured`;
    }

    const [counter, setCounter] = useState(counterValue);
    useEffect(() => {
        const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
        return () => clearInterval(timer);
    }, [counter]);

    return (
        <div style={{width: '100%', display:'flex', justifyContent: 'flex-end'}}>
            {counter > 0 &&
                <button 
                    className={`${size} disabled`}
                    style={{background, margin, fontWeight:'500', color:'rgba(255, 255, 255, 0.6)'}}
                >
                    {counterText} {counter} sec..
                </button>}
            {counter == 0 && <div className={getClasses()} style={{margin}}>
                <button 
                    className={`${size}`} 
                    onClick={handleClick} 
                    style={{background}}
                >
                    {text}
                </button>
            </div>}
        </div>
    )
}
