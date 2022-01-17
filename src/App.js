import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './components/login/Login';
import Home from './components/home/Home';
import Success from './components/success/Success';

function App() {
  return(
    <Router>
        <Routes>
            <Route exact path="/home/:phone/:id" element={<Home/>} />
            <Route exact path="/success" element={<Success/>} />
            <Route exact path="/*" element={<Login/>} />
        </Routes>
    </Router>
  )
}

export default App;
