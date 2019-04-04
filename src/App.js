import React, {Component} from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Header from './components/Header'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import './stylesheet/app.css'

export default class App extends Component {
  render (){
    return(
      <div>
        <Router>
          <Route path={"/"} component={Header}>
            <Route path={"/login"} component={Login} />
            <Route path={"/home"} component={Home} />
            <Route path={"/register"} component={Register} />
          </Route>
        </Router>
      </div>
    )
  }
}
