import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header'
import SideMenu from './components/menu/SideMenu'
import BackDrop from './components/menu/BackDrop' 
import Home from './components/Home'
import Capture from './components/Capture'
import Graph from './components/Graph'
import Login from './components/Login'
import Register from './components/Register'
import './stylesheet/app.css'

export const apiMoodportfolio = 'https://api.moodportfolio.ml'; // API for server
// export const apiMoodportfolio = 'localhost:5000'; // API for localhost

export default class App extends Component {
  state = {
    sideMenuOpen: false,
    loggedIn: false,
  }

  componentDidMount() {
        let authToken = localStorage.getItem("authToken");
        console.log("SENDING TOKEN: ", authToken)
        fetch(apiMoodportfolio + '/api/Login', {
            method: "GET", 
            mode: "cors",
            cache: "no-cache",
            withCredentials: true,
            credentials: "same-origin",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then(json => {
            console.log("Request was sent to API")
            console.log(json)
            if (!json.success) {
                ReactDOM.render(
                    <Login href="/login"/>,
                    document.getElementById('root')
                );
            }
            else {
                this.loggedIn = true
            }
        })

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
              let crd = pos.coords;
              sessionStorage.setItem("latitude", crd.latitude)
              sessionStorage.setItem("longitude", crd.longitude)
          });
      } 
    }

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
        // {/* All of this is activated once user logs in */}
        <Router>
          <div>
            <Header sideMenuClickHandler={this.sideMenuClickHandler}/>
            {sideMenu}
            {backDrop}

            <Switch>
              <main style={{marginTop: '71px'}}>
                  <Route exact path={"/"} component={Home} />
                  <Route path={"/capture"} component={Capture} />
                  <Route path={"/graph"} component={Graph} />
              </main>
            </Switch>
          </div>
        </Router>
    )
  }
}
