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
			selectedTime: 3, //Day = 1, Week = 2, Month  = 3
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
	
	// Gets Photos from server and then stuff
	// Uses startDate, endDate
	GetPhotos(start, end){
		console.log("DATES");
		console.log(start + "\n" + end);
		let authToken = localStorage.getItem("authToken");
		let basedOn = "all";
		let formattedStart = formatDate(start);
		let formattedEnd = formatDate(end);
		console.log(formattedStart);
		console.log(formattedEnd);
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
											"startDate": formattedStart,
											"endDate": formattedEnd,
							})
			})
			.then((res) => res.json())
			.then(json => {
				const result = json.result;
				result.forEach(jsonData => {
					this.state.photos.push(new Photo(jsonData));
				});
				/*
				console.log("PHOTOS");
				console.log(this.state.photos);
				*/
				this.SetGraphData(this.state.selectedGraph,start,end);
				//console.log(this.state.photos[0].props.timestamp);
			})
			.catch(err => console.log(err))
	}

	SetGraphData(graphCode,start,end){
		
		//if chart is line then need to average out the data, otherwise don't.
		//extract data from photos
		
		/*
		console.log("PIE CHART");
		console.log(start + "\n" + end);
		*/
		let emotionProb = [];
		let timestamp = [];
		let i;
		for (i = 0; i < this.state.photos.length; i++){
			emotionProb.push(JSON.stringify(this.state.photos[i].state.dominantEmotion));
			timestamp.push(new Date(this.state.photos[i].props.timestamp)); //added new Date here to get datatype right
		}
		//var emotionsString = emotionProb.toString();
		//turn photo info into graphData

		//if graph is over time
		if (graphCode === 2){
			this.SetGraphData_OverTime(emotionProb,timestamp,start,end);
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
					emotionCount[j] ++;
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
	
	SetGraphData_OverTime(emotionProbs,timestamp,startdate,enddate){
		
		console.log("TIMESTAMPS");
		console.log(timestamp);
		
		let datetimeLabels = [];
		datetimeLabels.length = 0;
		let timeFormat = 'MM DDD';
		let i = 0, j = 0;
		//make label array and display format based on timeCode
		let d = startdate; //startdate?
		let thedata = [];
		thedata.length = 0;
		let stepSize, timeValue, minDate, maxDate, lastHour, lastDay, missingHours, missingDays;
		
		let emotionCompare = [];
		
		//break into separate days
		console.log("TEST");
		console.log(timestamp[1]);
		console.log(timestamp[1].getHours());
		//this.setGraphOptions(this.state.selectedTime,this.state.selectedGraph); //ideally should be passed to this function
		
		switch (this.state.selectedTime){
			case 1: //day
				timeFormat = 'hA';
				stepSize = 'hour'
				timeValue = 3;
				minDate = startdate;
				maxDate = enddate;
				for (i = 0; i < 24; i++){
					datetimeLabels.push(d);
					d = changeDate(0,d,1);
				}
				
				i = 0;
				lastHour = 0;
				missingHours = 0;
				
				while (i < timestamp.length) {
					//check if part of the current hour
					if (timestamp[i].getHours() === lastHour){
						emotionCompare.push(emotionProbs[i]);
					} else {
						//if new hour
						missingHours = timestamp[i].getHours() - lastHour;
						if (missingHours > 0){
							for (j = 0; j < missingHours; j++){
								thedata.push(null);
							}
						}
						//find most prominent emotion
						//get its number and push it
						if (emotionCompare.length > 0){
							thedata.push(getEmotionIndex(getModeEmotion(emotionCompare)));
						}
						//clear emotionCompare
						emotionCompare = [];
						//add the current element to emotionCompare
						emotionCompare.push(emotionProbs[i]);
						//set the current hour being looked at
						lastHour = timestamp[i].getHours();
					}
					i++;
				}
				
				//if last hour did not fill rest might need to populate data with nulls
				
				break;
			case 2: //week
				timeFormat = 'MMM DD';
				stepSize = 'day'
				timeValue = 1;
				minDate = startdate;
				maxDate = changeDate(1,enddate,-1);
				console.log("MAXDATE: " + maxDate);
				for (i = 0; i < 7; i++){
					datetimeLabels.push(d);
					d = changeDate(1,d,1);
				}
				
				console.log("WEEK");
				console.log("First timestamp: " + startdate.getDate());
				
				i = 0;
				lastDay = startdate.getDate();
				missingDays = 0;
				while (i < timestamp.length){
					if (timestamp[i].getDate() === lastDay){
						console.log("A1");
						emotionCompare.push(emotionProbs[i]);
					} else {
						console.log("A2");
						//if new day
						missingDays = timestamp[i].getDate() - lastDay;
						console.log("MISSING DAYS: " + missingDays + "," + i);
						if (missingDays > 0){
							for (j = 0; j < missingDays; j++){
								thedata.push(null); //might have to be 'null'?
							}
						}
						
						//find most prominent emotion, get it's index
						if (emotionCompare.length > 0){
							console.log("TRIES TO PUSH");
							thedata.push(getEmotionIndex(getModeEmotion(emotionCompare)));
						}
						//clear emotionCompare
						emotionCompare = [];
						emotionCompare.push(emotionProbs[i]);
						//set the current hour being looked at
						lastDay = timestamp[i].getDate();
						
					}
					i++;
				}
				
				if (emotionCompare.length > 0){
					console.log("TRIES TO PUSH");
					thedata.push(getEmotionIndex(getModeEmotion(emotionCompare)));
				}
				
				console.log("thedata");
				console.log(thedata);
				
				//if last day did not fill rest might need to populate data with nulls
				
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
				}
				
				i = 0;
				lastDay = 0;
				missingDays = 0;
				while (i < timestamp.length){
					if (timestamp[i].getDate() === lastDay){
						emotionCompare.push(emotionProbs[i]);
					} else {
						//if new day
						//push nulls for any missing days
						missingDays = timestamp[i].getDate() - lastDay;
						if (missingDays > 0){
							for (j = 0; j < missingDays; j++){
								thedata.push(null); //might have to be 'null'?
							}
						}
						
						//add the current element to emotionCompare
						emotionCompare.push(emotionProbs[i]);
						
						//find most prominent emotion, get it's index
						if (emotionCompare.length > 0){
							thedata.push(getEmotionIndex(getModeEmotion(emotionCompare)));
						}
						

		
						//clear emotionCompare
						emotionCompare = [];

						//set the current hour being looked at
						lastDay = timestamp[i].getDate();
						console.log("LAST " + lastDay);
						
					}
					i++;
				}
				
				//if last day did not fill rest might need to populate data with nulls
				//eg if day was 25, need to add nulls for 26-monthend
				
				break;
			default:
				console.log("Incorrect tiemcode in testDataTime");	
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
		/*
		console.log("LINE CHART");
		console.log("Date Time Labels");
		console.log(datetimeLabels);
		*/
		console.log("THE DATA ");
		console.log(thedata);
		this.setState({
			
			graphData: {
				label: 'Emotions Over Time',
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
				
				tooltips: {
					enabled: false
				},
				
				scales: {
					yAxes: [{
						title: "Emotion",
						ticks: {
							beginAtZero: true,
							callback: function(value,index,values) {
								return yLabels[value];
							},
						max: 8,
						min: 0,
						unitStepSize: 1,
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
					}]
				}
			}
		});
	}
	
	//Button handling functions
	
	//When clicking Day/Week/Month
	handleTimeClick(selectedUnit){
		/*
		console.log("TIME CHGANED");
		*/
		//var oldStart = this.state.startDate;
		var current = new Date(this.state.currentDate);
		//var oldEnd = this.state.endDate;
		var start, end;
		end = current;
		/*
		console.log("CURRENT" + current);
		console.log(current);
		*/
		switch (selectedUnit){
			case 1: //day
				start = getDayStart(current);
				end = getDayStart(changeDate(1,current,1));
				break;
			case 2: //week
				start = getDayStart(changeDate(1,(changeDate(selectedUnit,current,-1)),1));
				end = getDayEnd(current);
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
		/*
		console.log("Handle Time Click");
		console.log("S: " + start + "    E: " + end);
		*/
		this.GetPhotos(start, end);
		//this.testDataTime(selectedUnit, start, end);
	}
	
	//When clicking Over Time/Overall
	handleTypeClick(o){
		this.setState({selectedGraph: o});
		this.GetPhotos(this.state.startDate, this.state.endDate);
		//this.testDataTime(this.state.startDate,this.state.endDate);
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
				end = getMonthEnd(changeDate(3,start,-1));
				start = getMonthStart(changeDate(3,start,-1));
				break;
			default:
				console.log("Wrong SelectedUnit in back click");
		}
		
		this.setState({
			currentDate: current,
			startDate: start,
			endDate: end
		});

		this.GetPhotos(start, end);
		//this.testDataTime(selectedUnit, start, end);
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
		console.log("FORWARD");
		console.log(start + "/n" + end);
		
		
		this.GetPhotos(start, end);
		//this.testDataTime(this.state.selectedTime, start, end);
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
			j = <NodeViewer nodeClicked={this.state.indexClicked} xLabels={this.state.datetimeLabels} data={this.state.photos}/> 
		}
		
		//Have temporarily added a blank button above the time unit menu as wasn't working for some reason.
		//Also added paragraph as otherwise top half of buttons won't click.
		
		return (
		
		<div className='text-center'>
			<br/><br/>
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
	/*
	d.setHours(23,59,59,999);
	*/
	d = changeDate(1,adate,1);
	d = getDayStart(d);
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
	//d = changeDate(1,d,-1);
	d.setHours(0,0,0,0);
	return new Date(d);
}

function getModeEmotion(emotionArray){
	console.log("ARRRRRRR");
	console.log(emotionArray);
	let dbEmotions = ['anger','contempt','disgust','fear','happiness','neutral','sadness','surprise'];
	let emotionCount = new Array(dbEmotions.length).fill(0);
	let i = 0, j = 0;
	
	for (i = 0; i < emotionArray.length; i++){
		for (j = 0; j < dbEmotions.length; j++){
			if (emotionArray[i].includes(dbEmotions[j])){
				emotionCount[j] ++;
			}
		}
	}
	
	//find the max
	let max = emotionCount[0];
	let maxID = 0;
	for (i = 1; i < emotionCount.length; i++){
		if (emotionCount[i] > max){
			max = emotionCount[i];
			maxID = i;
		}
	}
	
	console.log(maxID);
	console.log("EMOTION: " + dbEmotions[maxID]);
	return dbEmotions[maxID];
}

function getEmotionIndex(emo){
	let displayOrder = ['fear','anger','contempt','disgust','sadness','neutral','surprise','happiness'];
	let i = 0;
	console.log("Emotion:" + emo);
	for (i = 0; i < displayOrder.length; i++){
		if (displayOrder[i] === emo){
			return i;
		}
	}
	
	console.log("getEmotionIndex error: emotion not found");
	return -1;
}