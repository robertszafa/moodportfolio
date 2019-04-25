import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header'
import SideMenu from './components/menu/SideMenu'
import BackDrop from './components/menu/BackDrop' 
import Home from './components/Home'
import Capture from './components/Capture'
import Stats from './components/Stats'
import AboutUs from './components/AboutUs'
import Login from './components/Login'
import Profile from './components/Profile'
import Register from './components/Register'
import ChangePassword from './components/ChangePassword'
import './stylesheet/app.css'
import TagMenu from './components/TagMenu';
import { library } from '@fortawesome/fontawesome-svg-core'


export const apiMoodportfolio = 'https://api.moodportfolio.ml'; // API for server
// export const apiMoodportfolio = 'http://127.0.0.1:5000'; // API for localhost

export default class App extends Component {
  state = {
    sideMenuOpen: false,
    loggedIn: false,
  }

  componentDidMount() {
        let authToken = localStorage.getItem("authToken");
        fetch(apiMoodportfolio + '/Login', {
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
              <main style={{marginTop: '54px'}}>
                  <Route exact path={"/"} component={Home} />
                  <Route path={"/capture"} component={Capture} />
                  <Route path={"/stats"} component={Stats} />
                  <Route exact path={"/tag"} component={TagMenu} />
                  <Route path={"/profile"} component={Profile} />
                  <Route path={"/about-us"} component={AboutUs} />
                  <Route path={"/change-password"} component={ChangePassword} />
              </main>
            </Switch>
          </div>
        </Router>
    )
  }
}
