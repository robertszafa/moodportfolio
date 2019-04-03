import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';

//The Graph component. Draws pie, line and bar charts.
class Graph extends React.Component {
	constructor(props) {	
		super(props);

		this.state = {
			type: props.type,
			data: props.data,
			indexClicked: -1
		};
		
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e){
		//console.log(this.state.indexClicked); //for testing
		var index = -1;
		
		//if event fires but nothing selected
		if (e.length !== 0){
			index = e[0]._index;
		}
		//set the index clicked
		this.setState({indexClicked: index});
	}
	
	renderBar(){
		return (
			<BarGraph
			value = {this.state.data}
			getIndex = {(e) => this.handleClick(e)}
			/>
		);
	}
	
	renderLine(){
		return (
			<LineGraph
			value = {this.state.data}
			getIndex = {(e) => this.handleClick(e)}
			/>
		);
	}
	
	renderPie(){
		return (
			<PieGraph
			value = {this.state.data}
			getIndex = {(e) => this.handleClick(e)}
			/>
		);
	}
	
	render() {
		return (
			<div>
				{this.renderPie()}
			</div>
		);
	}
	

}

function PieGraph(props) {
	return (
		<div>
			<h2>Pie Example</h2>
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
			<h2>Line Example</h2>
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
			<h2>Bar Example</h2>
			<Bar 
			data = {props.value}
			getElementAtEvent = {(element) => props.getIndex(element)}
			/>
		</div>
	);
}