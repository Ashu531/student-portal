import React, { useRef, useState, useEffect } from "react";
import sortAscendingIcon from "../../../assets/sort-ascending-icon.svg";
import sortDescendingIcon from "../../../assets/sort-descending-icon.svg";
import graySortIcon from "../../../assets/gray-sort-icon.svg";
import autopayPaid from "../../../assets/autopayPaid.svg";
import autopayCancel from "../../../assets/autopayCancel.svg";
import autopayDashed from "../../../assets/autopayDashed.svg";
import autopayDone from "../../../assets/autopayDone.svg";
import autopayOverdue from "../../../assets/autopayOverdue.svg";
import autopaySpinner from "../../../assets/autopaySpinner.svg";
import autopayWarning from "../../../assets/autopayWarning.svg";
import CheckBox from "../checkBox/CheckBox";
// import { demoStudentsList } from "./studentsList";
import { formatDate } from "../../../utility/formatDate";
import { getMonthName } from "../../../utility/getMonthName";
import InfiniteScroll from "react-infinite-scroll-component";

import chatIconBlue from "../../../assets/chat-icon-blue.svg";
import chatIconWhite from "../../../assets/chat-icon-white.svg";
import currencyIconBlue from "../../../assets/currency-icon-blue.svg";
import currencyIconWhite from "../../../assets/currency-icon-white.svg";
import editIconBlue from "../../../assets/edit-icon-blue.svg";
import editIconWhite from "../../../assets/edit-icon-white.svg";
import Button from "../button/Button";
import { formatCategoryName } from "../../../utility/formatCategoryName";


const defaultClasses = {
    tableComponent: "",
    tableHeadingComponent: "",
    tableHeadingDataComponent: "",
    tableBodyComponent: "",
    tableRowComponent: "",
    tableDataComponent: "",
};


const AutopayTable = ({
    studentsList,
    classes = { ...defaultClasses },
    handleNotificationIconClick,
    handleCurrencyIconClick,
    handleEditIconClick,
    fetchMoreData,
    hasMoreData,
    handleStudentChecked,
    selectedStudentsList, 
    setSelectedStudentsList,
    sendMultipleNotifs,
    // sortTableByCategory,
    categoryName,
    sortType,
    AllStudentsId=[]
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [scrolling, setScrolling] = useState(true);
    const elementRowRef = useRef();
    const {
        tableComponent,
        tableHeadingComponent,
        tableHeadingDataComponent,
        tableBodyComponent,
        tableRowComponent,
        tableDataComponent,
    } = classes;
    const getDate = (utc) => {
        let date = utc.split(" ")[0];
        date = date.split("-");
        let dispDate = date[2];
        dispDate += " " + months[parseInt(date[1]) - 1];
        dispDate += " " + date[0];
        return dispDate;
    };
    const getTime = (utc) => {
        let time = utc.split(" ")[1];
        time = time.split(":");
        let dispTime =
            time[0] > 12 ? time[0] - 12 : time[0] === "00" ? "12" : time[0];
        dispTime += ":" + time[1];
        dispTime += time[0] >= 12 ? " PM" : " AM";
        return dispTime;
    };
    const getStatus = (status) => {
        if (status === 'paid') {
            return "Paid";
        } else if (status === 'no due'){
            return "No Dues";
        } else if (status === 'due'){
            return "Due";
        } else if (status === 'overdue'){
            return "Overdue";
        } else if(status === 'expired'){
            return "Expired";
        }
    }

    const getEnachIcon=(value)=>{
        if(value === 'initiated'){
            return autopayDashed
        }else if(value === 'bounced'){
            return autopayWarning
        }else if(value === 'payment_done'){
            return autopayPaid
        }else if(value === 'payment_in_progress'){
            return autopaySpinner
        }else if(value === 'setup_cancelled'){
            return autopayCancel
        }else if(value === 'setup_done'){
            return autopayDone
        }
    }

    const getDebitStatus=(value)=>{
        if(value === 'In Review'){
            return 'Review'
        }else if(value === 'Bounced'){
            return 'Bounced'
        }else if(value === 'Collected'){
            return 'Collected'
        }else if(value === 'Active'){
            return 'Active'
        }else if(value === 'Cancelled'){
            return 'Cancelled'
        }else{
            return 'Review'
        }
    }

    // const fetchMoreData = () => console.log("-------------fetch more data-----------");

    // const onScroll = () => {
    //     if (elementRowRef.current.getBoundingClientRect().y < '700' && scrolling) {
    //         setScrolling(false);
    //     } 
    //     // if (elementRowRef.current.getBoundingClientRect().y < 371) {
    //     //   setSearchBarWidth(
    //     //     `${(searchRef.current.getBoundingClientRect().y / 370) * 49 + 30}%`
    //     //   );
    //     // }
    //     // if (!showSearchBar && searchRef.current.getBoundingClientRect().top < 0) {
    //     //   setShowSearchBar(true);
    //     // } else if (searchRef.current.getBoundingClientRect().top >= 0) {
    //     //   setShowSearchBar(false);
    //     // }
    // };

    // useEffect(() => {
    //     document.addEventListener("scroll", onScroll, true);
    //     return () => document.removeEventListener("scroll", onScroll, true);
    // }, []);

    return (

        <>
        <table className={`students-table-component ${tableComponent}`}>
            <thead className={`table-heading-component ${tableHeadingComponent}`}>
                <tr className={`table-head-row`}>
                    <th
                        className={`table-heading-data-component first-column ${tableHeadingDataComponent}`}
                    >
                        <CheckBox 
                            setChecked={(value) => {
                                if (value) {
                                    // let tempList = studentsList.map((student) => student.id);
                                    setSelectedStudentsList(AllStudentsId);
                                } else {
                                    setSelectedStudentsList([]);
                                }
                            }}
                            checked={AllStudentsId === selectedStudentsList} 
                        />
                    </th>
                    <th
                        className={`table-heading-data-component second-column ${tableHeadingDataComponent}`}
                        style={{ display: "flex", justifyContent: "flex-start" }}
                    >
                        <span
                            style={categoryName !== "studentName" ? { color: "var(--text-lables-placeholder)" } : { color: "blue" }}
                            onClick={() => sortTableByCategory("studentName")}
                        >
                            STUDENT NAME
                            {/* {categoryName !== "studentName" ? (
                                <img src={graySortIcon}></img>
                            ) : sortType ? (
                                <img src={sortAscendingIcon}></img>
                            ) : (
                                <img src={sortDescendingIcon}></img>
                            )} */}
                        </span>
                    </th>
                    <th
                        className={`table-heading-data-component ${tableHeadingDataComponent}`}
                        style={{ display: "flex", justifyContent: "flex-start" }}
                    >
                        <span
                            style={categoryName !== "course" ? { color: "var(--text-lables-placeholder)" } : { color: "blue" }}
                            onClick={() => sortTableByCategory("course")}
                        >
                            Batch & COURSE
                            {/* {categoryName !== "course" ? (
                                <img src={graySortIcon}></img>
                            ) : sortType ? (
                                <img src={sortAscendingIcon}></img>
                            ) : (
                                <img src={sortDescendingIcon}></img>
                            )} */}
                        </span>
                    </th>
                    <th
                        className={`table-heading-data-component ${tableHeadingDataComponent}`}
                        style={{ display: "flex", justifyContent: "center" }}
                    >
                        <span
                            style={categoryName !== "category" ? { color: "var(--text-lables-placeholder)" } : { color: "blue" }}
                            onClick={() => sortTableByCategory("category")}
                        >
                            Category
                            {/* {categoryName !== "category" ? (
                                <img src={graySortIcon}></img>
                            ) : sortType ? (
                                <img src={sortAscendingIcon}></img>
                            ) : (
                                <img src={sortDescendingIcon}></img>
                            )} */}
                        </span>
                    </th>
                    <th
                        className={`table-heading-data-component ${tableHeadingDataComponent}`}
                        style={{ display: "flex", justifyContent: "flex-start" }}
                    >
                        <span
                            style={categoryName !== "phoneNo" ? { color: "var(--text-lables-placeholder)" } : { color: "blue" }}
                            onClick={() => sortTableByCategory("phoneNo")}
                        >
                            Phone no
                            {/* {categoryName !== "phoneNo" ? (
                                <img src={graySortIcon}></img>
                            ) : sortType ? (
                                <img src={sortAscendingIcon}></img>
                            ) : (
                                <img src={sortDescendingIcon}></img>
                            )} */}
                        </span>
                    </th>
                    <th
                        className={`table-heading-data-component ${tableHeadingDataComponent}`}
                        style={{ display: "flex", justifyContent: "flex-start" }}
                    >
                        <span
                            style={categoryName !== "phoneNo" ? { color: "var(--text-lables-placeholder)" } : { color: "blue" }}
                            // onClick={() => sortTableByCategory("phoneNo")}
                        >
                            ENACH
                            {/* {categoryName !== "phoneNo" ? (
                                <img src={graySortIcon}></img>
                            ) : sortType ? (
                                <img src={sortAscendingIcon}></img>
                            ) : (
                                <img src={sortDescendingIcon}></img>
                            )} */}
                        </span>
                    </th>
                    <th
                        className={`table-heading-data-component ${tableHeadingDataComponent}`}
                        style={{ display: "flex", justifyContent: "flex-start" }}
                    >
                        <span
                            style={categoryName !== "phoneNo" ? { color: "var(--text-lables-placeholder)" } : { color: "blue" }}
                            // onClick={() => sortTableByCategory("phoneNo")}
                        >
                            DEBIT STATUS
                            {/* {categoryName !== "phoneNo" ? (
                                <img src={graySortIcon}></img>
                            ) : sortType ? (
                                <img src={sortAscendingIcon}></img>
                            ) : (
                                <img src={sortDescendingIcon}></img>
                            )} */}
                        </span>
                    </th>
                    <th
                        className={`table-heading-data-component ${tableHeadingDataComponent}`}
                        style={{ display: "flex", justifyContent: "flex-start" }}
                    >
                        <span
                            style={categoryName !== "phoneNo" ? { color: "var(--text-lables-placeholder)" } : { color: "blue" }}
                            // onClick={() => sortTableByCategory("phoneNo")}
                        >
                            SUMMARY
                            {/* {categoryName !== "phoneNo" ? (
                                <img src={graySortIcon}></img>
                            ) : sortType ? (
                                <img src={sortAscendingIcon}></img>
                            ) : (
                                <img src={sortDescendingIcon}></img>
                            )} */}
                        </span>
                    </th>
                    <th
                        className={`table-heading-data-component ${tableHeadingDataComponent} last-column`}
                        style={{ display: "flex", justifyContent: "center" }}
                    >
                        <span
                            style={categoryName !== "status" ? { color: "var(--text-lables-placeholder)" } : { color: "blue" }}
                            onClick={() => sortTableByCategory("status")}
                        >
                            STATUS
                            {/* {categoryName !== "status" ? (
                                <img src={graySortIcon}></img>
                            ) : sortType ? (
                                <img src={sortAscendingIcon}></img>
                            ) : (
                                <img src={sortDescendingIcon}></img>
                            )} */}
                        </span>
                    </th>

                    {/* <th
            className={`table-heading-data-component last-column ${tableHeadingDataComponent}`}
          ></th> */}
                </tr>
            </thead>
            <tbody className={`table-body-component ${tableBodyComponent}`}>
                <>
                {selectedStudentsList.length > 1 && <div style={{display: 'flex', justifyContent:"space-between", alignItems:'center', margin: '1.6rem 0'}}>
                        <Button
                            type="primary"
                            buttonText="Send Notification"
                            disabledButton={false}
                            onClick={sendMultipleNotifs}
                        />
                        <span 
                            style={{fontSize: '1.4rem', fontWeight: '600', fontStyle:'italic', color: '#3377ff', lineHeight: '1.2', marginRight: '1.6rem'}}
                        >{selectedStudentsList.length} Students Selected</span>
                    </div>}
                <InfiniteScroll
                    dataLength={studentsList.length}
                    next={fetchMoreData}
                    hasMore={hasMoreData}
                    loader={<h4>Loading...</h4>}
                    height={620}
                    style={{paddingBottom: '20rem'}}
                >
                    {studentsList.map((student, index) => (
                        <tr
                            key={index}
                            className={`table-row-component ${tableRowComponent}`}
                            style={{ cursor: "pointer" }}
                        // ref = {index === (studentsList.length - 20) ? elementRowRef : null}
                        >
                            <td
                                className={`table-data-component ${tableDataComponent} first-column`}
                            >
                                <CheckBox 
                                    setChecked={(value) => handleStudentChecked(value, student)} 
                                    checked={selectedStudentsList.indexOf(student.id) !== -1}
                                />
                            </td>
                            <td
                                className={`table-data-component second-column ${tableDataComponent}`}
                                style={{ display: "flex", alignItems: "center" }}
                            >
                                <div style={
                                    {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: "space-evenly",
                                        alignItems: 'flex-start',
                                    }}>
                                    <span style={{ textTransform: 'capitalize' }}>
                                        {student.name}
                                    </span>
                                    <div style={
                                        {
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start',
                                        }
                                    }>
                                        <span style={{ color: 'var(--text-lables-placeholder)', marginRight: '0.5rem' }}>
                                        {student.prn}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td className={`table-data-component ${tableDataComponent}`}>
                                <div>
                                    <span style={{textTransform: 'capitalize' }}>
                                        {student.fee_structure.batch.course.course_short_name}
                                        <br />
                                        {student.fee_structure.batch.batch_name}
                                    </span>
                                </div>
                            </td>
                            <td
                                className={`table-data-component ${tableDataComponent}`}
                                style={{ display: "flex", justifyContent: "center", textTransform: 'capitalize' }}
                            >
                                <div>
                                    <span>
                                        {student.fee_structure.category_name}
                                    </span>
                                </div>
                            </td>
                            <td className={`table-data-component ${tableDataComponent}`}>
                                <div>
                                    <span>
                                        {student.phone_number}
                                    </span>
                                </div>
                            </td>
                            <td
                                className={`table-data-component ${tableDataComponent}`}
                                style={{ display: "flex", justifyContent: "flex-start" }}
                            >
                                <div
                                  className={`debit-status ${!!student?.auto_pay?.status
                                    ? `${getDebitStatus(student?.auto_pay?.status).toLowerCase().replaceAll(" ", "")}`
                                    : ''
                                }`} 
                                >
                                    {/* <span className="round"></span> */}
                                    <span style={getDebitStatus(student?.auto_pay?.status).toLowerCase().replaceAll(" ", "") === 'active' ? {color: '#ffffff'} : null}>{student?.auto_pay?.status}</span>
                                </div>
                            </td>
                            <td
                                className={`table-data-component ${tableDataComponent}`}
                                style={{ display: "flex", justifyContent: "flex-start" }}
                            >
                                <div style={{display:'flex',justifyContent:'flex-end',alignItems:'center'}}>
                                    {
                                        student.auto_pay.statuses.map((item,index)=>{
                                                return(
                                                    <div key={index} style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',marginTop:8}}>
                                                        {
                                                            item?.length > 0 ? 
                                                                <img src={getEnachIcon(item)} alt='status-icon' />
                                                                : <div style={{height: 20,width: 20, borderRadius: 10}} />
                                                        } 
                                                        <span style={{marginTop: 5,fontSize: 8,color: 'var(--text-lables-placeholder)'}}>
                                                            {index+1}
                                                        </span>
                                                    </div>
                                                )
                                        })
                                    }
                                </div>
                            </td>
                            <td
                                className={`table-data-component ${tableDataComponent}`}
                                style={{ display: "flex", justifyContent: "flex-start" }}
                            >
                                <div style={{display:'flex',justifyContent:'flex-end',alignItems:'center'}}>
                                    {student.auto_pay_summary}
                                </div>
                            </td>
                            <td
                                className={`table-data-component last-column ${tableDataComponent}`}
                                style={{ display: "flex", justifyContent: "center" }}
                            >
                                <div
                                    className={`status ${!!student.student_payment_status 
                                        ? `${getStatus(student.student_payment_status).toLowerCase().replaceAll(" ", "")}`
                                        : ''
                                    }`}
                                >
                                    {/* <span className="round"></span> */}
                                    <span>{getStatus(student.student_payment_status)}</span>
                                </div>
                                <div className='hover-icons'>
                                     <div className='icon' onClick={() => handleNotificationIconClick(student.name, student.id, student.prn)} >
                                        <img className='blue-icon' src={chatIconBlue} alt="chat icon blue"></img>
                                        <img className='white-icon' src={chatIconWhite} alt="chat icon white"></img>
                                    </div>
                                    <div className='icon' onClick={() => handleCurrencyIconClick(student)} >
                                        <img className='blue-icon' src={currencyIconBlue} alt="chat icon blue"></img>
                                        <img className='white-icon' src={currencyIconWhite} alt="chat icon white"></img>
                                    </div>
                                    <div className='icon' onClick={() => handleEditIconClick(student.name, student.id)} >
                                        <img className='blue-icon' src={editIconBlue} alt="chat icon blue"></img>
                                        <img className='white-icon' src={editIconWhite} alt="chat icon white"></img>
                                    </div>
                                </div>
                            </td>
                            {/* <td className={`table-data-component last-column ${tableDataComponent}`}></td> */}
                        </tr>
                    ))}
                </InfiniteScroll>
                <tr className={`table-row-component ${tableRowComponent}`} style={{ background: "transparent" }}></tr>
                </>
            </tbody>
        </table>
        </>
    );
};

export default AutopayTable;
