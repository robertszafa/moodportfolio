import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import '../stylesheet/stats.css';

//should take an array of data. Need to receive click event too
export default class NodeViewer extends React.Component{

	constructor (props) {
		super(props);
		
	}
	
	handleClick(){
		
	}
	
	renderCard(stamp, thumb, emo) {
		return (
			<CarouselCard timestamp = {stamp} thumbnailUrl = {thumb} emotion = {emo}/>
		);
	}
	
	render () {
		//will need to send more in final version

		const thumbnail = "../images/test.jpg";
		
		return (
			<div className = 'card-carousel'>
				{this.renderCard(this.props.timestamp, thumbnail, this.props.emotion)}
				{this.renderCard(this.props.timestamp, thumbnail, this.props.emotion)}
				{this.renderCard(this.props.timestamp, thumbnail, this.props.emotion)}
				{this.renderCard(this.props.timestamp, thumbnail, this.props.emotion)}
				{this.renderCard(this.props.timestamp, thumbnail, this.props.emotion)}
			</div>
		);
	}

}

function CarouselCard(props){
	return (
		<Card style={{ width: '5rem' }} className='card'>
			<Card.Img variant="top" src=""/>
			<Card.Body>
				
				<Card.Text>{props.emotion}<br/>{props.timestamp}</Card.Text>
				<Button variant="primary">Enlarge</Button>
			</Card.Body>
		</Card>
	);
}