import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bars, TailSpin } from "react-loader-spinner";
import useScript from '../../hooks/useScript';

const PaymentGateway = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [easebuzzCheckout, setEasebuzzCheckout] = useState(null);
  const [modalData,setModalData] = useState({})

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

      console.error('Error fetching token:', error);
      setLoading(false);

    }
  };

  const handleProceedAndPay = async () => {

    let options = {
        access_key: modalData?.data,
        onResponse: (response) => {

            if (!response || !response?.status) {
                alert(`Some error occurred!`);
              } else if (response?.status.toLowerCase() === 'success') {
                alert(`Payment successful`);
              } else if (response?.status.toLowerCase() === 'failure') {
                alert('Payment failed');
              } else {
                alert(`Transaction cancelled`);
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


  return (
    <div style={{ textAlign: 'center' }}>
      {loading ? (
        <div className="credenc-loader-white fullscreen-loader">
            <TailSpin color="#00BFFF" height={100} width={100}/>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};

export default PaymentGateway;
