import React from 'react';

export default function TcModal({content='', handleClose}) {
  return (
    <div className='tc'>
        <div className='tc-content'>
            <div className="close" onClick={handleClose}>&times;</div>
            <div>{content}</div>
        </div>
    </div>
  );
}
