import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './components/login/Login';
import Home from './components/home/Home';
import Success from './components/success/Success';
import CheckAuthentication from './components/CheckAuthentication';
import InitialRoute from './components/InitialRoute';

function App() {
  return(
    <Router>
        <Routes>
            <Route exact path="/login" element={<Login/>} />
            <Route exact path="/success" element={<Success/>} />
            <Route element={<CheckAuthentication />}>
              <Route exact path="/installments/:token" element={<Home />} />
            </Route>
            <Route eaxct path="/" element={<InitialRoute />}/>
        </Routes>
    </Router>
  )
}

export default App;
