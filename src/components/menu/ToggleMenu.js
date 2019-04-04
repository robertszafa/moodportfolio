import React from 'react';
import '../../stylesheet/toggleMenu.css'

const toggleMenu = props => (
    <button className="toggleButton" onClick={props.click}>
        <div className="toggleLine"></div>
        <div className="toggleLine"></div>
        <div className="toggleLine"></div>
    </button>
)

export default toggleMenu;