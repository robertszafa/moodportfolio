import React from 'react'
import ReactDOM from 'react-dom'
import Pie from 'react-chartjs-2';


export default class Graph extends React.Component {
    constructor(props) {
      super(props);
      this.state = {emotion: ""};
    }
  
    componentDidMount() {
        let authToken = sessionStorage.getItem("authToken");
        fetch('http://localhost:5000/api/Emotions', {
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
            ReactDOM.render(
                <h1>Hello: You are {json.emotion}</h1>,
                document.getElementById('root')
            );
        })
    }
 
    render() {
      return (
        <div>
          Graph Component
        </div>
      );
    }
  }