import React, {Component} from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Header from './components/Header'
import SideMenu from './components/menu/SideMenu'
import BackDrop from './components/menu/BackDrop' 
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import './stylesheet/app.css'

export default class App extends Component {
  state = {
    sideMenuOpen: false
  };

  sideMenuClickHandler = () => {
    this.setState((prevState) => {
      return {sideMenuOpen: !prevState.sideMenuOpen};
    })
  };

  backDropClickHandler = () => {
    this.setState({sideMenuOpen: false});
  };

  render (){
    let sideMenu;
    let backDrop;

    if (this.state.sideMenuOpen) {
      sideMenu = <SideMenu />;
      backDrop = <BackDrop click={this.backDropClickHandler}/>;
    }

    return(
      <div>
        {/* All of this has to be activated once user logs in */}
        <Header sideMenuClickHandler={this.sideMenuClickHandler}/>
        {sideMenu}
        {backDrop}
        <main style={{marginTop: '71px'}}>
          <Home />
        </main>

        <Router>
          <Route path={"/"} component={Header}>
            <Route path={"/home"} component={Home} />
            <Route path={"/register"} component={Register} />
          </Route>
        </Router>
      </div>
    )
  }
}
