import React from 'react'
import {Link} from 'react-router-dom'
import ToggleMenu from './menu/ToggleMenu'
import '../stylesheet/header.css'
import Logo from '../images/logo-2.png'

const Header = props => (
    <header className="menuBar">
        <nav className="menuNavigation">
            <div>
                <ToggleMenu click={props.sideMenuClickHandler} />
            </div>

            <div>
                <a componentClass={Link} href="/" to="/"><img className="menuLogo" src={Logo} alt="Moodportfol.io Logo"/></a>
            </div>
            <div className="menuList">
                <ul>
                    <li><a componentClass={Link} href="/capture" to="/capture">Capture</a></li>
                    <li><a componentClass={Link} href="/graph" to="/graph">Graph</a></li>
                    <li><a href="/">Profile</a></li>
                </ul>
            </div>
        </nav>
    </header>
)

export default Header;