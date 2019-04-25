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
		}
		
		return (
			<div className ='text-center'>
				{j}
			</div>
		);
		
	}
	

}

function PieGraph(props) {
	return (
		<div className='graph'>
			<Pie 
			data = {props.value} 
			getElementAtEvent = {(element) => props.getIndex(element)}
			/>
		</div>
	);
}

function LineGraph(props) {
	return (
		<div className='graph'>
			<Line 
			data = {props.value}
			options = {props.options}
			getElementAtEvent = {(element) => props.getIndex(element)}
			/>
		</div>
	);
}

function BarGraph(props) {
	return (
		<div className='graph'>
			<Bar 
			data = {props.value}
			getElementAtEvent = {(element) => props.getIndex(element)}
			/>
		</div>
	);
}