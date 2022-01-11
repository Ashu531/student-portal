import React from 'react'
import CheckBox from '../checkBox/CheckBox';
import currencyIconBlack from '../../../assets/currency-icon-black.svg';
import currencyIconGray from '../../../assets/currency-icon-gray.svg';

export default function Table({ list, handleCheckBox, selectAll=false}) {

    return (
        <table className='table'>
            <thead>
                <tr className='thead'>
                    <th style={{minWidth: '30%', textAlign: 'left'}}>
                        <span style={{fontSize: '1.2rem', lineHeight: '1.8rem', color: 'rgba(255, 255, 255, 0.5)'}}>
                            Installment Name
                        </span>
                    </th>
                    <th style={{minWidth: '10%', textAlign: 'right'}}>
                        <span style={{fontSize: '1.2rem', lineHeight: '1.8rem', color: 'rgba(255, 255, 255, 0.5)'}}>
                            Amount
                        </span>
                    </th>
                    <th style={{minWidth: '10%', textAlign: 'right'}}>
                        <span style={{fontSize: '1.2rem', lineHeight: '1.8rem', color: 'rgba(255, 255, 255, 0.5)'}}>
                            Penalty
                        </span>
                    </th>
                    <th style={{minWidth: '10%', textAlign: 'right'}}>
                        <span style={{fontSize: '1.2rem', lineHeight: '1.8rem', color: 'rgba(255, 255, 255, 0.5)'}}>
                            Start Date
                        </span>
                    </th>
                    <th style={{minWidth: '10%', textAlign: 'right'}}>
                        <span style={{fontSize: '1.2rem', lineHeight: '1.8rem', color: 'rgba(255, 255, 255, 0.5)'}}>
                            Due Date
                        </span>
                    </th>
                    <th style={{minWidth: '10%', textAlign: 'right'}}>
                        <span style={{fontSize: '1.2rem', lineHeight: '1.8rem', color: 'rgba(255, 255, 255, 0.5)'}}>
                            End Date
                        </span>
                    </th>
                    <th style={{minWidth: '10%', textAlign: 'center'}}>
                        <span style={{fontSize: '1.2rem', lineHeight: '1.8rem', color: 'rgba(255, 255, 255, 0.5)'}}>
                            Status
                        </span>
                    </th>
                    <th>
                        <CheckBox setChecked={(v) => handleCheckBox(v, -1)} isChecked={selectAll}/>
                    </th>
                </tr>
            </thead>
            <tbody className='tbody'>
                {list.map((row, i) => (
                    <tr key={i} className='row'>
                        <td style={{minWidth: '30%'}}>
                            <span style={{fontSize: '1.4rem', lineHeight: '2.1rem', color: '#000000', fontWeight:'500', textTransform: 'capitalize'}}>
                                {row.name}
                            </span>
                        </td>
                        <td style={{minWidth: '10%', textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                            <img src={currencyIconBlack} style={{width: '1.4rem', height: '1.4rem'}}/>
                            <span style={{fontSize: '1.4rem', lineHeight: '2.1rem', color: '#000000'}}>
                                {row.amount}
                            </span>
                        </td>
                        <td style={{minWidth: '10%', textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                            <img src={currencyIconGray} style={{width: '1.4rem', height: '1.4rem'}}/>
                            <span style={{fontSize: '1.4rem', lineHeight: '2.1rem', color: 'rgba(0, 0, 0, 0.6)'}}>
                                {row.penalty}
                            </span>
                        </td>
                        <td style={{minWidth: '10%', textAlign: 'right'}}>
                            <span style={{fontSize: '1.4rem', lineHeight: '2.1rem', color: 'rgba(0, 0, 0, 0.6)'}}>
                                {row.start_date}
                            </span>
                        </td>
                        <td style={{minWidth: '10%', textAlign: 'right'}}>
                            <span style={{fontSize: '1.4rem', lineHeight: '2.1rem', color: 'rgba(0, 0, 0, 0.6)'}}>
                                {row.due_date}
                            </span>
                        </td>
                        <td style={{minWidth: '10%', textAlign: 'right'}}>
                            <span style={{fontSize: '1.4rem', lineHeight: '2.1rem', color: 'rgba(0, 0, 0, 0.6)'}}>
                                {row.expire_date}
                            </span>
                        </td>
                        <td style={{minWidth: '10%', textAlign: 'center'}}>
                            <span className={`status ${row.status}`}>
                                {row.status}
                            </span>
                        </td>
                        <td>
                            <CheckBox setChecked={(v) => handleCheckBox(v, i)} isChecked={row.is_selected}/>
                        </td>
                    </tr>
                    ))
                }
            </tbody>
        </table>
    )
}
