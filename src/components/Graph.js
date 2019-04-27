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
			startDate: getMonthStart(Date.now()),
			endDate: getMonthEnd(Date.now()),
			currentDate: Date.now(),
			selectedTime: 3, //Day = 1, Week = 2, Month  = 3
			selectedGraph: 2, //Bar = 1, Line = 2, Pie = 3, Radio = 4 (can't be selected). Have left bar in for now.
			graphData: {},
			graphOptions: {},
			indexClicked: -1,
			photos: [],
			indexLabels: []
		}

		//this.photos = new Array(); //other way to set up the photos array if not meant to be state.

		this.baseColours = ['#11ff00','#ff0011','#ee00ff','#80027a','#1003ff','#06ffb4','#ff7206','#fff700'];
		this.hoverColours = ['#043d7e','#beafa9','#4fc690','#667559','#d29e81','#46bbe9','#13744c','#9125d5'];
		this.displayEmotions = ['fear','anger','contempt','disgust','sadness','neutral','surprise','happiness'];
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
		let authToken = localStorage.getItem("authToken");
		let basedOn = "all";
		let formattedStart = formatDate(start);
		let formattedEnd = formatDate(end);
		console.log(formattedStart + " - " + formattedEnd);
		//let strt = formatDate(this.state.startDate);
		//let end = formatDate(this.state.endDate);

		//EMPTY THE Photos
		this.setState({
			photos: []
		});

		fetch(apiMoodportfolio + '/EmotionsQuery', {
					method: "GET",
					mode: "cors",
					cache: "no-cache",
					withCredentials: true,
					credentials: "same-origin",
					headers: {
							"Authorization": authToken,
							"Content-Type": "application/json",
							"BasedOn": basedOn,
							"StartDate": formattedStart,
							"EndDate": formattedEnd,
							"Limit": '',
					},
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
		let p = this.state.photos;
		let emotionProb = [];
		let timestamp = [];
		let i;
		for (i = 0; i < this.state.photos.length; i++){
			emotionProb.push(JSON.stringify(p[i].state.dominantEmotion));
			timestamp.push(convertStringToDate(p[i].props.timestamp));
		}
		console.log("TS");
		console.log(timestamp);
		//var emotionsString = emotionProb.toString();
		//turn photo info into graphData

		//if graph is over time
		if (graphCode === 2){
			if (this.props.menuOption === 1){
				this.SetGraphData_OverTime(emotionProb,timestamp,start,end);
			} else {
				this.setGraphData_Emotions(emotionProb,timestamp,start,end);
			}
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
					emotionCount[GetEmotionIndex(getEmotionFromString(emotionProbs[i]))] ++;
				}
			}
		}

		this.setState({
			indexLabels: this.displayEmotions,
			graphData: {
				label: 'Emotions Overall',
				labels: this.displayEmotions,
				datasets: [{
					data: emotionCount,

					backgroundColor: [
						'#28b501',
						'#ff0011',
						'#ee00ff',
						'#80027a',
						'#1003ff',
						'#06ffb4',
						'#ff7206',
						'#fff700'
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

	let timeUnit = this.state.selectedTime;
	let datetimeLabels = [];
	datetimeLabels.length = 0;
	let i = 0, j = 0;
	let d = startdate;
	let thedata = [];
	thedata.length = 0;
	let stepSize, timeValue, minDate, maxDate, lastUnit, missingUnits, timeFormat, numTicks, changeDateUnit;

	let emotionCompare = [];

	switch(timeUnit){
		case 1:
			changeDateUnit = 0;
			timeFormat = 'hA';
			stepSize = 'hour'
			timeValue = 3;
			minDate = startdate;
			maxDate = enddate;
			numTicks = 24;
			break;

		case 2:
			changeDateUnit = 1;
			timeFormat = 'MMM DD';
			stepSize = 'day'
			timeValue = 1;
			minDate = startdate;
			maxDate = changeDate(changeDateUnit,enddate,-1);
			numTicks = 7;
			break;

		case 3:
			changeDateUnit = 1;
			timeFormat = 'MMM DD';
			stepSize = 'day';
			timeValue = 3;
			minDate = startdate;
			maxDate = changeDate(1,enddate,-1); //need to check this
			break;
			default:
			console.log("broke" + timeUnit);
	}

	if (timeUnit === 3){
		while (d < enddate){
			datetimeLabels.push(d);
			d = changeDate(1,d,1);
		}
	} else {
		for (i = 0; i < numTicks; i++){
			datetimeLabels.push(d);
			d = changeDate(changeDateUnit,d,1);
		}
	}

	i = 0;
	lastUnit = getUnitQuantity(startdate,changeDateUnit);
	missingUnits = 0;

	while (i < timestamp.length){
		//check if part of the current time
		if (getUnitQuantity(timestamp[i],changeDateUnit) === lastUnit){
			console.log("PUSHING" + emotionProbs[i] + " TO COMPARISON.");
			emotionCompare.push(emotionProbs[i]);
		} else {
			//if new time
			missingUnits = getUnitQuantity(timestamp[i],changeDateUnit) - lastUnit - 1;
			if (missingUnits > 1 || (missingUnits > -1 && i === 0)){
				if (i === 0) {missingUnits++;}
				console.log("ADDING NULLS * " + missingUnits + "from: " + timestamp[i]);
				for (j = 0; j < missingUnits; j++){
					thedata.push(null);
				}
			}
			//find most prominent emotion, get its number, push it
			if (emotionCompare.length > 0){
				console.log("PUSHING PROMINENT EMOTION");
				thedata.push(GetEmotionIndex(GetModeEmotion(emotionCompare)) + 1);
			}
			//clear emotionCompare
			emotionCompare = [];
			//add the current element to emotionCompare
			console.log("PUSHING CURRENT ELEMENT TO COMPARISON");
			emotionCompare.push(emotionProbs[i]);
			//set the current time being looked at
			lastUnit = getUnitQuantity(timestamp[i],changeDateUnit);
		}
		i++;
	}

	if (timestamp.length > 0){

		//if leftover data in emotionCompare then push
		if (emotionCompare.length > 0){
			console.log("PUSHING DATA TO thedata");
			thedata.push(GetEmotionIndex(GetModeEmotion(emotionCompare)) + 1);
			console.log(thedata);
		}

		//add remaining nulls
		let maxUnit = getUnitQuantity(enddate,changeDateUnit);
		if (maxUnit === 0){
			maxUnit = 23;
		}

		let remainingNulls = maxUnit - getUnitQuantity(timestamp[timestamp.length - 1],changeDateUnit);
		console.log("PUSHING " + remainingNulls + " remaining nulls.");
		for (i = 0; i < remainingNulls; i++){
			thedata.push(null);
		}
	}

	console.log("END OF NEW CODE");

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
	console.log(datetimeLabels);
	this.setState({
		indexLabels: datetimeLabels,

		graphData: {
			label: 'Emotions Over Time',
			labels: datetimeLabels,
			datasets: [{
				label: "Emotions",
				data: thedata,
				borderColor: '#e24b5a',
				backgroundColor: this.baseColours,
				hoverBackgroundColor: this.hoverColours,
				fill: false,
				spanGaps: true //dunno whether to use this.
			}]
		},

		graphOptions: {

			legend: {
				display: false,
			},

			tooltips: {
				enabled: false,
			},

			scales: {
				yAxes: [{
					interval:0,
					title: "Emotion",
					ticks: {
						beginAtZero: true,
						callback: function(value,index,values) {
							return yLabels[value];
						},
					max: 8,
					min: 0,
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

setGraphData_Emotions(emotionProbs,timestamp,startdate,enddate){

	let timeUnit = this.state.selectedTime;
	let datetimeLabels = [];
	datetimeLabels.length = 0;
	let i = 0, j = 0;
	let d = startdate;
	let thedata = [];
	thedata.length = 0;
	let tempdata = [];
	let stepSize, timeValue, minDate, maxDate, lastUnit, missingUnits, timeFormat, numTicks, changeDateUnit;

	let emotionCompare = [];

	switch(timeUnit){
		case 1:
			changeDateUnit = 0;
			timeFormat = 'hA';
			stepSize = 'hour'
			timeValue = 3;
			minDate = startdate;
			maxDate = enddate;
			numTicks = 24;
			break;

		case 2:
			changeDateUnit = 1;
			timeFormat = 'MMM DD';
			stepSize = 'day'
			timeValue = 1;
			minDate = startdate;
			maxDate = changeDate(changeDateUnit,enddate,-1);
			numTicks = 7;
			break;

		case 3:
			changeDateUnit = 1;
			timeFormat = 'MMM DD';
			stepSize = 'day';
			timeValue = 3;
			minDate = startdate;
			maxDate = changeDate(1,enddate,-1); //need to check this
			break;
			default:
			console.log("broke" + timeUnit);
	}

	if (timeUnit === 3){
		while (d < enddate){
			datetimeLabels.push(d);
			d = changeDate(1,d,1);
		}
	} else {
		for (i = 0; i < numTicks; i++){
			datetimeLabels.push(d);
			d = changeDate(changeDateUnit,d,1);
		}
	}


	let emote;
	for (emote = 0; emote < this.displayEmotions.length; emote++){
		i = 0;
		lastUnit = getUnitQuantity(startdate,changeDateUnit);
		missingUnits = 0;
		tempdata = [];
		while (i < timestamp.length){
			//check if part of the current time
			if (getUnitQuantity(timestamp[i],changeDateUnit) === lastUnit){
				console.log("PUSHING" + emotionProbs[i] + " TO COMPARISON.");
				emotionCompare.push(emotionProbs[i]);
			} else {
				//if new time
				missingUnits = getUnitQuantity(timestamp[i],changeDateUnit) - lastUnit - 1;
				console.log(missingUnits + " missing units found. " + timestamp[i] + "	" + changeDateUnit);
				if (missingUnits > 1 || (missingUnits > -1 && i === 0)){
					if (i === 0) {missingUnits++;}
					console.log("ADDING NULLS * " + missingUnits + "from: " + timestamp[i]);
					for (j = 0; j < missingUnits; j++){
						tempdata.push(null);
					}
				}
				//push count of emotion
				if (emotionCompare.length > 0){
					console.log("PUSHING PROMINENT EMOTION");
					tempdata.push(emotionCompare.length);
				}
				//clear emotionCompare
				emotionCompare = [];
				//add the current element to emotionCompare
				console.log("PUSHING CURRENT ELEMENT TO COMPARISON");
				emotionCompare.push(emotionProbs[i]);
				//set the current time being looked at
				lastUnit = getUnitQuantity(timestamp[i],changeDateUnit);
			}
			i++;
		}

		if (timestamp.length > 0){

			//if leftover data in emotionCompare then push
			if (emotionCompare.length > 0){
				console.log("PUSHING DATA TO thedata");
				tempdata.push(emotionCompare.length);
			}

			//add remaining nulls
			let maxUnit = getUnitQuantity(enddate,changeDateUnit);
			if (maxUnit === 0){
				maxUnit = 23;
			} else if (maxUnit === 1){
				maxUnit = getUnitQuantity(changeDate(1,enddate,-1),changeDateUnit);
			}

			let remainingNulls = maxUnit - getUnitQuantity(timestamp[timestamp.length - 1],changeDateUnit);
			console.log("PUSHING " + remainingNulls + " remaining nulls. " + maxUnit + " - " + timestamp[timestamp.length-1]);
			for (i = 0; i < remainingNulls; i++){
				tempdata.push(null);
			}
		}

		thedata.push(tempdata);
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
	console.log(datetimeLabels);
	this.setState({
		indexLabels: datetimeLabels,

		graphData: {
			label: 'Emotions Over Time',
			labels: datetimeLabels,
			datasets: [{
				label: yLabels[1],
				data: thedata[0],
				borderColor: this.baseColours[0],
				backgroundColor: this.baseColours[0],
				hoverBackgroundColor: this.hoverColours[0],
				fill: false,
				spanGaps: true,
			},

			{
				label: yLabels[2],
				data: thedata[1],
				borderColor: this.baseColours[1],
				backgroundColor: this.baseColours[1],
				hoverBackgroundColor: this.hoverColours[1],
				fill: false,
				spanGaps: true,
			},



			]
		},

		graphOptions: {

			legend: {
				display: true,
			},

			tooltips: {
				enabled: false,
			},

			scales: {
				yAxes: [{
					interval:0,
					unitStepSize: 1,
					title: "Emotion",
					ticks: {
						beginAtZero: true,
					},
					min: 0,
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
		var current = new Date(this.state.currentDate);
		var start, end;
		end = current;

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

		this.setState({
			selectedTime: selectedUnit,
			startDate: start
		}); //may not need to store this at all but keeping for now in hopes of fixing the buttongroups

		this.setState({
			endDate: end
		})

		this.GetPhotos(start, end);

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
		//console.log(index);
		//set the index clicked
		this.setState({indexClicked: index});
	}

	render () {
		//do different stuff based on if data is ready or not

		let nodeView;
		if (this.state.indexClicked !== -1){
			//nodeView = <NodeViewer emotion={"Happy"} timestamp={Date.now()}/>;
			nodeView = <NodeViewer nodeClicked={this.state.indexClicked} indexLabels={this.state.datetimeLabels} data={this.state.photos} graphType={this.state.selectedGraph} timeUnit={this.state.selectedTime} startDate={this.state.startDate} endDate={this.state.endDate} emotions={this.displayEmotions}/>
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
			{nodeView}
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
				dateText = GetMonthText(this.props.startDate.getMonth()) + " " + this.props.startDate.getFullYear();
				break;
			default:
				console.log("Wrong timecode in DataSelector");
				break;
		}

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

export function changeDate(timecode, adate, modifier) {
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

export function getEmotionFromString(str){
	return str.split("\"")[1];
}

function GetModeEmotion(emotionArray){
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
	return dbEmotions[maxID];
}

export function GetEmotionIndex(emo){
	let displayOrder = ['fear','anger','contempt','disgust','sadness','neutral','surprise','happiness'];
	let i = 0;
	for (i = 0; i < displayOrder.length; i++){
		if (displayOrder[i] === emo){
			return i;
		}
	}

	return -1;
}

export function convertStringToDate(str){
	let d = new Date(str);
	// add time zone offset
	//d.setTime( d.getTime() + d.getTimezoneOffset()*60*1000 )
    return d;
}

export function getUnitQuantity(adate,dateUnit){
	switch (dateUnit){
		case 0:
			return adate.getHours();
		case 1:
			return adate.getDate();
		case 2:
			return adate.getMonth();
		case 3:
			return adate.getMonth(); //purposefully the same incase I forget.
		default:
			console.log("getUnitQuantity failed.");
			return -1;
	}
}
