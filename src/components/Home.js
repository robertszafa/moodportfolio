import React from 'react'
import ReactDOM from 'react-dom'
import RecentPhotos from './RecentPhotos'
import Login from './Login'
import {apiMoodportfolio} from '../App'


export default class Home extends React.Component {
    constructor(props) {
      super(props);
    }


    render() {
      return (
          <div className = "text-center ProfileContainer home">
            <RecentPhotos limit={5}/>
          </div>
      );
    }
  }
