import React from 'react'
import ReactDOM from 'react-dom'
import Graph from './Graph'
import Login from './Login'


export default class Home extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      return (
          <div>
              <h1>Hello! You are: </h1>
          </div>
      );
    }
  }