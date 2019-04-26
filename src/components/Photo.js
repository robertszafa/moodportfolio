import React, { Component } from 'react'
import {apiMoodportfolio} from '../App'


export default class Photo extends Component {
    constructor(props) {
        super(props);
		this.state = {
            photoUri: "",
            photoId: this.props.photoId,
            timestamp: this.props.timestamp,
            emotion: JSON.parse(this.props.emotion),
            dominantEmotion: getDominantEmotion(JSON.parse(this.props.emotion)),
        };
        console.log("photo " + this.state.photoId);
        
    }
    

    componentWillMount() {
        console.log('requesting URi with id ', this.state.photoId);
        
        let authToken = localStorage.getItem("authToken");
        fetch(apiMoodportfolio + '/PhotoUri', {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            withCredentials: true,
            credentials: "same-origin",
            headers: {
                "Authorization": authToken,
                "PhotoId": this.state.photoId,
                "Content-Type": "application/json",
            },
        })
        .then(res => res.json())
        .then(json => {
            this.setState({
                photoUri: json.photoUri,
            })
        })
    }

    render() {
        const { photoUri, photoId, timestamp, emotion, dominantEmotion } = this.state;

        return (
            <div>
                <p>Taken on {timestamp}</p>
                <p><img src={photoUri} alt="Your photo"width="100%"/></p>
            </div>
        )
    }
}




function getDominantEmotion(emotions) {
    const keys = Object.keys(emotions);
    let max;
    let dominantEmotion;
    keys.forEach(emo => {
        if (!max || emotions[emo] > max) {
            max = emotions[emo];
            dominantEmotion = emo;
        }
    });

    return {[dominantEmotion]: max};
}


function convertStringToDate(str){
	let d = new Date(str);
	// add time zone offset
    return d.setTime( d.getTime() + d.getTimezoneOffset()*60*1000 );
}