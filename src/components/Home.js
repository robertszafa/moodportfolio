import React from 'react'
import RecentPhotos from './RecentPhotos'


export default class Home extends React.Component {
    
    render() {
      return (
          <div className = "text-center ProfileContainer home">
            <RecentPhotos limit={5}/>
          </div>
      );
    }
  }
