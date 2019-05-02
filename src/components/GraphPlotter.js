import React from 'react';
import {Chart, Bar, Line, Pie} from 'react-chartjs-2';
import '../stylesheet/stats.css';
//{ Chart, Bar, Line, Pie }
//The Graph component. Draws pie, line and bar charts. Add radio if have time.
export default class GraphPlotter extends React.Component {
	/*
	constructor(props) {	
		super(props);

		this.state = {
			data: props.data
		};
		
	}
	*/
	
	handleClick(e){
		console.log(e);
		this.props.onClick(e);
	}
	
	renderBar(){
		//Chart.defaults.global.legend.display = false;
		return (
			<BarGraph
			value = {this.props.data}
			getIndex = {(e) => this.handleClick(e)}
			/>
		);
	}
	
	renderLine(){
		Chart.defaults.global.legend.display = false;
		Chart.defaults.global.maintainAspectRatio = false;
		return (
			<LineGraph
			options = {this.props.options}
			value = {this.props.data}
			getIndex = {(e) => this.handleClick(e)}
			/>
		);
	}
	
	renderPie(){
		Chart.defaults.global.legend.display = true;
		Chart.defaults.global.maintainAspectRatio = false;
		return (
			<PieGraph
			value = {this.props.data}
			getIndex = {(e) => this.handleClick(e)}
			/>
		);
	}
	
	renderRadar(){
		Chart.defaults.global.legend.display = true; //don't know which is best yet
		Chart.defaults.global.maintainAspectRatio = false;
		return {
			<RadarGraph
			value = {this.props.data}
			/>
		};
	}
	
	render() {
		
		var j;
		switch (this.props.type) {
			case 1:
				j = this.renderBar();
				break;
			case 2:
				j = this.renderLine();
				break;
			case 3:
				j = this.renderPie();
				break;
			case 4:
				j = this.renderRadar();
				break;
			default: 
		}
		
		return (
			<div className ='graph-container'>
				<div className='graph'>
					{j}
				</div>
			</div>
		);
		
	}
	

}

function PieGraph(props) {
	return (
			<Pie 
			data = {props.value} 
			getElementAtEvent = {(element) => props.getIndex(element)}
			/>
	);
}

function LineGraph(props) {
	return (
			<Line 
			data = {props.value}
			options = {props.options}
			getElementAtEvent = {(element) => props.getIndex(element)}
			/>
	);
}

function BarGraph(props) {
	return (
			<Bar 
			data = {props.value}
			getElementAtEvent = {(element) => props.getIndex(element)}
			/>
	);
}

function RadarGraph(props) {
	return (
		<Radar
		data = {props.value}
		/>
	);
}