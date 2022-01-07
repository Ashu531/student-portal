import React from 'react'
import InputField from '../inputField/InputField'

export default function OtpField({ handleChange, otp }) {

    const inputfocus = (e) => {
        if (e.key === "Delete" || e.key === "Backspace") {
            const next = e.target.tabIndex - 2;
            if (next > -1) {
                e.target.form.elements[next].focus()
            }
        }
        else {
            let isnum = /^[\d A-Z]+$/.test(e.target.value);
            if(isnum){
                const next = e.target.tabIndex;
                if (next < 6) {
                e.target.form.elements[next].focus()
                }
            }
        }
      }

    return (
        <form className='otp-container'>
            <input 
                className='input-field'
                onChange={(e) => handleChange(e.target.value, 0)}
                maxLength={1}
                tabIndex={1}
                onKeyUp={e => inputfocus(e)}
                value={otp.values[0]}
            ></input>
            <input 
                className='input-field'
                onChange={(e) => handleChange(e.target.value, 1)}
                maxLength={1}
                tabIndex={2}
                onKeyUp={e => inputfocus(e)}
                value={otp.values[1]}
            ></input>
            <input 
                className='input-field'
                onChange={(e) => handleChange(e.target.value, 2)}
                maxLength={1}
                tabIndex={3}
                onKeyUp={e => inputfocus(e)}
                value={otp.values[2]}
            ></input>
            <input 
                className='input-field'
                onChange={(e) => handleChange(e.target.value, 3)}
                maxLength={1}
                tabIndex={4}
                onKeyUp={e => inputfocus(e)}
                value={otp.values[3]}
            ></input>
            <input 
                className='input-field'
                onChange={(e) => handleChange(e.target.value, 4)}
                maxLength={1}
                tabIndex={5}
                onKeyUp={e => inputfocus(e)}
                value={otp.values[4]}
            ></input>
            <input 
                className='input-field'
                onChange={(e) => handleChange(e.target.value, 5)}
                maxLength={1}
                tabIndex={6}
                onKeyUp={e => inputfocus(e)}
                value={otp.values[5]}
            ></input>
        </form>
    )
}
