import React, { Component } from 'react'
import {apiMoodportfolio} from '../App'
import { Button, Container, Row, Col } from 'react-bootstrap';
import TagMenu from './TagMenu'


export default class Photo extends Component {
    constructor(props) {
        super(props);
		this.state = {
            photoLoaded: false,
            photoUri: "",
            photoId: this.props.photoId,
            timestamp: this.props.timestamp,
            city: this.props.city,
            description: this.props.description,
            emotion: JSON.parse(this.props.emotion),
            dominantEmotion: getDominantEmotion(JSON.parse(this.props.emotion)),
            changeDescription: false,
            onDeletePhoto: this.props.onDeletePhoto,
        };
        
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.onUploadDescription = this.onUploadDescription.bind(this);
        this.onChangeDescriptionClick = this.onChangeDescriptionClick.bind(this);
        this.onDeletePhoto = this.onDeletePhoto.bind(this);
    }

    componentWillMount() {
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
                photoLoaded: true,
            })
        })
    }

    onDeletePhoto() {
        console.log('DELTETING in photo', this.state.photoId);
        
        let authToken = localStorage.getItem("authToken");
        fetch(apiMoodportfolio + '/PhotoUri', {
            method: "DELETE",
            mode: "cors",
            cache: "no-cache",
            withCredentials: true,
            credentials: "same-origin",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
                "PhotoId": this.state.photoId,
            },
        })
        .then((res) => res.json())
        .then((res) => {
            console.log(res);
        })

        this.props.unmountPhoto(this.state.photoId);
    }

    onUploadDescription() {
        let authToken = localStorage.getItem("authToken");
        fetch(apiMoodportfolio + '/PhotoDescription', {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            withCredentials: true,
            credentials: "same-origin",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "photoId": this.state.photoId,
                                    "description": this.state.description,
                                })
        })
        .then(() => {
            this.setState({
                changeDescription: !this.state.changeDescription,
            })
        })
    }

    onChangeDescriptionClick() {
        this.setState({changeDescription: !this.state.changeDescription});
    }

    handleDescriptionChange(event) {
        this.setState({description: event.target.value});
    }


    render() {
        const { photoLoaded,
                photoUri, 
                photoId, 
                timestamp, 
                city, 
                description, 
                emotion, 
                dominantEmotion,
                changeDescription,
             } = this.state;
        
        return (
            <div>
                {photoLoaded &&
                    <img src={photoUri} alt="Your photo"width="40%"/>
                }
                <div>
                    ID: {JSON.stringify(photoId)}
                </div>
                
                <div>
                    Dominant emotion {JSON.stringify(dominantEmotion)}
                </div>
                
                <div>
                    Classified emotions {JSON.stringify(emotion)}
                </div>
                
                <div>
                    Taken on {formatDate(timestamp)}
                    {city && <p style={{display:'inline'}}> in {city}</p>}
                </div>

                {changeDescription ?
                    <div class = "text-center moodDiary">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Your description: </span>
                            </div>

                            <textarea class="form-control" 
                                    type="text"
                                    maxLength="280"
                                    aria-label="With textarea"
                                    value={description}
                                    onChange={this.handleDescriptionChange}>
                            </textarea>

                            <div class="input-group-append">
                                <Button class="btn btn-dark" 
                                        onClick={this.onUploadDescription}>
                                    Save
                                </Button>
                            </div>
                        </div>
                    </div>

                    :
                    
                    <div>
                        Your description: {description}

                        <Button class="secondary" 
                                display="inline"
                                onClick={this.onChangeDescriptionClick}
                        >
                            Change
                        </Button>
                    </div>
                }

                <div>
                    <TagMenu photoId={this.state.photoId}/>
                </div>

                <div>
                    <Button class="danger" 
                            onClick={this.onDeletePhoto}
                    >
                        Delete photo
                    </Button>
                </div>

                <br></br>
                <br></br>
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


function formatDate(adate) {
	var d = new Date(adate);
	return (
		('0' + d.getDate()).slice(-2) + '/' + 
		('0' + (d.getMonth() + 1)).slice(-2) + '/' + 
		d.getFullYear()
	);
}