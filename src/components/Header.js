import React from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import ToggleMenu from './menu/ToggleMenu'
import '../stylesheet/header.css'
import Login from './Login'
import {apiMoodportfolio} from '../App'



export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.sideMenuClickHandler = props.sideMenuClickHandler;
        this.handleLogoutClick = this.handleLogoutClick.bind(this);   
    }
    
    handleLogoutClick() {
        localStorage.removeItem("authToken");
        ReactDOM.render(
            <Login />,
            document.getElementById('root')
        );
        console.log("token deleted")
    }
  
    render() {
        return (
            <header className="menuBar">
                <nav className="menuNavigation">

                    <div>
                        <ToggleMenu click={this.sideMenuClickHandler} />
                    </div>

                    <div className="menuLogo">
                        <a href="/"><p>Moodportfol.io</p></a>
                    </div>

                    <div className="space"></div>
                    
                    <div className="menuList">
                        <ul>
                            <li><a componentClass={Link} href="/capture" to="/capture">Capture</a></li>
                            <li><a componentClass={Link} href="/stats" to="/stats">Stats</a></li>
                            <li><a componentClass={Link} href="/profile" to="/profile">Profile</a></li>
                            <li><a componentClass={Link} href="/about-us" to="/about-us">About Us</a></li>
                            <li><a componentClass={Link} href="/login" onClick={this.handleLogoutClick}>Logout</a></li>
                        </ul>
                    </div>

                </nav>
            </header>
        )
    }
  }