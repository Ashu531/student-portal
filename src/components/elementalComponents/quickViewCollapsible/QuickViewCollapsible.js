import React, { useState } from 'react';
import expandIcon from '../../../assets/caret-down.svg';
import './_quickviewcollapsible.scss';
import cloudIcon from '../../../assets/cloudDownload.svg'

export default function QuickViewCollapsible({ 
    download=true,
    children,
    collapsedChildren=[],
    handleCollapsibleDownload
}) {

    const [collapsed, setCollapsed] = useState(true);
    const handleClick = () => {
        setCollapsed(!collapsed);
    }

    return (
        <div className='quick-view-collapsible' >
            <div className='row' style={{background: `${collapsed ? '': 'rgb(255, 255, 255, 0.95)'}`}}>
                {collapsedChildren.map(child => child)}
                
                {download && <img src={cloudIcon} onClick={()=>handleCollapsibleDownload()} />}
            <div onClick={handleClick}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{transform: collapsed ? 'none' : 'rotate(180deg)'}}>
                    <g id="CaretDown">
                    <path id="Vector" d="M20.0307 9.53055L12.5307 17.0306C12.461 17.1003 12.3783 17.1556 12.2873 17.1933C12.1962 17.2311 12.0986 17.2505 12.0001 17.2505C11.9015 17.2505 11.8039 17.2311 11.7128 17.1933C11.6218 17.1556 11.5391 17.1003 11.4694 17.0306L3.96943 9.53055C3.8287 9.38982 3.74963 9.19895 3.74963 8.99993C3.74963 8.80091 3.8287 8.61003 3.96943 8.4693C4.11016 8.32857 4.30103 8.24951 4.50005 8.24951C4.69907 8.24951 4.88995 8.32857 5.03068 8.4693L12.0001 15.4396L18.9694 8.4693C19.0391 8.39962 19.1218 8.34435 19.2129 8.30663C19.3039 8.26892 19.4015 8.24951 19.5001 8.24951C19.5986 8.24951 19.6962 8.26892 19.7872 8.30663C19.8783 8.34435 19.961 8.39962 20.0307 8.4693C20.1004 8.53899 20.1556 8.62171 20.1933 8.71276C20.2311 8.8038 20.2505 8.90138 20.2505 8.99993C20.2505 9.09847 20.2311 9.19606 20.1933 9.2871C20.1556 9.37815 20.1004 9.46087 20.0307 9.53055Z" fill="#0A0A0A"/>
                    </g>
                </svg>
            </div>
                
                
            </div>
            { !collapsed && children }
        </div>
    );
}
