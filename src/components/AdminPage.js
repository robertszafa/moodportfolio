import React from 'react'
import ReactDOM from 'react-dom'
import RecentPhotos from './RecentPhotos'
import Login from './Login'
import { Button } from 'react-bootstrap'
import {Link} from 'react-router-dom';
import {apiMoodportfolio} from '../App'

/*fetch("/api/users/delete/" + userId, requestOptions).then((response) => {
	return response.json();
}).then((result) => {
	// do what you want with the response here
});
*/

export default class AdminPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			numOfUsers: null,
			mostPopularTag: "",
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

	async getNumberOfUsers() {

		let authToken = localStorage.getItem("authToken");

		let jsonBody = {
			'basedOn': "#users",
			'splSQLQuery' : ""
		}

		fetch(apiMoodportfolio + '/SplAdminQuery', {
			method: "POST",
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
			//console.log(json)
			if(json.success){
				console.log(json.result[0])								
				this.setState({numOfUsers: json.result[0]["number"]});
			} else {
				this.setState({error: json.error});
			}
		})
	}

	//return the most popular tag from the TAG table
	getMostPopularTag() {
		let authToken = localStorage.getItem("authToken");

		fetch(apiMoodportfolio + '/SplAdminQuery', {
			method: "POST",
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
			//console.log(json)
			if(json.success){
				console.log(json.result[0])
				//result is the answer.
				var tagKeys = Object.keys(json.result[0])
				var tagValues = tagKeys.map(function(key) {
					return ["\n"+key+ ": ", json.result[0][key]]
				})
				console.log(tagValues)				
				this.setState({mostPopularTag: tagValues});
			} else {
				this.setState({error: json.error});
			}
		})
	}

	//return the most popular location users are from
	getMostPopularLoc() {
		let authToken = localStorage.getItem("authToken");

		fetch(apiMoodportfolio + '/SplAdminQuery', {
			method: "POST",
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
								  'splSQLQuery' : " SELECT MAX(country) as country from User",
								})
		})
		.then((res) => res.json())
		.then(json => {
			//console.log(json)
			if(json.success){
				console.log(json.result[0])			
				this.setState({mostPopularLoc: json.result[0]["country"]});
			} else {
				this.setState({error: json.error});
			}
		})
	}

	//return the photos uploaded per day
	getPhotocountOverLastWeek() {
		let authToken = localStorage.getItem("authToken");
		
		var todaySQL = new Date().toISOString().slice(0, 19).replace('T', ' ');
		var oneWeekAgo = new Date();
		oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
		var oneWeekAgoSQL = oneWeekAgo.toISOString().slice(0, 19).replace('T', ' ');
		console.log("select count(photoID) as number from Photo where timestamp between \"" + oneWeekAgoSQL + "\" and \"" + todaySQL + "\"")
		
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
			body: JSON.stringify({
								  'basedOn': "any",
								  'splSQLQuery' : "select count(photoID) as number from Photo where timestamp between \"" + oneWeekAgoSQL + "\" and \"" + todaySQL + "\""
								})
		})
		.then((res) => res.json())
		.then(json => {
			console.log(json)
			if(json.success){
				console.log(json.result[0])			
				this.setState({numOfPhotos: json.result[0]["number"]});
			} else {
				this.setState({error: json.error});
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
