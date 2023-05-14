import React from 'react';
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

function App() {
  return(
    <>
      <div style={{width: '100%', height: '2rem', background: '#F19C37'}}></div>
      <Router>
          <Routes>
              <Route exact path="/login" element={<Login/>} />
              {/* <Route exact path="/success" element={<Success/>} /> */}
              <Route element={<CheckAuthentication />}>
                <Route exact path="/installments/:token" element={<Home />} />
                <Route exact path="/autopay/:token" element={<Autopay />} />
                <Route  path="/autopay" element={<Autopay />} />
                <Route exact path="/credenc-loan/:token" element={<Loan />} />
                <Route path="/credenc-loan" element={<Loan />} />
                <Route path="/transaction/:token" element={<Transaction />} />
                <Route path="/transaction" element={<Transaction />} />
                <Route exact path="/payment/:token" element={<Payment />}/>
                <Route path="/payment" element={<Payment />}/>
                <Route exact path="/partial-payment/:token" element={<PartialPayment />}/>
                <Route path="/partial-payment" element={<PartialPayment />}/>
              </Route>
              <Route path="/*" element={<InitialRoute />}/>
          </Routes>
      </Router>
    </>
  )
}

export default App;
