import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './components/login/Login';
import Home from './components/home/Home';
import Success from './components/success/Success';
import CheckAuthentication from './components/CheckAuthentication';
import InitialRoute from './components/InitialRoute';
import Autopay from './components/autopay/Autopay';
import Loan from './components/loan/Loan';
import Transaction from './components/transaction/Transaction';
import Payment from './components/payment/Payment';
import PartialPayment from './components/partialPayment/PartialPayment';
import LoanSuccess from './components/elementalComponents/loan-success/LoanSuccess';
import Signup from './components/signup/Signup';
import AdhocSuccess from './components/adhocSuccess/AdhocSuccess';
import PaymentGateway from './components/paymentGateway/PaymentGateway'

const AuthenticatedHome = CheckAuthentication(Home);
const AuthenticatedLoan = CheckAuthentication(Loan);

function App() {

  return(
    <>
      <div style={{
        width: '100%', 
        height: '2rem', 
        background: '#8F14CC', 
        position: 'sticky',
        top: '0',
        zIndex: 99
      }}></div>
      <Router>
          <Routes>
              <Route path="/login/*" element={<Login/>} />
              <Route exact path="/home" element={<AuthenticatedHome />} />
              <Route exact path="/loan" element={<AuthenticatedLoan />} />
              <Route path="/*" element={<AuthenticatedHome />}/>
              {/* <Route path="/adhoc" element={<Signup/>} />
              <Route exact path="/success" element={<Success/>} />
                <Route element={<CheckAuthentication />}>
                <Route path="/transaction/:token" element={<Transaction />} />
                <Route path="/transaction" element={<Transaction />} />
                <Route exact path="/payment/:token" element={<Payment />}/>
                <Route path="/payment" element={<Payment />}/>
                <Route path="/partial-payment" element={<PartialPayment />}/>
                <Route exact path="/autopay/:token" element={<Autopay />} />
                <Route  path="/autopay" element={<Autopay />} />
              </Route>
              <Route path="/adhoc-success" element={<AdhocSuccess/>} />
              <Route path="/pg/*" element={<PaymentGateway />} />
              <Route path="/adhoc/*" element={<Signup />}/> */}
              
          </Routes>
      </Router>
    </>
  )
}

export default App;
