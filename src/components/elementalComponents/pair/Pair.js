import React from 'react'

export default function Pair({
    radius,
    bgColor,
    keyname, 
    value,
    margin,
    style={}
}) {
  return (
    <div className='pair-component' style={{...style, background: bgColor, borderRadius: radius}}>
        <div className='key'>{keyname}</div>
        <div className='value'>{value}</div>
    </div>
  )
}
