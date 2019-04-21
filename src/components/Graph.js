import React from 'react';
import ReactDOM from 'react-dom';
import GraphPlotter from './GraphPlotter.js';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';  //not clear why i don't need these
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import NodeViewer from './NodeViewer.js';
import ElementViewer from './ElementViewer.js';
import Photo from './Photo'
import {apiMoodportfolio} from '../App';

//The graph and its menus. Also has the method for getting data for the graphs based on the selected options.
export default class Graph extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			startDate: changeDate(1,getDayStart(Date.now()),-1),
			endDate: getDayEnd(Date.now()),
			selectedTime: 1, //Day = 1, Week = 2, Month  = 3
			selectedGraph: 2, //Bar = 1, Line = 2, Pie = 3, Radio = 4 (can't be selected)
			graphData: {},
			indexClicked: -1,
			photos: []
		}
		
		//this.photos = new Array(); //other way to set up the photos array if not meant to be state.
		
		this.handleTimeClick = this.handleTimeClick.bind(this);
		this.handleTypeClick = this.handleTypeClick.bind(this);
		this.handleBackClick = this.handleBackClick.bind(this);
		this.handleForwardClick = this.handleForwardClick.bind(this);
		this.handleNodeClick = this.handleNodeClick.bind(this);
	}
	
	componentWillMount(){
		this.GetPhotos();
		this.SetGraphData();
		this.SetGraphOptions();
	}
	
	//Get Graph Data
	
	GetPhotos(){
		
		let authToken = localStorage.getItem("authToken");
		let basedOn = "all";
		let strt = formatDate(this.state.startDate);
		let end = formatDate(this.state.endDate);
		//console.log(strt + " - " + end);
		console.log(strt + " - " + end);
		fetch(apiMoodportfolio + '/EmotionsQuery', {
					method: "POST",
					mode: "cors",
					cache: "no-cache",
					withCredentials: true,
					credentials: "same-origin",
					headers: {
							"Authorization": authToken,
							"Content-Type": "application/json",
					},
					body: JSON.stringify({ "basedOn": basedOn,
																	"startDate": strt,
																	"endDate": end,
							})
			})
			.then((res) => res.json())
			.then(json => {
				const result = json.result;
				result.forEach(jsonData => {
					this.state.photos.push(new Photo(jsonData));
				});
				//console.log(this.state.photos[0].props.timestamp);
			})
			.catch(err => console.log(err))
		
	}
	
	SetGraphOptions(timeCode){
		
		var timeValue;
		switch (timeCode) {
			case 1:
				timeValue = 1;
				break;
			case 2:
				timeValue = 7;
				break;
			case 3:
				timeValue = 28;
		}
		
		this.setState({
			
			options: {
				title: {text: "No Idea"},
				scales: {
					xAxes: [{
						title: "Time",
						type: 'time',
						gridLines: {
							lineWidth: 2
						},
						time: {
							unit: "day",
							unitStepSize: timeValue,	
							displayFormats: {
								millisecond: 'MMM DD',
								second: 'MMM DD',
								minute: 'MMM DD',
								hour: 'MMM DD',
								day: 'MMM DD',
								week: 'MMM DD',
								month: 'MMM DD',
								quarter: 'MMM DD',
								year: 'MMM DD',
							}
						}
					}]
				}
			}
		});
	}
	
	SetGraphData(){
		//if chart is line then need to average out the data, otherwise don't.
		
		let emotions = [];
		let timestamp = [];
		var i;
		for (i = 0; i < this.state.photos.length; i++){
			emotions.push(this.state.photos.props.dominantEmotion[i]);
			timestamp.push(this.state.photos.props.timestamp[i]);
		}
		console.log(emotions);
		console.log(timestamp);
		//turn photo info into graphData
		this.setState ({
			
			graphData: {
				label: 'Graph Data',
				labels: [
					'Anger',
					'Contempt',
					'Disgust',
					'Fear',
					'Happy',
					'Neutral',
					'Sad',
					'Surprise'
				],
				datasets: [{
					data: [20, 30, 15, 10, 20, 9, 8, 17],
					backgroundColor: [
						'#d270d3',
						'#fb7821',
						'#e83e17',
						'#bfc0ee',
						'#9f9e26',
						'#700846',
						'#771aab',
						'#e24b5a'
					],
					hoverBackgroundColor: [
						'#043d7e',
						'#beafa9',
						'#4fc690',
						'#667559',
						'#d29e81',
						'#46bbe9',
						'#13744c',
						'#9125d5'
					]
				}]
			}
		});

	}
	
	//Button handling functions
	
	handleTimeClick(o){
		//if day then don't subtract
		var d;
		if (o == 1){
			d = this.state.endDate;
		} else {
			d = changeDate(o,this.state.endDate,-1);
		}
		
		this.setState({
			selectedTime: o,
			startDate: d
		}); //may not need to store this at all but keeping for now in hopes of fixing the buttongroups
	}
	
	handleTypeClick(o){
		this.setState({selectedGraph: o});
	}
	
	handleBackClick(){
		this.setState({
			startDate: changeDate(this.state.selectedTime, this.state.startDate, -1),
			endDate: changeDate(this.state.selectedTime, this.state.endDate, -1)
		});
	}
	
	handleForwardClick(){
		this.setState({
			startDate: changeDate(this.state.selectedTime, this.state.startDate, 1),
			endDate: changeDate(this.state.selectedTime, this.state.endDate, 1)
		});
	}
	
	handleNodeClick(e){
		var index = -1;
		
		//if event fires and something is selected.
		if (e.length !== 0){
			index = e[0]._index;
		}
		console.log(index);
		//set the index clicked
		this.setState({indexClicked: index});
	}
	
	render () {
		console.log(this.state.selectedGraph);
		//do different stuff based on if data is ready or not
		
		var j;
		if (this.state.indexClicked != -1){
			j = <NodeViewer emotion={"Happy"} timestamp={Date.now()}/>;
		}
		
		return (
		<div className='text-center'>
			{/* Time unit menu */}
			<TimeMenu onClick = {this.handleTimeClick}/>
			{/* Date menu */}
			<DateSelector startDate={this.state.startDate} endDate={this.state.endDate} timeCode={this.state.selectedTime} onBackClick={this.handleBackClick} onForwardClick={this.handleForwardClick}/>
			{/* Time unit menu */}
			<GraphPlotter type = {this.state.selectedGraph} options = {this.state.graphOptions} data = {this.state.graphData} onClick={this.handleNodeClick}/>
			{/* Graph type menu */}
			<GraphMenu onClick = {this.handleTypeClick}/>
			{/* Node Viewer */}
			{j}
		</div>
		);
	}
}

class DateSelector extends React.Component {
	constructor(props) {
		super(props);
		
		this.handleBackClick = this.handleBackClick.bind(this);
		this.handleForwardClick = this.handleForwardClick.bind(this);
	}
	
	handleBackClick(o) {
		this.props.onBackClick(o);
	}
	
	handleForwardClick(o) {
		this.props.onForwardClick(o);
	}
	
	render () {
		//compare future date with current and decide whether to render end button.
		//if (changeDate(this.props.timeCode,this.props.endDate,1) > 
		
		var dateText;
		if (this.props.timeCode == 1){
			dateText = " " + formatDate(this.props.endDate) + " ";
		} else {
		dateText = (" " + formatDate(this.props.startDate) + " - " + formatDate(this.props.endDate) + " ");
			//dateText = "ERROR";
			//dateText= " " + formatDate(this.props.startDate)} <b> " - " </b> formatDate(this.props.endDate) + " ";
			//dateText = {" " + formatDate(this.props.startDate)} + {<b>" - "</b>} + {formatDate(this.props.endDate) + " "}
		}
		
		return (
			<div className='date-selector'>
				<Button variant="primary" onClick={this.handleBackClick}>{"<"}</Button>
				{dateText}
				<Button variant="primary" onClick={this.handleForwardClick}>{">"}</Button>
			</div>
		);
	}
}

class TimeMenu extends React.Component {
	
	constructor(props){
		super(props)
		this.handleClick = this.handleClick.bind(this)
	}
	
	handleClick(o) {
		this.props.onClick(o);
	}
	
	renderButton(n, v){
		return (
			<MenuButton
			name={n}
			onClick = {() => this.handleClick(v)}
			/>
		);
	}
	
	render () {
		return (
			<ButtonGroup className="time-menu" size="sm">
				{this.renderButton("Day",1)}
				{this.renderButton("Week",2)}
				{this.renderButton("Month",3)}
			</ButtonGroup>
		);
	}
}

function MenuButton(props) {
	return (
			<Button
			variant = "secondary"
			onClick={props.onClick}
			>
			{props.name}
			</Button>
	);
}

class GraphMenu extends React.Component {
	
	constructor(props){
		super(props)
		this.handleClick = this.handleClick.bind(this)
	}
	
	handleClick(o) {
		this.props.onClick(o);
	}
	
	renderButton(n, v){
		return (
			<MenuButton
			name={n}
			onClick = {() => this.handleClick(v)}
			/>
		);
	}
	
	render () {
		return (
			<ButtonGroup className="graph-menu" size="sm">
				{this.renderButton("Bar",1)}
				{this.renderButton("Line",2)}
				{this.renderButton("Pie",3)}
			</ButtonGroup>
		);
	}
}

function changeDate(timecode, date, modifier) {
		var d = new Date(date);
		switch (timecode){
			case 1:
				/* Day */
				return new Date(d.setDate(d.getDate() + (1 * modifier)));
			case 2:
				/* Week */
				return new Date(d.setDate(d.getDate() + (7 * modifier)));
			default:
				/* Month */
				return new Date(d.setMonth(d.getMonth() + (1 * modifier)));
		}
}

function formatDate(date) {
	var d = new Date(date);
	return (
		('0' + d.getDate()).slice(-2) + '/' + 
		('0' + (d.getMonth() + 1)).slice(-2) + '/' + 
		d.getFullYear()
	);
}

function getDayEnd(date){
	var d = new Date(date);
	d.setHours(23,59,59,999);
	return new Date(d);
}

function getDayStart(date){
	var d = new Date(date);
	d.setHours(0,0,0,0);
	return new Date(d);
}