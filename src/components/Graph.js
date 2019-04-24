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
			startDate: getDayStart(Date.now()),
			endDate: getDayEnd(Date.now()),
			currentDate: Date.now(),
			selectedTime: 1, //Day = 1, Week = 2, Month  = 3
			selectedGraph: 2, //Bar = 1, Line = 2, Pie = 3, Radio = 4 (can't be selected). Have left bar in for now.
			graphData: {},
			graphOptions: {},
			indexClicked: -1, 
			photos: []
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
		//this.testDataTime(this.state.selectedTime,this.state.startDate,this.state.endDate);
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
	
	testDataTime(timecode,startdate,enddate){
		console.log(startdate + " " + enddate);
		let datetimeLabels = [];
		datetimeLabels.length = 0;
		let timeFormat = 'MM DDD';
		let i = 0;
		//make label array based on timeCode
		//decide display format based on timeCode
		let d = startdate;
		let thedata = [];
		thedata.length = 0;
		let cols = ['#d270d3','#fb7821','#e83e17','#bfc0ee','#9f9e26','#700846','#771aab','#e24b5a'];
		let bgcols = [];
		let r;
		let stepSize, timeValue;
		let minDate, maxDate;
		console.log("DATE:" + d);
		console.log(timecode);
		switch (timecode){
			case 1: //day
				timeFormat = 'hA';
				stepSize = 'hour'
				timeValue = 3;
				minDate = startdate;
				maxDate = enddate;
				for (i = 0; i < 24; i++){
					datetimeLabels.push(d);
					r = Math.floor(Math.random() * 6);
					thedata.push(r);
					bgcols.push(cols[r]);
					d = changeDate(0,d,1);
				}
				break;
			case 2: //week
				timeFormat = 'MMM DD';
				stepSize = 'day'
				timeValue = 1;
				minDate = startdate;
				maxDate = changeDate(1,enddate,-1);
				for (i = 0; i < 7; i++){
					datetimeLabels.push(d);
					r = Math.floor(Math.random() * 6);
					thedata.push(r);
					bgcols.push(cols[r]);
					d = changeDate(1,d,1);
				}
				break;
			case 3: //month
				timeFormat = 'MMM DD';
				stepSize = 'day'
				timeValue = 3;
				minDate = startdate;
				maxDate = changeDate(1,enddate,-1);
					//until end of month, so just WHILE until startDate == endDate? or >?
				while(d < enddate){ //shouldn't directly reference endDate here as might change. should be passed in.
					datetimeLabels.push(d);
					d = changeDate(1,d,1);
					r = Math.floor(Math.random() * 6);
					thedata.push(r);
					bgcols.push(cols[r]);
				}
				break;
			default:
				console.log("Incorrect tiemcode in testDataTime");
		}
		console.log("DATA");
		console.log(datetimeLabels);
		
		let yLabels = {
			0: 'nothing',
			1: 'Anger',
			2: 'Contempt',
			3: 'Disgust',
			4: 'Fear',
			5: 'Sadness',
			6: 'Neutral',
			7: 'Surprise',
			8: 'Happiness'
		}
		
		//so just need to set null when the data doesn't work
		
		this.setState({
			graphData: {
				label: 'Line data',
				labels: datetimeLabels,
				datasets: [{
					label: "Emotions",
					data: thedata,
					borderColor: '#e24b5a',
					fill: false
				}]
			},
			
			graphOptions: {
				legend: {
					display: false,
				},
				scales: {
					yAxes: [{
						title: "Emotion",
						ticks: {
							beginAtZero: true,
							userCallBack: function(label,index,yLabels) {
								return yLabels[label];
							}
						}
					}],
					xAxes: [{
						type: 'time',
						time: {
							unit: stepSize,
							unitStepSize: timeValue,
							max: maxDate,
							min: minDate,
							displayFormats: {
								'millisecond': timeFormat,
								'second': timeFormat,
								'minute': timeFormat,
								'hour': timeFormat,
								'day': timeFormat,
								'week': timeFormat,
								'month': timeFormat,
								'quarter': timeFormat,
								'year': timeFormat,
							}
							}
					}],
				},
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
			photos: []
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
				this.SetGraphData(this.state.selectedGraph);
				//console.log(this.state.photos[0].props.timestamp);
			})
			.catch(err => console.log(err))
	}
	
	SetGraphOptions(timeCode, graphCode){
		
		let timeValue;
		let stepSize;
		let d = this.state.currentDate;

		switch (timeCode) {
			case 1:
				timeValue = 1;
				stepSize = "hour";
				break;
			case 2:
				timeValue = 7;
				stepSize = "day";
				break;
			case 3:
				timeValue = getMonthEnd(d.getMonth()).getDate() + 1; //need to get current months num of days
				stepSize = "day";
				break;
			default:
				console.log("Timecode wrong in SetGraphOptions");
		}

		let yLabels = {
			0: '',
			1: 'Anger',
			2: 'Contempt',
			3: 'Disgust',
			4: 'Fear',
			5: 'Sadness',
			6: 'Neutral',
			7: 'Surprise',
			8: 'Happiness'
		}
		
		//only call this when graph is over time
		
		this.setState({
			
			graphOptions: {
				legend: {
					display: false
				},
				title: {text: "No Idea"},
				scales: {
					yAxes: [{
						title: "Emotion",
						ticks: {
							beginAtZero: true,
							userCallBack: function(label,index,labels) {
								return yLabels[label];
							}
						}
					}],
					xAxes: [{
						title: "Time",
						type: 'time',
						gridLines: {
							lineWidth: 2
						},
						time: {
							/*
							unit: stepSize,
							unitStepSize: timeValue,
							max: this.state.endDate,
							min: this.state.startDate,
							*/
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
		
		let emotionProb = [];
		let timestamp = [];
		let i;
		for (i = 0; i < this.state.photos.length; i++){
			emotionProb.push(JSON.stringify(this.state.photos[i].state.dominantEmotion));
			timestamp.push(this.state.photos[i].props.timestamp);
		}
		//var emotionsString = emotionProb.toString();
		//turn photo info into graphData

		//if graph is over time
		if (graphCode === 2){
			this.SetGraphData_OverTime(emotionProb,timestamp);
		} else {
			this.SetGraphData_Overall(emotionProb);
		}

	}
	
	SetGraphData_Overall(emotionProbs){
		this.state.graphOptions = {};
		//var emotionP = emotionProbs;
		//loop through the emotions and count total of each
		let emotionCount = new Array(this.dbEmotions.length).fill(0);
		
		let i, j;
		for (i = 0; i < emotionProbs.length; i++){
			for (j = 0; j < this.dbEmotions.length; j++){
				if (emotionProbs[i].includes(this.dbEmotions[j])){
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
	
	SetGraphData_OverTime(emotionProbs,timestamp){

		let formattedDate = [];
		let i;
		for (i = 0; i < timestamp.length; i++){
			formattedDate.push(formatDate(timestamp[i]));
		}
		console.log(formattedDate);
		//Create xLabels - either hours or days
		let xLabels = [];
		let tempDate = this.state.startDate;
		let targetDate = this.state.endDate;
		let emotionData = [];
		while(tempDate < targetDate){
			xLabels.push(tempDate);
			emotionData.push(2);
			tempDate = changeDate(1,tempDate,1);
		}
	
		console.log(xLabels);
	
		this.SetGraphOptions(this.state.selectedTime, this.state.selectedGraph);

		this.setState ({
			
			graphData: {
				label: 'Emotions over Time',
				labels: timestamp,
				datasets: [{
					data: emotionData,
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
	
	//When clicking Day/Week/Month
	handleTimeClick(selectedUnit){
		//var oldStart = this.state.startDate;
		//var oldEnd = this.state.endDate;
		var current = new Date(this.state.currentDate);
		var start, end;
		end = current;
		console.log("CURRENT" + current);
		console.log(current);
		switch (selectedUnit){
			case 1: //day
				start = getDayStart(current);
				break;
			case 2: //week
				start = getDayStart((changeDate(selectedUnit,current,-1)));
				break;
			case 3: //month
				start = getMonthStart(current);
				end = getMonthEnd(current);
				break;
			default:
				console.log("Wrong selected unit in handleTimeClick");
		}
		/*
		if (selectedUnit === 1){
			start = this.state.endDate;
		} else {
			start = changeDate(selectedUnit,this.state.endDate,-1);
		}
		*/
		
		this.setState({
			selectedTime: selectedUnit,
			startDate: start
		}); //may not need to store this at all but keeping for now in hopes of fixing the buttongroups
		
		//if (selectedUnit === 3){
		this.setState({
			endDate: end
		})
		//}
		
		console.log("Handle Time Click");
		console.log("S: " + start + "    E: " + end);
		//this.GetPhotos(start, end);
		this.testDataTime(selectedUnit, start, end);
	}
	
	//When clicking Over Time/Overall
	handleTypeClick(o){
		this.setState({selectedGraph: o});
		//this.GetPhotos(this.state.startDate, this.state.endDate);
		this.testDataTime(this.state.startDate,this.state.endDate);
	}
	
	//When clicking < in date selector
	handleBackClick(){
		let selectedUnit = this.state.selectedTime;
		let current = this.state.currentDate;
		let start = this.state.startDate;
		let end = this.state.endDate;
		
		switch (selectedUnit){
			case 1: //day
				current = changeDate(1,current,-1);
				start=changeDate(1,start,-1);
				end=changeDate(1,end,-1);
				break;
			case 2: //week
				current=changeDate(2,current,-1);
				start=changeDate(2,start,-1);
				end=changeDate(2,end,-1);
				break;
			case 3: //month
				current = changeDate(3,current,-1);
				end = getMonthEnd(changeDate(1,start,-1));
				start = getMonthStart(changeDate(1,start,-1));
				break;
			default:
				console.log("Wrong SelectedUnit in back click");
		}
		
		this.setState({
			currentDate: current,
			startDate: start,
			endDate: end
		});
		
		//this.GetPhotos(start, end);
		this.testDataTime(selectedUnit, start, end);
	}
	
	//When clicking > in date selector
	handleForwardClick(){
		let selectedUnit = this.state.selectedTime;
		let current = this.state.currentDate;
		let start = this.state.startDate;
		let end = this.state.endDate;
		
		switch (selectedUnit){
			case 1: //day
				current = changeDate(1,current,1);
				start=changeDate(1,start,1);
				end=changeDate(1,end,1);
				break;
			case 2: //week
				current=changeDate(2,current,1);
				start=changeDate(2,start,1);
				end=changeDate(2,end,1);
				break;
			case 3: //month
				current=changeDate(3,current,1);
				start = getMonthStart(changeDate(1,end,1));
				end = getMonthEnd(changeDate(1,end,1));
				break;
			default:
				console.log();
		}
		
		this.setState({
			currentDate: current,
			startDate: start,
			endDate: end
		});
		
		//this.GetPhotos(start, end);
		this.testDataTime(this.state.selectedTime, start, end);
	}
	
	//When clicking a node of the graph
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
		if (this.state.indexClicked !== -1){
			j = <NodeViewer emotion={"Happy"} timestamp={Date.now()}/>;
		}
		
		//Have temporarily added a blank button above the time unit menu as wasn't working for some reason.
		//Also added paragraph as otherwise top half of buttons won't click.
		
		return (
		
		<div className='text-center'>
			<Button></Button>
			<p></p>
			{/* Time unit menu */}
			<TimeMenu onClick = {this.handleTimeClick}/>
			{/* Date menu */}
			<DateSelector startDate={this.state.startDate} endDate={this.state.endDate} timeCode={this.state.selectedTime} onBackClick={this.handleBackClick} onForwardClick={this.handleForwardClick}/>
			{/* Graph Component */}
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
		console.log(this.props.startDate);
		switch (this.props.timeCode){
			case 1: //day
				dateText = formatDate(this.props.startDate);
				break;
			case 2: //week
				dateText = (formatDate(this.props.startDate) + " - " + formatDate(changeDate(1,this.props.endDate,-1)));
				break;
			case 3: //month
			console.log();
				dateText = GetMonthText(this.props.startDate.getMonth()) + " " + this.props.startDate.getFullYear();
				break;
			default:
				console.log("Wrong timecode in DataSelector");
				break;
		}
		/*
		if (this.props.timeCode === 1){
			dateText = " " + formatDate(this.props.startDate) + " ";
		} else {
		dateText = (" " + formatDate(this.props.startDate) + " - " + formatDate(this.props.endDate) + " ");
		}
		*/
		
		return (
			<div className='date-selector-container'>
				<Button variant="primary" onClick={this.handleBackClick}>{"<"}</Button>
				{" " + dateText + " "}
				<Button variant="primary" onClick={this.handleForwardClick}>{">"}</Button>
			</div>
		);
	}
}

function GetMonthText(monthIndex){
	console.log(monthIndex);
	var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	return months[monthIndex];
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
			<div className='time-menu-container'>
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
			<div className='graph-menu-container'>
				<ButtonGroup className="graph-menu" size="sm">
					{this.renderButton("Over Time",2)}
					{this.renderButton("Overall",3)}
				</ButtonGroup>
			</div>
		);
	}
}

function changeDate(timecode, adate, modifier) {
		var d = new Date(adate);
		var temp;
		switch (timecode){
			case 0:
			/* Hour */
				return new Date(d.setHours(d.getHours() + (1 * modifier)));
			case 1:
				/* Day */
				return new Date(d.setDate(d.getDate() + (1 * modifier)));
			case 2:
				/* Week */
				return new Date(d.setDate(d.getDate() + (7 * modifier)));
			case 3:
				/* Month */
				return new Date(d.setMonth(d.getMonth() + (1 * modifier)));
				//return new Date(d.setMonth(d.getMonth() + (1 * modifier)));
			default: 
				/* wrong */
				console.log("WRONG TIMECODE");
				return d;
		}
}

function formatDate(adate) {
	var d = new Date(adate);
	return (
		('0' + d.getDate()).slice(-2) + '/' + 
		('0' + (d.getMonth() + 1)).slice(-2) + '/' + 
		d.getFullYear()
	);
}

function getDayEnd(adate){
	var d = new Date(adate);
	d.setHours(23,59,59,999);
	return new Date(d);
}

function getDayStart(adate){
	var d = new Date(adate);
	d.setHours(0,0,0,0);
	return new Date(d);
}

function getMonthStart(adate){
	var d = new Date(adate);
	d.setDate(1);
	d.setHours(0,0,0,0);
	return new Date(d);
}

function getMonthEnd(adate){
	var d = new Date(adate);
	d = changeDate(3,d,1);
	d = getMonthStart(d);
	d = changeDate(1,d,-1);
	d.setHours(0,0,0,0);
	return new Date(d);
}