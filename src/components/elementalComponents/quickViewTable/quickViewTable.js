import React from 'react';
import './_quickViewTable.scss';

export default function QuickViewTable({
    headers=[],
    list=[],
    type='1'
}) {

  return (
        <table className='quick-view-table'>
            <tr className='table-header'>
                { headers.map((header, index) => (
                    <td key={`${header}-${index}`} className={`header-text header-text-${type}`}>
                        {header}
                    </td>
                ))}
            </tr>
            
            { list.map((item, index) => (
                <tr className='table-row-container'>
                    {item.map((it, index) => (
                        <td key={`${it}-${index}`} className={`table-row row-text row-text-${type}`}>{ it }</td>
                    ))}
                </tr>
            ))}
            
        </table>
  )
}
