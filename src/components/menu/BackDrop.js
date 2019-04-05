import React from 'react'
import '../../stylesheet/backDrop.css'

const backDrop = props => (
    <div className="backDrop" onClick={props.click}></div>
);

export default backDrop;