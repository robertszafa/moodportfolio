import React from 'react';
import ReactDOM from 'react-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import '../stylesheet/stats.css';

//should take an array of data. Need to receive click event too
export default class ElementViewer extends React.Component{
	constructor (props) {
		super(props);
		
	}
	
	renderCard(stamp, url, tags, emo){
		return (
		<ElementCard timestamp = {stamp} imageurl = {url} tags = {tags} emotion={emo} />
		);
	}
	
	render () {
		return (
			<div>
				renderCard();
			</div>
		);
	}
}

function ElementCard(props) {
	return (
			<Card style={{ width: '100%' }} className='card'>
			<Card.Img variant="top" src=""/>
			<Card.Body>
				<Card.Text>{this.props.emotion}<br/>{this.props.timestamp}</Card.Text>
				{/* Tags */}
				<Button variant="primary">"Change Emotion"</Button>
				<Button variant="primary">"Delete"</Button>
			</Card.Body>
		</Card>
	);
}