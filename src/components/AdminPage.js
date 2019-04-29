import React from 'react'
import ReactDOM from 'react-dom'
import RecentPhotos from './RecentPhotos'
import Login from './Login'
import { Button } from 'react-bootstrap'
import {Link} from 'react-router-dom';
import {apiMoodportfolio} from '../App'

//DELETE QUERY!

export default class AdminPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			numOfUsers: null,
			mostPopularTag: "",
			mostPopularLoc: null,
			numOfPhotos: null,
			sqlQRes: null,
			formRes: null,
			error: null
    }

		this.getNumberOfUsers = this.getNumberOfUsers.bind(this);
		this.getMostPopularTag = this.getMostPopularTag.bind(this);
		this.getMostPopularLoc = this.getMostPopularLoc.bind(this);
		this.getPhotocountOverLastWeek = this.getPhotocountOverLastWeek.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
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
				console.log("#users",json.result[0])							
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
			if(json.success){
				console.log("popTag",json.result[0])
				//result is the answer.
				var tagKeys = Object.keys(json.result[0])
				var tagValues = tagKeys.map(function(key) {
					return ["\n"+key+ ": ", json.result[0][key]]
				})				
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
								  'splSQLQuery' : " SELECT MAX(townCity) as city from User",
								})
		})
		.then((res) => res.json())
		.then(json => {
			if(json.success){
				console.log("popLoc",json.result[0])			
				this.setState({mostPopularLoc: json.result[0]["city"]});
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

	handleSubmit(e) {
		e.preventDefault();        

		//get task description, deadline, reward
		let _userID = document.querySelector('input[name=userID]').value;
		let _city = document.querySelector('input[name=city]').value;
		let _country = document.querySelector('input[name=country]').value;
		let _tagName = document.querySelector('input[name=tagName]').value;
		let _tagID = document.querySelector('input[name=tagID]').value;
		let _startDate = document.querySelector('input[name=startDate]').value;
		let _endDate = document.querySelector('input[name=endDate]').value;
		let _sqlQ = document.querySelector('input[name=sqlQ]').value;
		let authToken = localStorage.getItem("authToken");

		if (_sqlQ!="") {
			//call SplAdminQuery API
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
										'splSQLQuery' : _sqlQ
									})
			})
			.then((res) => res.json())
			.then(json => {
				console.log("Spl SQL Q response", json)
				if(json.success){
					console.log(json.result[0])
					//ITERATE OVER EACH ELEMENT IN JSON.RESULT
//THIS WAY GIVES ONLY FIRST RESULT !!!!!
					var _keys = Object.keys(json.result[0])
					var _values = _keys.map(function(key) {
						return ["\n"+key+ ": ", json.result[0][key]]
					})
					console.log(_values)				
					this.setState({sqlQRes: _values});
				} else {
					this.setState({error: json.error});
				}
			})
		} else {
			//call AdminQuery API
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
					'startDate': _startDate,
					'endDate' : _endDate,
					'city': _city,
					'country' : _country,
					'userID' : _userID,
					'tagName' : _tagName,
					'tagID' : _tagID
				})
			})
			.then((res) => res.json())
			.then(json => {
				console.log("Form response: ", json)
				if(json.success){
					console.log(json.result[0])
					//result is the answer.
					var _keys = Object.keys(json.result[0])
					var _values = _keys.map(function(key) {
						return ["\n"+key+ ": ", json.result[0][key]]
					})
					console.log(_values)				
					this.setState({sqlQRes: _values});
				} else {
					this.setState({error: json.error});
				}
			})
		}
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

				<hr />
				<br />
				<p>Fill in 1 or several of the following boxes to run queries with specific conditions (e.g. query for emotions where the city is Liverpool and time interval is today's date etc!)</p>

				<form onSubmit = { this.handleSubmit }>
          Enter a userID:   
          <input type = "text" name = "userID" placeholder = "UserID" />
          <br />
          <br />
          Enter a city:
          <input type = "text" name = "city" placeholder = "City" />
          <br />
          <br />
          Enter a country: 
          <input type = "text" name = "country" placeholder = "Country" />
          <br/>
          <br/>          
          Enter a tag name:
          <input type = "text" name = "tagName" placeholder = "Tag Name" />
          <br/>
          <br/>
		  Enter a tag id:
          <input type = "text" name = "tagID" placeholder = "Tag Name" />
          <br/>
          <br/>
		  Enter a start date (dd-mm-yyyy):
          <input type = "text" name = "startDate" placeholder = "Tag Name" />
          <br/>
          <br/>
		  Enter a end date (dd-mm-yyyy):
          <input type = "text" name = "endDate" placeholder = "Tag Name" />
          <br/>
          <br/>
   		  <br/>
          <br/>
   	    	OR
					<br/>
					<br/>
					Write your own SQL query (without the semicolon at the end)
          <input type = "text" name = "sqlQ" placeholder = "SQL Query" />
          <br/>
          <br/>
          <button type="submit" > Submit </button> 
        </form>

				{this.state.sqlQRes}

		  </div>
	  );
	}
}
//select * from User where userID=5