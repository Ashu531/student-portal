import React, { useEffect, useState } from 'react';
import backIcon from '../../../assets/caret-right.svg';
import { useNavigate } from 'react-router-dom';
import { getToken, logoutUser } from '../../../services/authService';
import Button from '../loanButton/button.jsx';

export default function Header({title, back=true, icon,openQuickView}) {

    const navigate = useNavigate();

    const _goBack=()=>{
        navigate(`/installments/${getToken()}`, {replace: true});
    }

    const logout = async (e) => {
        const loggedOut = await logoutUser();
        if(loggedOut)
            navigate('/login', {replace: true});
    }

    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {

        document.body.addEventListener('click', (e) => {
            setShowMenu(false)
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
            <div>
                <Button 
                    text='Logout'
                    classes={{
                        background: '#8F14CC',
                        borderRadius: '8px',
                        height: '44px'
                    }}
                    textClass={{
                        color: '#FFF',
                        fontSize: '14px',
                        fontFamily: 'Poppins',
                        fontWeight: 600
                    }}
                    onClick={()=>logout()}
                />
            </div>
            {/* <div className='sikshaIcon tooltip bottom' style={{display: 'flex !important', justifyContent: 'center', alignItems: 'center'}} onClick={() => setShowMenu(!showMenu)}>
                {icon && <img src={`data:image/png;base64, ${icon}`} className='shikshaIcon' height={32}/>}
                <img src={backIcon}  height={16} style={{transform: 'rotate(90deg)', margin: '0 0 8px 8px'}}/>
               
                {showMenu && <div className='tooltiptext' style={window.innerWidth < 500 ? {position:'absolute',top:'150%',left: '-8.2vw',marginLeft:0,minWidth:'135px'} : { position:'absolute',top:'150%',left: '-7vw',marginLeft:0}}>
                    <button 
                        onMouseUp={()=>openQuickView()}
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
                            cursor: 'pointer',
                            marginBottom: 8
                        }}
                    >View Transaction</button>
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
                
            </div> */}
        </div>
    )
}
