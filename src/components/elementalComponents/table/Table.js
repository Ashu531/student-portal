import React from 'react'
import CheckBox from '../checkBox/CheckBox';
import currencyIconBlack from '../../../assets/currency-icon-black.svg';
import currencyIconGray from '../../../assets/currency-icon-gray.svg';

export default function Table({ list, handleCheckBox, selectAll=false}) {

    const getDisabled = (i) => {
        if((list[i]['status'] === 'due' || list[i]['status'] === 'overdue') && list[i]['is_mandatory'] !== 'True')
            return false;
        
        return true;
    }

    return (
        list && list.length > 0 && <table className='table'>
            <thead>
                <tr className='thead'>
                    <th style={{minWidth: '30%', textAlign: 'left'}}>
                        <span>
                            Installment Name
                        </span>
                    </th>
                    <th style={{minWidth: '10%', textAlign: 'right'}}>
                        <span>
                            Amount
                        </span>
                    </th>
                    <th style={{minWidth: '10%', textAlign: 'right'}}>
                        <span>
                            Penalty
                        </span>
                    </th>
                    <th style={{minWidth: '10%', textAlign: 'right'}}>
                        <span>
                            Start Date
                        </span>
                    </th>
                    <th style={{minWidth: '10%', textAlign: 'right'}}>
                        <span>
                            End Date
                        </span>
                    </th>
                    <th style={{minWidth: '10%', textAlign: 'right'}}>
                        <span>
                            Expire Date
                        </span>
                    </th>
                    <th style={{minWidth: '10%', textAlign: 'center'}}>
                        <span>
                            Status
                        </span>
                    </th>
                    {handleCheckBox && <th>
                        <CheckBox setChecked={(v) => handleCheckBox(v, -1)} isChecked={selectAll}/>
                    </th>}
                </tr>
            </thead>
            <tbody className='tbody'>
                {list.map((listItem, i) => (
                    <tr key={i} className='row'>
                        <td style={{minWidth: '30%'}}>
                            <span style={{fontSize: '1.4rem', lineHeight: '2.1rem', color: '#000000', fontWeight:'500', textTransform: 'capitalize'}}>
                                {listItem.name}
                            </span>
                        </td>
                        <td style={{minWidth: '10%', textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                            <img src={currencyIconBlack} style={{width: '1.4rem', height: '1.4rem'}}/>
                            <span style={{fontSize: '1.4rem', lineHeight: '2.1rem', color: '#000000'}}>
                                {listItem.amount}
                            </span>
                        </td>
                        <td style={{minWidth: '10%', textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                            <img src={currencyIconGray} style={{width: '1.4rem', height: '1.4rem'}}/>
                            <span style={{fontSize: '1.4rem', lineHeight: '2.1rem', color: 'rgba(0, 0, 0, 0.6)'}}>
                                {listItem.penalty}
                            </span>
                        </td>
                        <td style={{minWidth: '10%', textAlign: 'right'}}>
                            <span style={{fontSize: '1.4rem', lineHeight: '2.1rem', color: 'rgba(0, 0, 0, 0.6)'}}>
                                {listItem.start_date}
                            </span>
                        </td>
                        <td style={{minWidth: '10%', textAlign: 'right'}}>
                            <span style={{fontSize: '1.4rem', lineHeight: '2.1rem', color: 'rgba(0, 0, 0, 0.6)'}}>
                                {listItem.due_date}
                            </span>
                        </td>
                        <td style={{minWidth: '10%', textAlign: 'right'}}>
                            <span style={{fontSize: '1.4rem', lineHeight: '2.1rem', color: 'rgba(0, 0, 0, 0.6)'}}>
                                {listItem.expire_date}
                            </span>
                        </td>
                        <td style={{minWidth: '10%', textAlign: 'center'}}>
                            <span className={`status ${listItem.status}`}>
                                {listItem.status}
                            </span>
                        </td>
                        {handleCheckBox && <td>
                            <CheckBox 
                                setChecked={(v) => handleCheckBox(v, i)} 
                                isChecked={listItem.is_mandatory === 'True' || listItem.is_mandatory === true} 
                                disabled={getDisabled(i)}
                            />
                        </td>}
                    </tr>
                    ))
                }
            </tbody>
        </table>
    )
}
