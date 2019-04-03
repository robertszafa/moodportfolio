import React from 'react'
import ReactDOM from 'react-dom'
import {withFormik, Form, Field} from 'formik'
import Graph from './Graph'
import graphs from './graphs'
import Login from './Login'
import Registration from './Registration'
import logo from './logo.png'


export default class Dashboard extends React.Component {
    constructor(props) {
      super(props);
      this.state = {loggedIn: false};
    }
  
    componentDidMount() {
        let authToken = sessionStorage.getItem("authToken");
        console.log("SENDING TOKEN: ", authToken)
        fetch('http://localhost:5000/api/Login', {
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
                    <Login />,
                    document.getElementById('root')
                );
            }
            else {
                this.loggedIn = true
            }
        })
    }
 
    render() {
      return (
          <div>
              <h1>Hello! You are: </h1>
          </div>
      );
    }
  }