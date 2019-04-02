import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';

import { Bar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';

class Stats extends React.Component {
	
	render() {
		return (
			<Graph />
		);
	}
		
}

//The Graph component. Draws pie, line and bar charts.
class Graph extends React.Component {
	constructor(props) {
		super(props);
		//hold graph data here, pass to graph
		this.state = {
			data: {
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
			},
		indexClicked: null
		};
	}

	handleClick(e){
		this.setState({indexClicked: e});
		console.log(e);
	}
	
	renderBar(){
		return (
			<BarGraph
			value = {this.state.data}
			/>
		);
	}
	
	renderLine(){
		return (
			<LineGraph
			value = {this.state.data}
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
			getElementAtEvent = {element => console.log(element)} // (element) => props.getIndex //Extract index from element and pass back up. So need to pass function to here.
			/>
		</div>
	);
}

function LineGraph(props) {
	return (
		<div>
			<h2>Line Example</h2>
			<Line data = {props.value} />
		</div>
	);
}

function BarGraph(props) {
	return (
		<div>
			<h2>Bar Example</h2>
			<Bar data = {props.value} />
		</div>
	);
}

ReactDOM.render(
  <Stats />,
  document.getElementById('root')
);
