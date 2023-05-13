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

function App() {
  return(
    <Router>
        <Routes>
            <Route exact path="/login" element={<Login/>} />
            <Route exact path="/success" element={<Success/>} />
            <Route element={<CheckAuthentication />}>
              <Route exact path="/installments/:token" element={<Home />} />
              <Route exact path="/autopay/:token" element={<Autopay />} />
              <Route exact path="/credenc-loan/:token" element={<Loan />} />
              <Route exact path="/transaction/:token" element={<Transaction />} />
            </Route>
            <Route eaxct path="/" element={<InitialRoute />}/>
        </Routes>
    </Router>
  )
}

export default App;
