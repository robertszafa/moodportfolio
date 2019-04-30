import React from 'react'
import ReactDOM from 'react-dom'
import RecentPhotos from './RecentPhotos'
import Login from './Login'
import { Button } from 'react-bootstrap'
import {Link} from 'react-router-dom';
import {apiMoodportfolio} from '../App'

//DELETE QUERY!
//display result from splSQLQuery in table format.

export default class AdminPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			numOfUsers: null,
			mostPopularTag: "",
			mostPopularLoc: null,
			numOfPhotos: null,
			sqlQRes: [],
			show: false,
			errorInput:'',
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

		this.postToSplAdminQueryAPI("SELECT count(*) as number from User")
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
		this.postToSplAdminQueryAPI("SELECT name,count from Tag where count = (select max(count) from Tag)")
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
		this.postToSplAdminQueryAPI("SELECT MAX(townCity) as city from User")
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
		console.log(oneWeekAgoSQL)
		var _sqlStmt = "select count(photoID) as number from Photo where timestamp between \"" + oneWeekAgoSQL + "\" and \"" + todaySQL + "\""
		
		this.postToSplAdminQueryAPI(_sqlStmt)		
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
		
		//fix timestamp:
		if (_startDate!="" && _endDate!="") {
			_startDate = _startDate+" 00:00:00"
			_endDate = _endDate+" 00:00:00"
		}

		if (_sqlQ!="") {
			//call SplAdminQuery API
			this.postToSplAdminQueryAPI(_sqlQ)
			.then((res) => res.json())
			.then(json => {
				console.log("Spl SQL Q response", json.result)
				if(json.success){
					let data = []
					json.result.forEach(function(dict) {
						data.push(dict)
					})
					console.log(data)
					let _show = (data.length==0 ? false : true)
					this.setState({
						sqlQRes:data,
						show: _show
					})
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
				//console.log("Form response: ", json)
				if(json.success){
					let data = []
					json.result.forEach(function(dict) {
						data.push(dict)
					})
					console.log(data)
					let _show = (data.length==0 ? false : true)
					this.setState({
						sqlQRes:data,
						show: _show
					})
				} else {
					this.setState({error: json.error});
				}
			})
		}
	}

	postToSplAdminQueryAPI(sqlStmt) {
		let authToken = localStorage.getItem("authToken");

		return fetch(apiMoodportfolio + '/SplAdminQuery', {
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
				'splSQLQuery' : sqlStmt
			})
		})
	}

	editColumn(p,k,e) {
		let inputValue = e.target.innerText;
		let obj = p.p;
		let objId = obj.id;
		let position = k.k;
		let values = Object.values(obj);
		if(values.indexOf(inputValue) == -1){
				obj[position] = inputValue;
				let stateCopy = this.state.data;
				stateCopy.map((object,index) =>{
							if(object.id == objId){
									object = obj[position];
							}
				})
				this.setState(stateCopy);
				this.setState({errorInput:''});
				console.log(stateCopy,'stateCopystateCopy');
		} else{
				this.setState({errorInput:'This period is also available in your list'});
				return false;
		}
	}

	clearForm(e) {
		e.preventDefault();
		this.ref.f1.value = '';this.ref.f5.value = '';
		this.ref.f2.value = '';this.ref.f6.value = '';
		this.ref.f3.value = '';this.ref.f7.value = '';
		this.ref.f4.value = '';this.ref.f8.value = '';		
	}
	//Render web page
	render() {
		let list = null
		let colHeaders = null
		if(this.state.show && this.state.sqlQRes.length!=0) {

		colHeaders = <tr className="tableHeaders" key="header">
			{Object.keys(this.state.sqlQRes[0]).filter(k => k !== 'hashedPassword').map((k,i) => {
				return (<th className="headers" key={"header"+i}>{k}</th>)
			})}</tr>

		list = this.state.sqlQRes.map((dict,index) =>{
			return (
			  <tr className="grey2" key={index}>
				{Object.keys(dict).filter(k => k !== 'hashedPassword').map(k=> {
				  return (
					<td className="grey1" key={index+''+k}><div suppressContentEditableWarning="true" contentEditable="true"
				    value={k} onInput={this.editColumn.bind(this,{dict},{k})}>{dict[k]}</div></td>);
				})}
			  </tr>
			);
		});
		}

	  return (
		  <div className = "text-center homePageContainer">
				<br></br>
				<br></br>
				<h4>Statistics</h4>
				<p>Number of users registered : {this.state.numOfUsers}</p>
				<p>Most popular tag: {this.state.mostPopularTag}</p>
				<p>Most popular location : {this.state.mostPopularLoc}</p>
				<p>How many photos have been uploaded over the last week : {this.state.numOfPhotos}</p>
				<hr />
				<br />
				<p>Fill in 1 or several of the following boxes to run queries with specific conditions (e.g. query for emotions where the city is Liverpool and time interval is today's date etc!)</p>

				<form onSubmit = { this.handleSubmit }>
          Enter a userID:   
          <input type ="text" ref="f1" name ="userID" placeholder="UserID" />
          <br />
          <br />
          Enter a city:
          <input type = "text" ref="f2" name = "city" placeholder = "City" />
          <br />
          <br />
          Enter a country: 
          <input type ="text" ref="f3" name = "country" placeholder = "Country" />
          <br/>
          <br/>          
          Enter a tag name:
          <input type ="text" ref="f4" name="tagName" placeholder= "Tag Name" />
          <br/>
          <br/>
		  Enter a tag id:
          <input type = "text" ref="f5" name= "tagID" placeholder = "Tag ID" />
          <br/>
          <br/>
		  Enter start and finish date (yyyy-mm-dd):
          <input type = "text" ref="f6" name = "startDate" placeholder = "startDate" /> AND <input type = "text" ref="f7" name = "endDate" placeholder = "Tag Name" />
          <br/>
          <br/>
   	    	OR
		  <br/>
		  <br/>
		  Write your own SQL query (without the semicolon at the end)
          <input type = "text" ref="f8" name="sqlQ" placeholder = "SQL Query" />
          <br/>
          <br/>
          <button type="submit" > Submit </button> 
		  <br/>
		  <button onClick={this.clearForm}> Clear Form </button>
        </form>
		
				<fieldset className="step-4">
					<div className="heading">
						{this.state.show ? <h3>SQL RESULT</h3> : null}
					</div>
					<div className="schedule padd-lr">
						<table id="mytable" border = "2">
						  <tbody>
							{colHeaders}
							{list}
						  </tbody>
						</table>
					</div>
        </fieldset>

		  </div>
	  );
	}
}
//<pre>{JSON.stringify(this.state.sqlQRes, null, 4) }</pre>
//select * from User where userID=5