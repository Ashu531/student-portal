import React from 'react'
import CheckBox from '../checkBox/CheckBox';
import currencyIconBlack from '../../../assets/currency-icon-black.svg';
import currencyIconGray from '../../../assets/currency-icon-gray.svg';
import autopayCancel from "../../../assets/autopayCancel.svg";
import autopayDashed from "../../../assets/autopayDashed.svg";
import autopayDone from "../../../assets/autopayDone.svg";
import autopayPaid from "../../../assets/autopayPaid.svg";
import autopaySpinner from "../../../assets/autopaySpinner.svg";
import autopayWarning from "../../../assets/autopayWarning.svg";

export default function Table({ heading='Installments', list, handleCheckBox, selectAll=false}) {

    const getDisabled = (i) => {
        if((list[i]['status'] === 'due' || list[i]['status'] === 'overdue' || list[i]['status'] === 'upcoming') && list[i]['is_mandatory'] !== 'True')
            return false;
        
        return true;
    }

    const getAutopayImage = (status) => {
        switch(status){
            case 'initiated': return autopayDashed;
            case 'bounced': return autopayWarning;
            case 'payment_in_progress': return autopaySpinner;
            case 'setup_cancelled': return autopayCancel;
            case 'setup_done': return autopayDone;
            case 'paid': return autopayPaid;
        }
    }

    return (
        list && list.length > 0 && <table className='table'>
            <thead>
                <tr className='thead'>
                    <th style={{flex: '3 1 0px', textAlign: 'left'}}>
                        <span>
                            {heading}
                        </span>
                    </th>
                    <th style={{textAlign: 'right'}}>
                        <span>
                            Amount
                        </span>
                    </th>
                    <th style={{textAlign: 'right'}}>
                        <span>
                            Penalty
                        </span>
                    </th>
                    {!(list.length > 0 && list[0].enach_status != null) && <th style={{textAlign: 'right'}}>
                        <span>
                            Start Date
                        </span>
                    </th>}
                    {!(list.length > 0 && list[0].enach_status != null) && <th style={{textAlign: 'right'}}>
                        <span>
                            End Date
                        </span>
                    </th>}
                    {(list.length > 0 && list[0].enach_status != null) && <th style={{textAlign: 'right'}}>
                        <span>
                            Collection Date
                        </span>
                    </th>}
                    {/* <th style={{minWidth: '10%', textAlign: 'right'}}>
                        <span>
                            Expire Date
                        </span>
                    </th> */}
                    {list.length > 0 && list[0].enach_status != null && <th style={{textAlign: 'right'}}>
                        <span>
                            Auto Pay
                        </span>
                    </th>}
                    <th style={{textAlign: 'right', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem'}}>
                        <span>
                            Status
                        </span>
                        {handleCheckBox &&
                            <CheckBox setChecked={(v) => handleCheckBox(v, -1)} isChecked={selectAll}/>
                        }
                    </th>
                    
                </tr>
            </thead>
            <tbody className='tbody'>
                {list.map((listItem, i) => (
                    <tr key={i} className='row'>
                        <td style={{flex: '3 1 0px',textAlign: 'start'}}>
                            <span style={{fontSize: '1.4rem', color: '#000000', fontWeight:'500', textTransform: 'capitalize'}}>
                                {listItem.name}<br/>
                                <p style={{fontSize: '1rem', color: '#000000', fontWeight:'400', textTransform: 'capitalize',margin:0}}>{listItem?.fee_category?.name}</p>
                            </span>
                        </td>
                        <td style={{textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                            <img src={currencyIconBlack} style={{width: '1.4rem', height: '1.4rem'}}/>
                            <span style={{fontSize: '1.4rem', lineHeight: '2.1rem', color: '#000000'}}>
                                {listItem.amount}
                            </span>
                        </td>
                        <td style={{textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                            <img src={currencyIconGray} style={{width: '1.4rem', height: '1.4rem'}}/>
                            <span style={{fontSize: '1.4rem', lineHeight: '2.1rem', color: 'rgba(0, 0, 0, 0.6)'}}>
                                {listItem.penalty}
                            </span>
                        </td>
                        {listItem.enach_status == null && <td style={{textAlign: 'right'}}>
                            <span style={{fontSize: '1.4rem', lineHeight: '2.1rem', color: 'rgba(0, 0, 0, 0.6)'}}>
                                {listItem.start_date}
                            </span>
                        </td>}
                        <td style={{textAlign: 'right'}}>
                            <span style={{fontSize: '1.4rem', lineHeight: '2.1rem', color: 'rgba(0, 0, 0, 0.6)'}}>
                                {listItem.due_date}
                            </span>
                        </td>
                        {/* <td style={{minWidth: '10%', textAlign: 'right'}}>
                            <span style={{fontSize: '1.4rem', lineHeight: '2.1rem', color: 'rgba(0, 0, 0, 0.6)'}}>
                                {listItem.expire_date}
                            </span>
                        </td> */}
                        {listItem.enach_status != null && 
                        <td style={{textAlign: 'right', display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                            <span className='enach-status'>
                                {listItem.enach_status[0]}&ensp;
                            </span>
                            <img src={getAutopayImage(listItem.enach_status[1])}/>
                        </td>}
                        <td style={{textAlign: 'right', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem'}}>
                            <span className={`status ${listItem.status}`}>
                                {listItem.status}
                            </span>
                            {handleCheckBox &&
                                <CheckBox 
                                    setChecked={(v) => handleCheckBox(v, i)} 
                                    isChecked={listItem.is_mandatory === 'True' || listItem.is_mandatory === true} 
                                    disabled={getDisabled(i)}
                                />
                            }
                        </td>
                        
                    </tr>
                    ))
                }
            </tbody>
        </table>
    )
}
