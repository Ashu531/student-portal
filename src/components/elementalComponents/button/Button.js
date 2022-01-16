import React, { useState, useEffect } from 'react'

export default function Button({
    text='',
    handleClick,
    classes='',
    counterValue=0,
    counterText='',
}) {

    const [counter, setCounter] = useState(counterValue);
    useEffect(() => {
        const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
        return () => clearInterval(timer);
    }, [counter]);

    return (
        <div style={{width: '100%', display:'flex', justifyContent: 'flex-end'}}>
            {counter > 0 &&
                <button 
                    className={`button ${classes} disabled`}
                >
                    {counterText} {counter} sec..
                </button>}
            {counter == 0 &&
                <button 
                    className={`button ${classes}`} 
                    onClick={handleClick}
                >
                    {text}
                </button>}
        </div>
    )
}
