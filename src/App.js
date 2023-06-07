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
import Signup from './components/signup/Signup';
import AdhocSuccess from './components/adhocSuccess/AdhocSuccess';

function App() {

  Sentry.init({
    dsn: "https://8eb2f6c7062c4a1497f8dc2f79e27810@o4505310984404992.ingest.sentry.io/4505312167723008",
    integrations: [
      new Sentry.BrowserTracing({
        // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
      }),
      new Sentry.Replay(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });

  return(
    <>
      <div style={{
        width: '100%', 
        height: '2rem', 
        background: '#F19C37', 
        position: 'sticky',
        top: '0',
        zIndex: 99
      }}></div>
      <Router>
          <Routes>
              <Route path="/login/*" element={<Login/>} />
              <Route path="/adhoc" element={<Signup/>} />
              <Route exact path="/success" element={<Success/>} />
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
              <Route path="/adhoc-success" element={<AdhocSuccess/>} />
              <Route path="/adhoc/*" element={<Signup />}/>
              <Route path="/*" element={<InitialRoute />}/>
          </Routes>
      </Router>
    </>
  )
}

export default App;
