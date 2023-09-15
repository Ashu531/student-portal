import { jsPDF } from 'jspdf';
import credencLogo from '../assets/credenc-text-logo.png';

export const downloadPdf = (state) => {
    const doc = new jsPDF('p', 'px', 'a4', true);
    let pdfContent = `<div style="padding: 50px 20px;background: #FFF; color: #000; font-size: 16px; width: 81.25%;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
            <img src="${credencLogo}" height="50px" style="display: block;"/>
            <img src="${`data:image/png;base64, ${state.studentFrontend.logo}`}" height="50px" style="display: block;"/>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <div>Name of student: ${state.firstname}</div>
            <div>Date of transaction: ${state.addedon}</div>
        </div>
        <div>Course: ${state.studentFrontend.course}</div>
        <div>Batch: ${state.studentFrontend.batch}</div>
        <br/>
        <table style="font-family:arial, sans-serif;border-collapse: collapse;width:100%; margin: 0 auto;">
            <tr>
                <td style="border:1px solid #dddddd;text-align:left;padding:8px;">Fee Payment Reference ID</td>
                <td style="border:1px solid #dddddd;text-align:left;padding:8px;">${state.txnid}</td>
            </tr>
            <tr style="background: #f1f1f1;">
                <td style="border:1px solid #dddddd;text-align:left;padding:8px;">Mode of Payment</td>
                <td style="border:1px solid #dddddd;text-align:left;padding:8px;">${state.mode}</td>
            </tr>
            <tr>
                <td style="border:1px solid #dddddd;text-align:left;padding:8px;">Total Amount Paid</td>
                <td style="border:1px solid #dddddd;text-align:left;padding:8px;">${state.amount}</td>
            </tr>
            <tr>
                <td style="border:1px solid #dddddd;text-align:left;padding:8px;" colspan="2">Installments Paid: 
                <br /><br/ > 
                    ${state.installmentsFrontend.map((item, i) => (
                        `<table style="font-family:arial, sans-serif;border-collapse: collapse;width:100%;">
                            <tr style="background: #f1f1f1;">
                                <td style="border:1px solid #dddddd;text-align:left;padding:8px;" colspan="2">
                                    <b>${item.name}</b>
                                </td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #dddddd;text-align:left;padding:8px;">Installement amount</td>
                                <td style="border:1px solid #dddddd;text-align:left;padding:8px;">${item.amount}</td>
                            </tr>
                            <tr style="background: #f1f1f1;">
                                <td style="border:1px solid #dddddd;text-align:left;padding:8px;">Discount Amount</td>
                                <td style="border:1px solid #dddddd;text-align:left;padding:8px;">${item.discount || 0}</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #dddddd;text-align:left;padding:8px;">Penalty amount</td>
                                <td style="border:1px solid #dddddd;text-align:left;padding:8px;">${item.penalty}</td>
                            </tr>
                            <tr style="background: #f1f1f1;">
                                <td style="border:1px solid #dddddd;text-align:left;padding:8px;">Total Paid</td>
                                <td style="border:1px solid #dddddd;text-align:left;padding:8px;">${parseFloat(item.amount) + parseFloat(item.penalty)}</td>
                            </tr>
                    </table>`
                    )).join('<br />')}
                </td>
            </tr>
        </table>
        <br/><br/><br/><br/><br/>
        <hr/>
        Thank you for your payment!
        <hr/>
    </div>`

    doc.html(
        pdfContent,
        {
            'callback': function(dispose){
                doc.internal.write(0, "Tw");
                doc.save('fee-payment-receipt.pdf');
            },
            'margin': [0, 0, 0, 0],
            'width': 550,
            'windowWidth': 1000
        }
    );
}
