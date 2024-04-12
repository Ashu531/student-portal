import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bars, TailSpin } from "react-loader-spinner";
import useScript from '../../hooks/useScript';
import Button from '../elementalComponents/button/Button';

const PaymentGateway = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [easebuzzCheckout, setEasebuzzCheckout] = useState(null);
  const [modalData,setModalData] = useState({})
  const [error,setError] = useState('')

  useEffect(() => {

    fetchToken();

  }, []);

  const fetchToken = async () => {

    try {

      const url = window.location.href;
      const tokenIndex = url.indexOf('/installments/') + '/installments/'.length;
      const token = url.substring(tokenIndex);

      const response = await axios.get(`${API_URL}/api/kid/v1/pg_integration/${token}`);

      const fetchedToken = response.data.token;
      setModalData(response.data)
      setToken(fetchedToken);

        useScript('https://ebz-static.s3.ap-south-1.amazonaws.com/easecheckout/easebuzz-checkout.js', () => {
            setEasebuzzCheckout(new EasebuzzCheckout("7ITASSQJE1", 'prod'));
        });

      setLoading(false);

    } catch (error) {
      
      if (error.response) {
        setModalData(error.response.data)
        console.error('Error response:', error.response.data);
        console.error('Status code:', error.response.status);
        setError('Session is Expired');
      } else if (error.request) {

        console.error('No response received:', error.request);
        setError('No response received from server');
      } else {
        console.error('Error:', error.message);
        setError('An unexpected error occurred');
      }
      
      setLoading(false);

    }
  };

  const handleProceedAndPay = async () => {
    
    let options = {
        access_key: modalData?.data,
        onResponse: (response) => {
            console.log(response,"reponse")
            if (!response || !response?.status) {
                setError(response.message)
                alert(`Some error occurred!`);
              } else if (response?.status.toLowerCase() === 'success') {
                alert(`Payment successful`);
                window.location.href = modalData?.success_url;
              } else if (response?.status.toLowerCase() === 'failure') {
                alert('Payment failed');
                window.location.href = modalData?.failure_url;
              } else {
                alert(`Transaction cancelled`);
                window.location.href = modalData?.failure_url;
            }

        },
        theme: "#4530B1" // color hex
    }
    
    try{
        if(easebuzzCheckout){
            await easebuzzCheckout.initiatePayment(options);
        }
    } catch(err) {
        confirm(`some error occurred!`);
    }
}

useEffect(()=>{

    if(!!easebuzzCheckout){
        handleProceedAndPay()
    }

},[easebuzzCheckout])

const redirectToHome = ()=>{
    console.log(modalData,"modalData")
    window.location.href = modalData?.failure_url
}


  return (
    <div className='payment'>
      {loading ? (
        <div className="credenc-loader-white fullscreen-loader">
            <TailSpin color="#00BFFF" height={100} width={100}/>
        </div>
      ) : (
        <div className='error'>
            <div>{error}</div>
            <div className='button-container'>
                    <Button 
                        text='Back To Home' 
                        classes='button'
                        handleClick={()=> redirectToHome()}
                    />
            </div>
        </div>
      )}
    </div>
  );
};

export default PaymentGateway;
