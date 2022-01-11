import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './components/login/Login';
import Home from './components/home/Home';
import Success from './components/success/Success';

function App() {
  return(
    <Router>
        <Routes>
            <Route exact path="/login" element={<Login/>} />
            <Route exact path="/:phone/:id" element={<Home/>} />
            <Route exact path="/success" element={<Success/>} />
        </Routes>
    </Router>
  )
}

export default App;
