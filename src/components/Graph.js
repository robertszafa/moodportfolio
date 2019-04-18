import React from 'react';
import ReactDOM from 'react-dom';
import GraphPlotter from './GraphPlotter.js';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';  //not clear why i don't need these
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import NodeViewer from './NodeViewer.js';
import ElementViewer from './ElementViewer.js';

//The graph and its menus. Also has the method for getting data for the graphs based on the selected options.
export default class Graph extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			startDate: getDayStart(Date.now()),
			endDate: getDayEnd(Date.now()),
			selectedTime: 1, //Day = 1, Week = 2, Month  = 3
			selectedGraph: 3, //Bar = 1, Line = 2, Pie = 3, Radio = 4 (can't be selected)
			graphData: {},
			indexClicked: -1
		}
		
		this.handleTimeClick = this.handleTimeClick.bind(this);
		this.handleTypeClick = this.handleTypeClick.bind(this);
		this.handleBackClick = this.handleBackClick.bind(this);
		this.handleForwardClick = this.handleForwardClick.bind(this);
		this.handleNodeClick = this.handleNodeClick.bind(this);
	}
	
	componentWillMount(){
		this.GetGraphData();
	}
	
	//Get Graph Data
	
	GetGraphData(){
		//API call here to get the data
		
		//need to do various stuff based on:
		//timeSpan
		//over time, emotion or tag 
		
		//switch over graphOption
		this.setState ({
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
		d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear()
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