import React from 'react'
import ToggleMenu from './menu/ToggleMenu'
import '../stylesheet/header.css'
import Logo from '../images/logo-2.png'

const Header = props => (
    <header className="menuBar">
        <nav className="menuNavigation">
            <div>
                <ToggleMenu click={props.sideMenuClickHandler} />
            </div>
            <div><img className="menuLogo" src={Logo} alt="Moodportfol.io Logo"/></div>
            <div className="space"></div>
            <div className="menuList">
                <ul>
                    <li><a href="/">Graph</a></li>
                    <li><a href="/">Capture</a></li>
                </ul>
            </div>
        </nav>
    </header>
)

export default Header;