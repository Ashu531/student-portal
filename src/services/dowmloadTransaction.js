import { jsPDF } from 'jspdf';
import React, { useState, useEffect } from 'react';
import credencLogo from '../assets/credenc-text-logo.png';
import credencWoodmark from '../assets/logo/credencWoodmark.png'

export const downloadTransaction = (state) => {
    const doc = new jsPDF('p', 'px', 'a4', true);
    console.log(state.student_name,"state.student_name+++")
    let pdfContent = `
    <div style="font-family: 'Montserrat';padding: 50px 20px;background: #FFF; color: #000; font-size: 16px; width: 81.25%;heigth:100%;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
    <h1 style="font-weight: bolder;font-family: 'Montserrat';font-size:44px">
        RECEIPT
    </h1>
    <div style="padding: 30px 40px">
        <img src="${`data:image/png;base64, ${state.instituteLogo}`}" height="50px" style="display: block;"/>
    </div>
    </div>
    <table>
        <tr style="text-align: left;font-family: 'Montserrat';">
            <td style="width: 70%; border: none; vertical-align: top;">
                <h2>Student Details</h2>
                <table style="border-collapse: collapse; width: 100%;">
                    <tr>
                        <td style="border: none; text-align: left;">Name:</td>
                        <td style="border: none; text-align: left;font-weight: bolder;">${state.name.map((item,index)=>{
                            return(
                                `${item}`
                            )
                        }).join('  ')}</td>
                    </tr>
                    <tr>
                        <td style="border: none; text-align: left;">Course:</td>
                        <td style="border: none; text-align: left;font-weight: bolder;">${state.course}</td>
                    </tr>
                    <tr>
                        <td style="border: none; text-align: left;">Batch:</td>
                        <td style="border: none; text-align: left;font-weight: bolder;">${state.batch}</td>
                    </tr>
                    <tr>
                </table>
            </td>
        </tr>
    </table>

    <h2 style="background-color: #fff; color: #000000; font-weight: bold;font-family: 'Montserrat';">Transactions Details</h2>
    <table style="border-collapse: collapse; width: 100%;font-family: 'Montserrat';">
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;width: 40%;">Fee Payment Reference ID</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;font-weight: bolder;">${state.transaction_id}</td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;width: 40%;">Date of Transaction</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;font-weight: bolder;">${state.transaction_date}</td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;width: 40%;">Mode of Payment</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;font-weight: bolder;">${state.mode}</td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;width: 40%;">Amount Paid</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;font-weight: bolder;">${state.transaction_amount}</td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;width: 40%;">Status</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;font-weight: bolder;">${state.status}</td>
        </tr>
    </table>

    <h2 style="font-family: 'Montserrat';">Installments</h2>
    ${state.installments_summary.map((item, i) => (
    `<table style="border-collapse: collapse; width: 100%;font-family: 'Montserrat';">
        <tr style="background-color: #ddd">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;font-weight: bolder;">${item.name}</th>
        </tr>
    </table>
    <table style="border-collapse: collapse; width: 100%;font-family: 'Montserrat';">
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;width: 40%;">Installment Amount</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;font-weight: bolder;">${item.amount}</td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;width: 40%;">Discount Amount</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;font-weight: bolder;">${item.discount || 0}</td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;width: 40%;">Penalty amount</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;font-weight: bolder;">${item.penalty}</td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;width: 40%;">Total Amount</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;font-weight: bolder;">${parseFloat(item.amount) + parseFloat(item.penalty)}</td>
        </tr>
    </table>
    <div>
    `)).join('<br />')}`
    doc.html(
        pdfContent,
        {
          'callback': function (dispose) {
            // Calculate the position for the footer image
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const footerImageWidth = pageWidth; // Set the width to fill the entire page width
            const footerImageHeight = 40; // Increase the height of your footer image
            const footerX = 0; // Aligned to the start of the page horizontally
            const footerY = pageHeight - footerImageHeight; // Aligned to the bottom of the page
            doc.addImage(credencWoodmark, 'PNG', footerX, footerY, footerImageWidth, footerImageHeight);
            doc.save('fee-payment-receipt.pdf');
            
          },
          'margin': [0, 0, 0, 0],
          'width': 550,
          'windowWidth': 1000,
        }
      );
}

