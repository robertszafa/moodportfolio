import React from 'react';
import ReactDOM from 'react-dom';
import Graph from './Graph.js';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'; //can't seem to make this work on the git
import '../stylesheet/stats.css';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import TagSelect from './TagSelect.js'

//Need to remember to reset graphOption to -1 when navigating away from component - unless it gets recreated?
export default class Stats extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			menuOption: -1, //what the graph is based on. 1 = all, 2 = emotion, 3 = tag
		}

		this.handleMenuClick = this.handleMenuClick.bind(this);
		this.handleTagClick = this.handleTagClick.bind(this);
		this.handleEmotionClick = this.handleEmotionClick.bind(this);
	}

	handleMenuClick(o){
		this.setState({menuOption: o});
	}

	handleTagClick(o){
		this.setState({menuOption: o});
	}

	handleEmotionClick(o){
		this.setState({menuOption: o});
	}

	render () {
		var j;
		j = <Graph menuOption={this.state.menuOption}/>;

		switch (this.state.menuOption){
			case 1:
				//All, straight into graph
				j = <Graph menuOption={this.state.menuOption}/>;
				break;
			case 2:
				j = <Graph menuOption={this.state.menuOption} />;
				break;
			case 3:
				//Tag, select tag
				//NO CODE YET - wait for thep's to be done
				//Change this so that doesn't pass these values too
				
				j = <TagsMenu />;
				//j = <Graph menuOption={this.state.menuOption} />;
				//j = <Graph menuOption={this.state.menuOption}/>;
				break;
			default:
				//graph option not chosen yet, menu of graph options
				j = <StatsMenu onClick = {this.handleMenuClick}/>
		}


		return (
			<div className='container'>
				<div className='col-md-8 stats text-center graphComponent'>
					{j}
				</div>
			</div>
		);
	}

}

class StatsMenu extends React.Component {

	constructor(props) {
		super(props)
		this.handleClick = this.handleClick.bind(this)
	}

	renderButton(n, v){
		return (
			<StatsMenuButton
			name = {n}
			onClick = {() => this.handleClick(v)}
			/>
		);
	}

	handleClick(o){
		this.props.onClick(o);
	}

	render () {
		return (
			<div className="stats-menu">
				<b>View graph based on:</b>
				<p/>
				<div className="menu-buttons">
				<ButtonGroup vertical>
					{this.renderButton("Everything", 1)}
					<p/>
					{this.renderButton("Emotion", 2)}
					<p/>
					{this.renderButton("A Tag", 3)}
					</ButtonGroup>
				</div>
			</div>
		);
	}

}

function StatsMenuButton(props) {
	return (
		<div className="button-row">
			<Button
			variant = "primary"
			onClick={props.onClick}
			block
			>
			{props.name}
			</Button>
		</div>
	);
}

class TagsMenu extends React.Component {

	constructor(props) {
		super(props)
		this.handleClick = this.handleClick.bind(this)
	}

	handleClick(o){
		this.props.onClick(o);
	}

	render () {
		return (
			<div className="stats-menu">
				<b>View graph based on:</b>
				<p/>
				<div className="tags-menu">
					<TagSelect />
				</div>
			</div>
		);
	}

}

ReactDOM.render(
  <Stats />,
  document.getElementById('root')
);
