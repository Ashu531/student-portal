import { jsPDF } from 'jspdf';

export const downloadPdf = (state) => {
    const doc = new jsPDF();
    let pdfContent = `<div style="padding: 50px 20px; color: #000; font-size: 16px; width: '600px';">
        <div>Name of student: ${state.firstname}</div>
        <div>Course: ${state.studentFrontend.course}</div>
        <div>Batch: ${state.studentFrontend.batch}</div>
        <div>Date of transaction: ${state.addedon}</div>
        <br/>
        <div>Fee Payment Reference ID: ${state.txnid}</div>
        <br/>
        <div>Mode of Payment: ${state.mode}</div>
        <br/>
        <div>Total Amount Paid: ${state.amount}</div>
        <br/>
        <div>Installments Paid:</div> 
        ${state.installmentsFrontend.map((item, index) => (
            `<ul>
                <li>
                    ${item.name}
                    <ul style="list-style-type: none;">
                        <li>Installement amount- ${item.amount}</li>
                        <li>Discount Amount- ${item.discount}</li>
                        <li>Penalty amount- ${item.penalty}</li>
                        <li>Total Paid- ${item.amount + item.penalty}</li>
                    </ul>
                </li>
            </ul>`
        ))}
        Thank you for your payment!
        <br/><br/><br/><br/><br/>
        <hr/>
        Thank you for your payment!
        <hr/>
    </div>`

    doc.html(
        pdfContent,
        {
            'callback': function(dispose){
                doc.save('fee-payment-receipt.pdf');
            },
            'margin': [0, 0, 0, 0],
            'width': 1000,
            'windowWidth': 3508
        }
    );
}
