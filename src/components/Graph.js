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
			selectedPhoto: -1,
			selectedTag: 'test',
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
		this.handleEnlargeClick = this.handleEnlargeClick.bind(this);
		this.handleTimeClick = this.handleTimeClick.bind(this);
		this.handleTypeClick = this.handleTypeClick.bind(this);
		this.handleBackClick = this.handleBackClick.bind(this);
		this.handleForwardClick = this.handleForwardClick.bind(this);
		this.handleNodeClick = this.handleNodeClick.bind(this);
	}

	componentWillMount(){
		if (this.props.menuOption === 3){
			this.GetPhotosBasedOnTag(this.state.startDate,this.state.endDate,this.state.selectedTag);
		} else {
			this.GetPhotos(this.state.startDate,this.state.endDate);
		}
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

	GetPhotosBasedOnTag(start, end, tag){
    let basedOn = "tag";
    let tagName = tag;
    let startDate = formatDate(start);
    let endDate = formatDate(end); // exclusive
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
            "TagName": tagName,
        },
    })
    .then((res) => res.json())
    .then(json => {
        console.log('tag ', json)
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

		let emotionCount = new Array(this.dbEmotions.length).fill(0);

		let i, j;
		//loop through the emotions and count total of each
		for (i = 0; i < emotionProbs.length; i++){
			for (j = 0; j < this.dbEmotions.length; j++){
				if (emotionProbs[i].includes(this.dbEmotions[j])){
					emotionCount[getEmotionIndex(getEmotionFromString(emotionProbs[i]))] ++;
				}
			}
		}

		//setup the data
		this.setState({
			indexLabels: this.displayEmotions,
			graphData: {
				label: 'Emotions Overall',
				labels: this.displayEmotions,
				datasets: [{
					data: emotionCount,

					backgroundColor: this.baseColours,
					hoverBackgroundColor: this.hoverColours,

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
	let stepSize, timeValue, minDate, maxDate, lastUnit, missingUnits, timeFormat, numTicks, changeDateUnit, yAxisLabel;

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
			yAxisLabel = "Hour Taken";
			break;

		case 2:
			changeDateUnit = 1;
			timeFormat = 'MMM DD';
			stepSize = 'day'
			timeValue = 1;
			minDate = startdate;
			maxDate = changeDate(changeDateUnit,enddate,-1);
			numTicks = 7;
			yAxisLabel = "Day Taken";
			break;

		case 3:
			changeDateUnit = 1;
			timeFormat = 'MMM DD';
			stepSize = 'day';
			timeValue = 3;
			minDate = startdate;
			maxDate = changeDate(1,enddate,-1); //need to check this
			yAxisLabel = "Day Taken";
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
				thedata.push(getEmotionIndex(GetModeEmotion(emotionCompare)) + 1);
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
			thedata.push(getEmotionIndex(GetModeEmotion(emotionCompare)) + 1);
			console.log(thedata);
		}

		let remainingNulls = getDateDifference(enddate, timestamp[timestamp.length-1],changeDateUnit);
		console.log("PUSHING " + remainingNulls + " remaining nulls.");
		for (i = 0; i < remainingNulls; i++){
			thedata.push(null);
		}
	}

	console.log("END OF NEW CODE");

	let yLabels = {
		0: '',
		1: this.displayEmotions[0],
		2: this.displayEmotions[1],
		3: this.displayEmotions[2],
		4: this.displayEmotions[3],
		5: this.displayEmotions[4],
		6: this.displayEmotions[5],
		7: this.displayEmotions[6],
		8: this.displayEmotions[7]
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

		    title: {
				display: false,
				text: 'Emotions over Time'
			},
		
			legend: {
				display: false,
			},

			tooltips: {
				enabled: false,
			},

			scales: {
				yAxes: [{
					interval:0,
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
					scaleLabel: {
						display: true,
						labelString: yAxisLabel,
					},
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
	
	let yAxisLabel;

	switch(timeUnit){
		case 1:
			changeDateUnit = 0;
			timeFormat = 'hA';
			stepSize = 'hour'
			timeValue = 3;
			minDate = startdate;
			maxDate = enddate;
			numTicks = 24;
			yAxisLabel = "Hour Taken";
			break;

		case 2:
			changeDateUnit = 1;
			timeFormat = 'MMM DD';
			stepSize = 'day'
			timeValue = 1;
			minDate = startdate;
			maxDate = changeDate(changeDateUnit,enddate,-1);
			numTicks = 7;
			yAxisLabel = "Day Taken";
			break;

		case 3:
			changeDateUnit = 1;
			timeFormat = 'MMM DD';
			stepSize = 'day';
			timeValue = 3;
			minDate = startdate;
			maxDate = changeDate(1,enddate,-1); //need to check this
			yAxisLabel = "Day Taken";
			break;
			default:
			console.log("broke" + timeUnit);
	}

	//create the datetime labels
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
		
		//need to get emotion specific data
		let emotionData = getEmotionData(emotionProbs,timestamp,emote);
		console.log("DATA");
		console.log(emotionData);
		tempdata = [];
		while (i < emotionData.timestamp.length){
			//check if part of the current time
			if (getUnitQuantity(emotionData.timestamp[i],changeDateUnit) === lastUnit){
				console.log("PUSHING" + emotionData.emotion[i] + " TO COMPARISON.");
				emotionCompare.push(emotionData.emotion[i]);
			} else {
				//if new time
				missingUnits = getUnitQuantity(emotionData.timestamp[i],changeDateUnit) - lastUnit - 1;
				console.log(missingUnits + " missing units found. " + emotionData.timestamp[i] + "	" + changeDateUnit);
				if (missingUnits > 1 || (missingUnits > -1 && i === 0)){
					if (i === 0) {missingUnits++;}
					console.log("ADDING NULLS * " + missingUnits + "from: " + emotionData.timestamp[i]);
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
				emotionCompare.push(emotionData.emotion[i]);
				//set the current time being looked at
				lastUnit = getUnitQuantity(emotionData.timestamp[i],changeDateUnit);
			}
			i++;
		}

		if (emotionData.timestamp.length > 0){

			//if leftover data in emotionCompare then push
			if (emotionCompare.length > 0){
				console.log("PUSHING DATA TO thedata");
				tempdata.push(emotionCompare.length);
				emotionCompare = [];
			}
			
			let remainingNulls = getDateDifference(enddate, timestamp[timestamp.length-1],changeDateUnit);

			for (i = 0; i < remainingNulls; i++){
				tempdata.push(null);
			}
		}

		thedata.push(tempdata);
	}

	let yLabels = {
		0: '',
		1: this.displayEmotions[0],
		2: this.displayEmotions[1],
		3: this.displayEmotions[2],
		4: this.displayEmotions[3],
		5: this.displayEmotions[4],
		6: this.displayEmotions[5],
		7: this.displayEmotions[6],
		8: this.displayEmotions[7]
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
			
			{
				label: yLabels[3],
				data: thedata[2],
				borderColor: this.baseColours[2],
				backgroundColor: this.baseColours[2],
				hoverBackgroundColor: this.hoverColours[2],
				fill: false,
				spanGaps: true,
			},

			{
				label: yLabels[4],
				data: thedata[3],
				borderColor: this.baseColours[3],
				backgroundColor: this.baseColours[3],
				hoverBackgroundColor: this.hoverColours[3],
				fill: false,
				spanGaps: true,
			},

			{
				label: yLabels[5],
				data: thedata[4],
				borderColor: this.baseColours[4],
				backgroundColor: this.baseColours[4],
				hoverBackgroundColor: this.hoverColours[4],
				fill: false,
				spanGaps: true,
			},

			{
				label: yLabels[6],
				data: thedata[5],
				borderColor: this.baseColours[5],
				backgroundColor: this.baseColours[5],
				hoverBackgroundColor: this.hoverColours[5],
				fill: false,
				spanGaps: true,
			},

			{
				label: yLabels[7],
				data: thedata[6],
				borderColor: this.baseColours[6],
				backgroundColor: this.baseColours[6],
				hoverBackgroundColor: this.hoverColours[6],
				fill: false,
				spanGaps: true,
			},

			{
				label: yLabels[8],
				data: thedata[7],
				borderColor: this.baseColours[7],
				backgroundColor: this.baseColours[7],
				hoverBackgroundColor: this.hoverColours[7],
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
					scaleLabel: {
						display: true,
						labelString: 'Quantity'
					},
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
					scaleLabel: {
						display: true,
						labelString: yAxisLabel,
					},
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

		if (this.props.menuOption === 3){
			this.GetPhotosBasedOnTag(start,end,this.selectedTag);
		} else {
			this.GetPhotos(start,end);
		}

	}

	//When clicking Over Time/Overall
	handleTypeClick(o){
		this.setState({selectedGraph: o});
		if (this.props.menuOption === 3){
			this.GetPhotosBasedOnTag(this.state.startDate,this.state.endDate,this.state.selectedTag);
		} else {
			this.GetPhotos(this.state.startDate,this.state.endDate);
		}
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

		if (this.props.menuOption === 3){
			this.GetPhotosBasedOnTag(start,end,this.state.selectedTag);
		} else {
			this.GetPhotos(start,end);
		}
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

		if (this.props.menuOption === 3){
			this.GetPhotosBasedOnTag(start,end,this.state.selectedTag);
		} else {
			this.GetPhotos(start,end);
		}
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
	
	//Handles clicks on enlarge button of CarouselCard from NodeViewer.js
	handleEnlargeClick(index){
		console.log("FIRED." + index);
		this.setState({selectedPhoto: index});
	}
	
	unmountPhoto(){
		
	}
	
	render () {
		//do different stuff based on if data is ready or not

		let nodeView;
		if (this.state.indexClicked !== -1){
			//nodeView = <NodeViewer emotion={"Happy"} timestamp={Date.now()}/>;
			nodeView = <NodeViewer handleEnlargeClick={this.handleEnlargeClick} nodeClicked={this.state.indexClicked} indexLabels={this.state.datetimeLabels} data={this.state.photos} graphType={this.state.selectedGraph} selectedTime={this.state.selectedTime} startDate={this.state.startDate} endDate={this.state.endDate} emotions={this.displayEmotions}/>
		}

		//Have temporarily added a blank button above the time unit menu as wasn't working for some reason.
		//Also added paragraph as otherwise top half of buttons won't click.
		console.log("Selected: " + this.state.selectedPhoto);
		console.log(this.state.photos);
		if (this.state.selectedPhoto !== -1){
			return (<Photo
			key={this.state.photos[this.state.selectedPhoto].props.photoId}
			photoId={this.state.photos[this.state.selectedPhoto].props.photoID}
			timestamp={this.state.photos[this.state.selectedPhoto].props.timestamp}
			city={this.state.photos[this.state.selectedPhoto].props.city}
			description={this.state.photos[this.state.selectedPhoto].props.description}
			emotion={this.state.photos[this.state.selectedPhoto].props.emotion}
			dominantEmotion={this.state.photos[this.state.selectedPhoto].props.dominantEmotion}
			unmountPhoto={this.unmountPhoto}
			/>);
		} else {
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

export function getEmotionIndex(emo){
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

function getEmotionData(emotionProbs,timestamp,emotionIndex){
	let emotionData = [];
	let timeData = [];
	let i;
	//loop through all of the data
	for (i = 0; i < emotionProbs.length; i++){
		if (getEmotionIndex(getEmotionFromString(emotionProbs[i])) === emotionIndex){
			emotionData.push(emotionProbs[i]);
			timeData.push(timestamp[i]);
		}
	}
	//return obj composed of emotions and timestamps
	var result = {
		emotion: emotionData,
		timestamp: timeData,
	}
	
	return result;
}

export function getDateDifference(date1, date2, timeUnit){
	let ms;
	
	switch(timeUnit) {
		case 0: //hours
		console.log("DD HOURS");
			ms = 1000 * 60 * 60;
			break;
		case 1: //days
		console.log("DD DAYS");
			ms = 1000 * 60 * 60 * 24;
			break;
		default:
			console.log("getDateDifference failed.");
			return -1;
	}
	
	let diff = Math.abs(new Date(date1).getTime() - new Date(date2).getTime());
	return Math.floor(diff / ms);
}
