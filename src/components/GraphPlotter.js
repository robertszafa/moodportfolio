import React from 'react';
import { Chart, Bar, Line, Pie } from 'react-chartjs-2';

//The Graph component. Draws pie, line and bar charts. Add radio if have time.
export default class GraphPlotter extends React.Component {
	constructor(props) {	
		super(props);

		this.state = {
			data: props.data
		};
		
	}
	
	handleClick(e){
		this.props.onClick(e);
	}
	
	renderBar(){
		//Chart.defaults.global.legend.display = false;
		return (
			<BarGraph
			value = {this.state.data}
			getIndex = {(e) => this.handleClick(e)}
			/>
		);
	}
	
	renderLine(){
		Chart.defaults.global.legend.display = false;
		return (
			<LineGraph
			options = {this.props.options}
			value = {this.state.data}
			getIndex = {(e) => this.handleClick(e)}
			/>
		);
	}
	
	renderPie(){
		Chart.defaults.global.legend.display = true;
		return (
			<PieGraph
			value = {this.state.data}
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
		<div>
			<Pie 
			data = {props.value} 
			getElementAtEvent = {(element) => props.getIndex(element)}
			/>
		</div>
	);
}

function LineGraph(props) {
	return (
		<div>
			<Line 
			data = {props.value}
			getElementAtEvent = {(element) => props.getIndex(element)}
			/>
		</div>
	);
}

function BarGraph(props) {
	return (
		<div>
			<Bar 
			data = {props.value}
			getElementAtEvent = {(element) => props.getIndex(element)}
			/>
		</div>
	);
}