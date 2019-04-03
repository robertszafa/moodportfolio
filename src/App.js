import React, {Component} from 'react'
import Dashboard from './components/Dashboard.js'
import Menu from './components/menu/Menu'
import './stylesheet/app.css'

export default class App extends Component {
  render (){
    return(
      <div>
        <Menu />
        <main style={{marginTop: '16%'}}>
          <Dashboard />
        </main>
      </div>
    )
  }
}
