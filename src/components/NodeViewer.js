import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import '../stylesheet/stats.css';
import { changeDate, convertStringToDate, getUnitQuantity, getEmotionFromString, getDateDifference } from './Graph';

//nodeView = <NodeViewer nodeClicked={this.state.indexClicked} xLabels={this.state.datetimeLabels} data={this.state.photos} graphType={this.state.selectedGraph} timeUnit={this.state.selectedTime} /> 


//should take an array of data. Need to receive click event too
export default class NodeViewer extends React.Component{

	
	handleClick(){
		
	}
	
	renderCard(stamp, imgUri, emo) {
		return (
			<CarouselCard timestamp = {stamp} imgUri = {imgUri} emotion = {emo}/>
		);
	}
	
	getRelevantData(index,labels,graphType,selectedTime, startDate, endDate, photos){
		
		let timeUnit = 1;
		if (selectedTime === 1){
			timeUnit = 0
		}
		
		console.log("PH");
		console.log(photos);
		let relevantData = [];
		switch (graphType){
			case 2: //line
				let i;
				let d = startDate;
				for (i = 0; i < index; i++){
					changeDate(timeUnit,d,1);
				}
				
				//now have the criteria. Search in the data.
				let finished = 0;
				i = 0;
				while (finished < 2 && i < photos.length){
					console.log(timeUnit);
					console.log("COMPARISON OF : " + getDateDifference(photos[i].state.timestamp,startDate,timeUnit) + "	AND	" + index);
					//(getUnitQuantity(convertStringToDate(photos[i].state.timestamp),timeUnit-1) - getUnitQuantity(startDate,timeUnit-1))
					if (getDateDifference(photos[i].state.timestamp,startDate,timeUnit) === index){ //we also convert time from photos here so may need to update later
						relevantData.push(photos[i]);
						finished = 1;
					} else {
						if (finished === 1){
							finished = 2;
						}
					}
					i++;
				}
				
				break;
			case 3: //pie
				let emo = this.props.emotions[index];
				for (i = 0; i < photos.length; i++){
					console.log("COMPARISON OF: " + JSON.stringify(photos[i].state.dominantEmotion) + "		AND		" + emo);
					if (getEmotionFromString(JSON.stringify(photos[i].state.dominantEmotion)) === emo){
						relevantData.push(photos[i]);
					}
				}
				//now have the criteria, search in the data
				break;
			default:
				console.log("Incorrect graphType in getRelevantData");
		}
		console.log("relevant Data");
		console.log(relevantData);
		return relevantData;
	}
	
	render () {
		let thedata = this.getRelevantData(this.props.nodeClicked,this.props.indexLabels,this.props.graphType,this.props.timeUnit,this.props.startDate,this.props.endDate,this.props.data);
		//let jsxObj = [];
		let i;
		/*
		for (i = 0; i < thedata.length; i++){
			//turn data into cards
			jsxObj.push(this.renderCard(thedata[i].state.timestamp,thedata[i].state.photoUri,thedata[i].state.dominantEmotion));
		}
		*/
		console.log("THE DATA");
		console.log(thedata);
		
		
		var cardList = [];

		for (i = 0; i < thedata.length; i++) {
			cardList.push(
				<div key={i} className="card">
					<CarouselCard timestamp = {thedata[i].state.timestamp} imgUri = {thedata[i].state.photoUri} emotion = {thedata[i].state.dominantEmotion} key={i}/>
				</div>
			)
		}
		
		return cardList;
	}

}

function CarouselCard(props){
	
	return (
		<Card style={{ width: '5rem' }} className='card'>
			<Card.Img variant="top" src={this.props.imgUri}/>
			<Card.Body>
				
				<Card.Text>{this.props.emotion}<br/>{this.props.timestamp}</Card.Text>
				<Button variant="primary">Enlarge</Button>
			</Card.Body>
		</Card>
	);
}
