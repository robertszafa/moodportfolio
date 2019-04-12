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
              <h1>Hello! You are: {this.emotion}</h1>
          </div>
      );
    }
  }