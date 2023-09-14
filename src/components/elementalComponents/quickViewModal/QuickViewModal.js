import React, { useState, useEffect } from 'react'
import SlidingPanel from '../sliding-panel/sliding_panel'
import { Bars, TailSpin } from "react-loader-spinner";

export default function QuickViewModal({ 
    title,
    description,
    icon,
    closeQuickView,
    quickView,
    quickViewState
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
                {/* {quickViewState && (
                    <div className="quick-view">
                    <div
                        className="quick-view-row"
                        style={{ alignItems: "flex-start" }}
                    >
                        <div className="quick-view-col">
                        <div
                            className="quick-view-text"
                            style={{ fontSize: "20px", fontWeight: "600" }}
                        >
                            {quickViewState.details["Name"]}
                        </div>
                        <div className="quick-view-text quick-view-body-text">
                            Unique ID: {quickViewState.details["Prn"]}
                        </div>
                        </div>
                        <div
                        className="quick-view-text quick-view-body-text"
                        style={{
                            textDecoration: "underline",
                            color: "#8F14CC",
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            let element = document.getElementById("quick-view-content");
                            element.scrollTo({
                            top: element.scrollHeight,
                            behavior: "smooth",
                            });
                        }}
                        >
                        See Details
                        </div>
                    </div>
                    <div
                        style={{
                        height: "1px",
                        width: "100%",
                        background: "#EAEAEA",
                        margin: "15px 0",
                        }}
                    ></div>
                    <div
                        className="quick-view-text"
                        style={{ fontSize: "18px", fontWeight: "600" }}
                    >
                        Fee Details
                    </div>

                    <div style={{ margin: "15px 0 0 0" }}></div>
                    <QuickViewTable
                        headers={["Payable Fee", "Paid", "Pending"]}
                        list={[
                        quickViewState.feeDetails.map((fee) => (
                            <div style={{ fontWeight: "600" }}>₹ {fee}</div>
                        )),
                        ]}
                    />
                    <div style={{ margin: "0 0 30px 0" }}></div>

                    <div
                        className="quick-view-text"
                        style={{ fontSize: "18px", fontWeight: "600" }}
                    >
                        Fee Break-Up
                    </div>

                    <div
                        className="quick-view-col"
                        style={{ gap: "5px", width: "100%", margin: "15px 0 30px 0" }}
                    >
                        {quickViewState.feeBreakup &&
                        quickViewState.feeBreakup.map((item, i) => (
                            <Collapsible
                            key={i}
                            collapsedChildren={[
                                <div style={{ flexGrow: "1" }}>
                                <div
                                    className="title"
                                    style={{ textTransform: "capitalize" }}
                                >
                                    {item.key}
                                </div>
                                <div className="subtitle">
                                    {item.paid > 0 ? (
                                    <span
                                        style={{
                                        borderRadius: "3px",
                                        background: "rgba(0, 203, 156, 1)",
                                        padding: "0 3px",
                                        color: "#FFFFFF",
                                        fontWeight: "600",
                                        }}
                                    >
                                        ₹ {item.paid}
                                    </span>
                                    ) : (
                                    ""
                                    )}
                                    {item.paid > 0 ? " paid of " : ""}
                                    <span className="bold">₹ {item.total}</span>
                                </div>
                                </div>,
                                <div className={`status ${item.output}`}>
                                {item.output}
                                </div>,
                            ]}
                            >
                            <div style={{ margin: "15px 0 0 0" }}></div>
                            {item.data.length > 0 && <QuickViewTable
                                type="2"
                                headers={[
                                "Installment",
                                "Amount",
                                "Penalty",
                                "Discount Applied",
                                "Payment Mode",
                                "Due Date",
                                ]}
                                list={item.data.map((installment) => [
                                installment.name,
                                <div className="subtitle">
                                    {installment.collection.split("/")[0] > 0 ? (
                                    <span
                                        style={{
                                        borderRadius: "3px",
                                        background: "rgba(0, 203, 156, 1)",
                                        padding: "0 3px",
                                        color: "#FFFFFF",
                                        fontWeight: "600",
                                        }}
                                    >
                                        ₹ {installment.collection.split("/")[0]}
                                    </span>
                                    ) : (
                                    ""
                                    )}
                                    {installment.collection.split("/")[0] > 0
                                    ? " paid of "
                                    : ""}
                                    <b>₹ {installment.collection.split("/")[1]}</b>
                                </div>,
                                `₹ ${installment.penalty}`,
                                `₹ ${installment.discount}`,
                                installment.payment,
                                installment.due_date,
                                ])}
                            />}
                            </Collapsible>
                        ))}
                        {quickViewState.feeBreakupAdhoc &&
                        quickViewState.feeBreakupAdhoc.map((item, i) => (
                            <Collapsible
                            key={i}
                            collapsedChildren={[
                                <div style={{ flexGrow: "1" }}>
                                <div
                                    className="title"
                                    style={{ textTransform: "capitalize" }}
                                >
                                    {item.key}
                                </div>
                                <div className="subtitle">
                                    {item.paid > 0 ? (
                                    <span
                                        style={{
                                        borderRadius: "3px",
                                        background: "rgba(0, 203, 156, 1)",
                                        padding: "0 3px",
                                        color: "#FFFFFF",
                                        fontWeight: "600",
                                        }}
                                    >
                                        ₹ {item.paid}
                                    </span>
                                    ) : (
                                    ""
                                    )}
                                    {item.paid > 0 ? " paid of " : ""}
                                    <span className="bold">₹ {item.total}</span>
                                </div>
                                </div>,
                                <div className={`status ${item.output}`}>
                                {item.output}
                                </div>,
                            ]}
                            >
                            <div style={{ margin: "15px 0 0 0" }}></div>
                            </Collapsible>
                        ))}
                    </div>

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
                                fontFamily: "Montserrat",
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

                    <div
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
                    </div>
                    </div>
                )} */}
                </SlidingPanel>
            )}
        </div>
    )
}
