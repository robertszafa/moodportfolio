import React from 'react'
import ReactDOM from 'react-dom'
import Graph from './Graph'
import Login from './Login'
import {apiMoodportfolio} from '../App'


export default class Home extends React.Component {
    constructor(props) {
      super(props);
      this.emotion = props.emotion;
    }

    render() {
      return (
          <div>
            <div className = "text-center homeGraph">
                <h1>Hello! You are: {this.emotion}</h1>
                <div id = "graphContainer">
                    "ENTER GRAPH COMPONENT css for color in app.css"
                </div>
            </div>

            <div className = "text-center homeSecondary">
                "enter secondary component here, css for color in app.css"
            </div>

          </div>


      );
    }
  }
