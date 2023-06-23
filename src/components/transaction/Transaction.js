import React, { useEffect, useState } from 'react';
import Header from '../../components/elementalComponents/header/Header'
import Button from '../elementalComponents/button/Button';
import backIcon from '../../assets/caret-right.svg';
import TransactionStatus from '../../components/elementalComponents/transactionStatus/TransactionStatus'
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function Transaction() {

    const navigate = useNavigate();
    const [urlQuery,setUrlQuery] = useState([])
    const [studentData,setStudentData] = useState({

    })

    const getTransactionDetail=async(queryList)=>{
        if(queryList[0]?.name == 'app_id'){
            const data = await axios.get(`${API_URL}/api/kid/v1/autopay/status/${queryList[0]?.value}/`)
            .then(res => {
                setStudentData(res.data.student)
            }
                
            )
            .catch(error => error.response.data);
    
            // return data;
        }
    }

    const getParams=()=>{
        let urlQueryParams= []
        let params = window.location.search
        let url = params.substring(1,params.length)
        // let url = 'app_id=1684141351252-5612-3686bd1c&status=failure'
        const query_params = url.split('&');
        let queryArray = [];
        query_params.forEach((item,i)=>{
            let query = item.split('=')
            queryArray.push(query);
            queryArray.forEach((el,index)=>{
                if(index === queryArray.length -1){
                    let data = {
                        'name' : el[0],
                        'value' : el[1]
                    }
                    urlQueryParams.push(data)
                }
            })
        })
        
        setUrlQuery([...urlQueryParams])
        getTransactionDetail(urlQueryParams)
    }

    useEffect(() => {
        getParams();
    }, [])


    return (
        <>
        <Header
             title="Transaction"
             icon={studentData?.college?.logo}
        />
        <div className='transaction'>
           <TransactionStatus 
             icon={ urlQuery.length > 1 && urlQuery[1]?.name == 'status' && urlQuery[1]?.value == 'success' ?  true : false} 
             title={ urlQuery.length > 1 && urlQuery[1]?.name == 'status' && urlQuery[1]?.value == 'success' ? 'Auto-Pay initiated!' : 'Auto-Pay Initiation Unsuccessful' }  
             description={ urlQuery.length > 1 && urlQuery[1]?.name == 'status' && urlQuery[1]?.value == 'success' ? 'Your auto-pay has been initiated and you will be get a confirmation up within 24 hours.' : 'Your auto-pay has not been set up. Try again!' }
            />
           <div className='student-content'>
                <div className='student-container'>
                    <div className='student-label'>Student Name</div>
                    <div className='student-name'>{studentData?.name}</div>
                </div>
                <div className='student-container'>
                    <div className='student-label'>Admission No.</div>
                    <div className='student-detail'>{studentData?.prn}</div>
                </div>
                <div className='student-container'>
                    <div className='student-label'>Grade</div>
                    <div className='student-detail'>{studentData?.course}</div>
                </div>
                <div className='student-container'>
                    <div className='student-label'>School</div>
                    <div className='student-detail'>{studentData?.college?.name}</div>
                </div>
                <div className='divider' />
                <div className='student-container'>
                    <div className='student-label'>Total Amount</div>
                    <div className='student-detail'>{studentData?.amount}</div>
                </div>
                <div className='student-container'>
                    <div className='student-label'>Frequency</div>
                    <div className='student-detail'>Quarterly</div>
                </div>
                <div className='student-container'>
                    <div className='student-label'>No. of Payments</div>
                    <div className='student-detail'>4</div>
                </div>
           </div>
           <div style={{width: '100%',paddingBottom: '4rem'}}>
                <Button 
                    text='Back To Dashboard' 
                    classes='button'
                    handleClick={()=> navigate(`/`, {replace: true})}
                />
           </div>
            
        </div>
        </>
    )
}



