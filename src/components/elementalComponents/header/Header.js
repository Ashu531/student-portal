import React, { useEffect, useState } from 'react';
import backIcon from '../../../assets/caret-right.svg';
import { useNavigate } from 'react-router-dom';
import { getToken, logoutUser } from '../../../services/authService';

export default function Header({title, back=true, icon}) {

    const navigate = useNavigate();

    const _goBack=()=>{
        navigate(`/installments/${getToken()}`, {replace: true});
    }

    const logout = async (e) => {
        e.stopPropagation();
        const loggedOut = await logoutUser();
        if(loggedOut)
            navigate('/login', {replace: true});
    }

    const [showLogout, setShowLogout] = useState(false);

    useEffect(() => {

        document.body.addEventListener('click', (e) => {
            console.log('hereeee');
            setShowLogout(false)
        }, true);

        return () => document.body.removeEventListener('click');

    }, [])

    return (
        <div className='header-component'>
            <div className='heading'>
                {
                    back && 
                    <div className='backIcon' onClick={()=>_goBack()}>
                        <img src={backIcon} alt="backIcon" height={20} width={20} />
                    </div> 
                }
               
                <span className="title">{title}</span>
            </div>
            <div className='sikshaIcon tooltip bottom' style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} onClick={() => setShowLogout(!showLogout)}>
                {icon && <img src={`data:image/png;base64, ${icon}`} className='shikshaIcon' height={32}/>}
                <img src={backIcon}  height={16} style={{transform: 'rotate(90deg)', margin: '0 0 8px 8px'}}/>
                {showLogout && <div className='tooltiptext'>
                    <button 
                        onMouseUp={logout}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            background: '#8F14CC',
                            borderRadius: '1rem',
                            outline: 'none',
                            border: 'none',
                            textAlign: 'center',
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            color: '#FFFFFF',
                            textAlign: 'center',
                            fontFamily: 'Poppins',
                            fontSize: '14px',
                            fontStyle: 'normal',
                            fontWeight: '600',
                            lineHeight: 'normal',
                            cursor: 'pointer'
                        }}
                    >Logout</button>
                </div>}
            </div>
        </div>
    )
}
