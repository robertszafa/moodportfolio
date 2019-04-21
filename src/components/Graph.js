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
			selectedGraph: 3, //Bar = 1, Line = 2, Pie = 3, Radio = 4 (can't be selected). Have left bar in for now.
			graphData: {},
			indexClicked: -1,
			photos: new Array()
		}
		
		//this.photos = new Array(); //other way to set up the photos array if not meant to be state.
		
		this.dbEmotions = ['anger','contempt','disgust','fear','happiness','neutral','sadness','surprise'];
		this.handleTimeClick = this.handleTimeClick.bind(this);
		this.handleTypeClick = this.handleTypeClick.bind(this);
		this.handleBackClick = this.handleBackClick.bind(this);
		this.handleForwardClick = this.handleForwardClick.bind(this);
		this.handleNodeClick = this.handleNodeClick.bind(this);
	}
	
	componentWillMount(){
		this.GetPhotos(this.state.startDate,this.state.endDate);
	}
	
	//Get Graph Data
	
	testData(){
		
		var testData = [20, 30, 15, 10, 20, 9, 8, 17];
		
		this.setState({
			graphData: {
				label: 'Pie data',
				labels: [
					'Anger',
					'Contempt',
					'Disgust',
					'Fear',
					'Joy',
					'Surprise',
					'Sadness',
					'Neutral'
				],
				datasets: [{
					data: testData,
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
	
	// Gets Photos from server and then stuff
	// Uses startDate, endDate
	GetPhotos(start, end){
		
		let authToken = localStorage.getItem("authToken");
		let basedOn = "all";
		start = formatDate(start);
		end = formatDate(end);
		console.log(start);
		console.log(end);
		//let strt = formatDate(this.state.startDate);
		//let end = formatDate(this.state.endDate);

		//EMPTY THE Photos
		this.setState({
			photos: new Array()
		});
		
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
																	"startDate": start,
																	"endDate": end,
							})
			})
			.then((res) => res.json())
			.then(json => {
				const result = json.result;
				result.forEach(jsonData => {
					this.state.photos.push(new Photo(jsonData));
				});
				this.SetGraphData(this.selectedGraph);
				this.SetGraphOptions();
				//console.log(this.state.photos[0].props.timestamp);
			})
			.catch(err => console.log(err))
	}
	
	SetGraphOptions(timeCode, graphCode){
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
		
		//only call this when graph is over time
		
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

	SetGraphData(graphCode){
		
		//if chart is line then need to average out the data, otherwise don't.
		//extract data from photos
		
		let emotionProb = new Array();
		
		let timestamp = [];
		let i;
		for (i = 0; i < this.state.photos.length; i++){
			emotionProb.push(JSON.stringify(this.state.photos[i].state.dominantEmotion));
			timestamp.push(this.state.photos[i].props.timestamp);
		}
		
		var emotionsString = emotionProb.toString();
		//turn photo info into graphData

		//if graph is over time
		if (graphCode === 2){
			this.SetGraphData_OverTime(emotionsString,timestamp);
		} else {
			this.SetGraphData_Overall(emotionsString,timestamp);
		}

	}
	
	SetGraphData_Overall(emotionProbs, timestamp){
		var emotionP = emotionProbs.split(",");
		//loop through the emotions and count total of each
		let emotionCount = new Array(this.dbEmotions.length).fill(0);
		
		let i, j;
		for (i = 0; i < emotionP.length; i++){
			for (j = 0; j < this.dbEmotions.length; j++){
				if (emotionP[i].includes(this.dbEmotions[j])){
					emotionCount[i] ++;
				}
			}
		}

		this.setState({
			graphData: {
				label: 'Emotions Overall',
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
					data: emotionCount,
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
	
	SetGraphData_OverTime(emotions,timestamp){

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
		if (o === 1){
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
		this.GetPhotos(this.state.startDate, this.state.endDate);
	}
	
	handleBackClick(){
		
		let start = changeDate(this.state.selectedTime, this.state.startDate, -1);
		let end = changeDate(this.state.selectedTime, this.state.endDate, -1);
		
		this.setState({
			startDate: start,
			endDate: end
		});
		this.GetPhotos(start, end);
	}
	
	handleForwardClick(){
		
		let start = changeDate(this.state.selectedTime, this.state.startDate, 1);
		let end = changeDate(this.state.selectedTime, this.state.endDate, 1);
		
		this.setState({
			startDate: start,
			endDate: end
		});
		this.GetPhotos(start, end);
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
			{/* Graph Component */}
			<GraphPlotter type = {this.state.selectedGraph} data = {this.state.graphData} onClick={this.handleNodeClick}/>
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
		if (this.props.timeCode === 1){
			dateText = " " + formatDate(this.props.startDate) + " ";
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
		<div>
			<ButtonGroup className="time-menu" size="sm">
				{this.renderButton("Day",1)}
				{this.renderButton("Week",2)}
				{this.renderButton("Month",3)}
			</ButtonGroup>
			</div>
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
				{this.renderButton("Over Time",2)}
				{this.renderButton("Overall",3)}
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