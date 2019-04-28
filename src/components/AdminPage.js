import React from 'react'
import ReactDOM from 'react-dom'
import RecentPhotos from './RecentPhotos'
import Login from './Login'
import {apiMoodportfolio} from '../App'


export default class Home extends React.Component {
    constructor(props) {
      super(props);
    }


    getNumberOfUsers() {
        let authToken = localStorage.getItem("authToken");

        fetch(apiMoodportfolio + '/AdminQuery', {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            withCredentials: true,
            credentials: "same-origin",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "Nunmber of users signed up": this.state.photoId,
                                })
        })
        .then((res) => res.json())
        .then(json => {
            console.log(json)
        })
    }

    render() {
      return (
          <div className = "text-center homePageContainer">
            <br></br>
            <br></br>
            <div>
              <p>Number of users registered : </p>

            </div>
            <div>
              <p>Most popular tag: </p>
            </div>
            <div>
              <p>Most popular location : </p>
            </div>
            <div className = "userList">
              <p>List of users</p>
            </div>
            <div className = "photosOverTime">
              <p>How many photos have been uploaded over the last week</p>
            </div>
          </div>
      );
    }
  }
