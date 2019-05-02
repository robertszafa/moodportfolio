import React from 'react';
import {apiMoodportfolio} from '../App';
import Button from 'react-bootstrap/Button';
import GraphPlotter from './GraphPlotter.js';

export default class TagSelect extends React.Component {
	
	constructor(props){
		super(props);
		this.state = {
			tags : []
		}
	}
	
	componentWillMount(){
		let basedOn = "tagUsage";
		let startDate = '01/01/1970';
		let endDate = "02/05/2019"; // exclusive
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
			
			result.forEach(jsonData => {
				temp.push(jsonData.name);
				//console.log('test',new Photo(jsonData));
			});
			this.setState({tags : temp});
			console.log('tag emotionsquery', json);
			console.log('what was stored',this.state.tags);
		})
		.catch(err => console.log(err))
	}
	
	render(){
		
		var tagButtons = [];

		for (let i = 0; i < this.state.tags.length; i++) {
			tagButtons.push(
				<div key={i} className="tag-button">
					<Button variant = "primary" onClick={this.props.onClick}>{this.state.tags[i]}</Button>
				</div>
			)
		}
		console.log('tag buttons',tagButtons);
		return tagButtons;
	}
	
}