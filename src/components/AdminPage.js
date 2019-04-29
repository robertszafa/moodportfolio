import React from 'react'
import ReactDOM from 'react-dom'
import RecentPhotos from './RecentPhotos'
import Login from './Login'
import {apiMoodportfolio} from '../App'


export default class AdminPage extends React.Component {
	constructor(props) {
		super(props);
	  
		this.state = {
			numOfUsers: null,
			mostPopularTag: null,
			mostPopularLoc: null,
			numOfPhotos: null,
			error: null			
        }
		
		this.getNumberOfUsers = this.getNumberOfUsers.bind(this);
		this.getMostPopularTag = this.getMostPopularTag.bind(this);
		this.getMostPopularLoc = this.getMostPopularLoc.bind(this);
		this.getPhotocountOverLastWeek = this.getPhotocountOverLastWeek.bind(this);
	}

	componentWillMount(){
		this.getNumberOfUsers();
		this.getMostPopularTag();
		this.getMostPopularLoc();
		this.getPhotocountOverLastWeek();
	}

	getNumberOfUsers() {
		
		let authToken = localStorage.getItem("authToken");

		fetch(apiMoodportfolio + '/SplAdminQuery', {
			method: "GET",
			mode: "cors",
			cache: "no-cache",
			withCredentials: true,
			credentials: "same-origin",
			headers: {
				"Authorization": authToken,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
								  'basedOn': "#users",
								  'splSQLQuery' : ""
								})
		})
		.then((res) => res.json())
		.then(json => {
			console.log(json)
			if(json.success){
				this.setState({numOfUsers: json.result});
			} else {
				this.setState({error: json.error});
			}
		})
	}

	//return the most popular tag from the TAG table
	getMostPopularTag() {
		let authToken = localStorage.getItem("authToken");

		fetch(apiMoodportfolio + '/SplAdminQuery', {
			method: "GET",
			mode: "cors",
			cache: "no-cache",
			withCredentials: true,
			credentials: "same-origin",
			headers: {
				"Authorization": authToken,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
								  'basedOn': "popularTag",
								  'splSQLQuery' : ""
								})
		})
		.then((res) => res.json())
		.then(json => {
			console.log(json)
			if(json.success){
				//result is the answer.
				this.setState({mostPopularTag: json.result});
			} else {
				this.setState({error: json.error});
			}
		})
	}

	//return the most popular location users are from
	getMostPopularLoc() {
		let authToken = localStorage.getItem("authToken");

		fetch(apiMoodportfolio + '/SplAdminQuery', {
			method: "GET",
			mode: "cors",
			cache: "no-cache",
			withCredentials: true,
			credentials: "same-origin",
			headers: {
				"Authorization": authToken,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
								  'basedOn': "any",
								  'splSQLQuery' : "SELECT country, MAX(country) from User",
								})
		})
		.then((res) => res.json())
		.then(json => {
			console.log(json)
			if(json.success){
				//result is the answer.
				this.setState({mostPopularLoc: json.result});
			} else {
				this.setState({error: json.error});
			}
		})
	}

	//return the photos uploaded per day
	getPhotocountOverLastWeek() {
		let authToken = localStorage.getItem("authToken");

		fetch(apiMoodportfolio + '/AdminQuery', {
			method: "GET",
			mode: "cors",
			cache: "no-cache",
			withCredentials: true,
			credentials: "same-origin",
			headers: {
				"Authorization": authToken,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
								  'basedOn': "any",
								  'splSQLQuery' : "SELECT Date(timestamp), count(photoID) FROM Photo GROUP BY DATE(timestamp)",
								})
		})
		.then((res) => res.json())
		.then(json => {
			console.log(json)
			if(json.success){
				//result is the answer.
				this.setState({numOfPhotos: json.result})
			} else {
				this.setState({error: json.error})
			}
		})
	}


	//Render web page
	render() {
	  return (
		  <div className = "text-center homePageContainer">
			<br></br>
			<br></br>
			<p>Number of users registered : {this.state.numOfUsers}</p>
			<p>Most popular tag: {this.state.mostPopularTag}</p>			
			<p>Most popular location : {this.state.mostPopularLoc}</p>
			<p>How many photos have been uploaded over the last week : {this.state.numOfPhotos}</p>
		  </div>
	  );
	}
}
