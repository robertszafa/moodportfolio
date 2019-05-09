import React from 'react';
import {apiMoodportfolio} from '../App';
import Button from 'react-bootstrap/Button';
import GraphPlotter from './GraphPlotter.js';
import formatDate from './Graph.js';

export default class TagSelect extends React.Component {
	
	constructor(props){
		super(props);
		this.state = {
			tags : []
		}
	}
	
	handleClick(o){
		this.props.onClick(o);
	}
	
	componentWillMount(){
		let basedOn = "tagUsage";
		let startDate = '01/01/1970';
		let endDate = formatDate(Date.now()); // exclusive
		let authToken = localStorage.getItem("authToken");
		
		
		fetch(apiMoodportfolio + '/EmotionsQuery', {
			method: "GET",
			mode: "cors",
			cache: "no-cache",
			credentials: "same-origin",
			headers: {
				"Authorization": authToken,
				"Content-Type": "application/json",
				"BasedOn": basedOn,
				"StartDate": startDate,
				"EndDate": endDate,
			},
		})
		.then((res) => res.json())
		.then(json => {
			const result = json.result;
			let temp = [];
			//put the tags in a list
			result.forEach(jsonData => {
				temp.push(jsonData.name);
			});
			//store list to state
			this.setState({tags : temp});
		})
		.catch(err => console.log(err))
	}
	
	render(){
		
		var tagButtons = [];
		//create a button for each tag
		for (let i = 0; i < this.state.tags.length; i++) {
			tagButtons.push(
				<div key={i} className="tag-button">
					<Button variant = "primary" onClick={() => this.handleClick(this.state.tags[i])} key={i}>{this.state.tags[i]}</Button>
				</div>
			)
		}
		console.log('tag buttons',tagButtons);
		return tagButtons;
	}
	
}