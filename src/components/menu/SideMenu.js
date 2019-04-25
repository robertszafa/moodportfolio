import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import Login from '../Login';
import '../../stylesheet/sideMenu.css';

const handleLogoutClick = () => {
    localStorage.removeItem("authToken");
    ReactDOM.render(
        <Login />,
        document.getElementById('root')
    );
    console.log("Token delete")
}

const sideMenu = props => (
    <nav className="sideMenu">
        <ul>
            <li><a componentClass={Link} href="/" to="/">Home</a></li>
            <li></li>
            <li><a componentClass={Link} href="/capture" to="/capture">Capture</a></li>
            <li><a componentClass={Link} href="/stats" to="/stats">Stats</a></li>
            <li><a componentClass={Link} href="/profile" to="/profile">Profile</a></li>
            <li><a componentClass={Link} href="/about-us" to="/about-us">About Us</a></li>
            <li><a componentClass={Link} href="/login" onClick={handleLogoutClick}>Logout</a></li>
        </ul>
    </nav>
)

export default sideMenu;