import React, { Component } from 'react'
import {apiMoodportfolio} from '../App'


export default class Photo extends Component {
    constructor(props) {
        super(props);
		this.state = {
            photoUri: "",
            path: this.props.path,
            timestamp: this.props.timestamp,
            emotion: JSON.parse(this.props.emotion),
            dominantEmotion: getDominantEmotion(JSON.parse(this.props.emotion)),
        };
    }
    

    componentDidMount() {
        let authToken = localStorage.getItem("authToken");
        fetch(apiMoodportfolio + '/PhotoUri', {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            withCredentials: true,
            credentials: "same-origin",
            headers: {
                "Authorization": authToken,
                "Path": this.state.path,
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