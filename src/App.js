import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from './components/login/Login';
import Home from './components/home/Home';
import Success from './components/success/Success';
// import "./App.scss";

function App() {
  return(
    <Router>
        <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/" component={Home} />
            <Route exact path="/success" component={Success} />
        </Switch>
    </Router>
  )
}

export default App;
