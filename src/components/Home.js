import React from 'react'
import ReactDOM from 'react-dom'
import Graph from './Graph'
import Login from './Login'


export default class Home extends React.Component {
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