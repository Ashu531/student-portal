import React, { useState, useEffect } from 'react'
import SlidingPanel from '../sliding-panel/sliding_panel'
import { Bars, TailSpin } from "react-loader-spinner";
import Collapsible from '../quickViewCollapsible/QuickViewCollapsible';
import { formatKey } from '../../../services/helpers';

export default function QuickViewModal({ 
    title,
    description,
    icon,
    closeQuickView,
    quickView,
    quickViewState,
    handleCollapsibleDownload
}) {

    return (
        <div className='transaction-quick-view'>
           {quickView && (
                <SlidingPanel
                    closeSlidingPanel={closeQuickView}
                    buttons={[]}
                >
                {!quickViewState && (
                    <div
                    className="quick-view"
                    style={{ justifyContent: "center", alignItems: "center" }}
                    >
                    {/* <div className="credenc-loader-white fullscreen-loader"> */}
                        <TailSpin color="#00BFFF" height={40} width={40}/>
                    {/* </div> */}
                    </div>
                )}
                {quickViewState && (
                    <div className="quick-view">

                    <div
                        className="quick-view-text"
                        style={{ fontSize: "18px", fontWeight: "600" }}
                    >
                        Transaction History
                    </div>

                    <div
                        className="quick-view-col"
                        style={{ gap: "5px", width: "100%", margin: "15px 0 30px 0" }}
                    >
                        {quickViewState.transactionHistory &&
                        quickViewState.transactionHistory.length == 0 && (
                            <div
                            style={{
                                color: "#0B090D",
                                fontFamily: "Poppins",
                                fontSize: "14px",
                                fontWeight: "400",
                                lineHeight: "normal",
                            }}
                            >
                            No Transactions Yet
                            </div>
                        )}
                        {quickViewState.transactionHistory &&
                        quickViewState.transactionHistory.map((item, i) => (
                            <Collapsible
                            key={i}
                            handleCollapsibleDownload={()=>handleCollapsibleDownload(item)}
                            collapsedChildren={[
                                <div
                                style={{
                                    width: "10px",
                                    height: "10px",
                                    background:
                                    item.status == "success" ? "#00CB9C" : "#E35151",
                                    borderRadius: "100%",
                                }}
                                ></div>,
                                <div style={{ flexGrow: "1" }}>
                                <div
                                    className="title"
                                    style={{ textTransform: "capitalize" }}
                                >
                                    {item.categories.length > 0 &&
                                    item.categories.join(", ")}
                                    {item.categories.length == 0 && "Transaction"}
                                </div>
                                <div className="subtitle">
                                    <span>
                                    {item.payment_type}: {item.mode}
                                    </span>
                                    <span
                                    style={{
                                        display: "inline-block",
                                        margin: "1px 4px",
                                        width: "5px",
                                        height: "5px",
                                        background: "#0B0902",
                                        borderRadius: "100%",
                                    }}
                                    ></span>
                                    {item.transaction_date}{" "}
                                    {item.transaction_time.split(".")[0]}
                                </div>
                                </div>,
                                <div style={{ flexGrow: "1", textAlign: "end" }}>
                                <div
                                    className="title"
                                    style={{ textTransform: "capitalize" }}
                                >
                                    ₹ {item.transaction_amount}
                                </div>
                                <div className="subtitle">{item.transaction_id}</div>
                                </div>,
                            ]}
                            >
                            <div style={{ margin: "15px 0 0 0" }}></div>
                            <div
                                className="quick-view-col"
                                style={{ gap: "5px", width: "100%", padding: "0 20px" }}
                            >
                                {Object.entries(item).map((entry) => (
                                <Pair2
                                    key={`${item[0]}-${item[1]}`}
                                    name={formatKey(entry[0])}
                                    value={`${entry[1]}`}
                                />
                                ))}
                            </div>
                            </Collapsible>
                        ))}
                    </div>

                    {/* <div
                        className="quick-view-text"
                        style={{ fontSize: "18px", fontWeight: "600" }}
                    >
                        Student Details
                    </div>

                    <div
                        className="quick-view-col"
                        style={{ gap: "5px", width: "100%", margin: "15px 0 30px 0" }}
                    >
                        {Object.entries(quickViewState.details).map((entry) => (
                        <Pair1 name={entry[0]} value={`${entry[1]}`} />
                        ))}
                    </div> */}
                    </div>
                )}
                </SlidingPanel>
            )}
        </div>
    )
}

export function Pair1({ name, value }) {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            color: "#0B090D",
            fontFamily: "Poppins",
            fontSize: "14px",
          }}
        >
          {name}
        </div>
  
        <div
          style={{
            color: "#0B090D",
            fontFamily: "Poppins",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          {value}
        </div>
      </div>
    );
  }
  
  export function Pair2({ name, value }) {
    return (
      <div
        style={ name === 'Installments Summary' ? {
            display:'none'
        } : {
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            color: "#0B090D",
            fontFamily: "Poppins",
            fontSize: "12px",
          }}
        >
          {name}
        </div>
  
        <div
          style={{
            color: "#0B090D",
            fontFamily: "Poppins",
            fontSize: "12px",
          }}
        >
          {value}
        </div>
      </div>
    );
  }
