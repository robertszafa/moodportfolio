import React, { Component } from 'react'
import {apiMoodportfolio} from '../App'
import { Button } from 'react-bootstrap';
import TagMenu from './TagMenu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import '../stylesheet/photo.css'


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
            onlyImage: this.props.onlyImage,
        };

        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.onUploadDescription = this.onUploadDescription.bind(this);
        this.onChangeDescriptionClick = this.onChangeDescriptionClick.bind(this);
        this.onDeletePhoto = this.onDeletePhoto.bind(this);
    }

    componentWillMount() {
        console.log('photo uri fetch ', this.state);
        
        let authToken = localStorage.getItem("authToken");
        fetch(apiMoodportfolio + '/PhotoUri', {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            withCredentials: true,
            credentials: "same-origin",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
                "PhotoId": this.props.photoId,
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
        .then((json) => {
            console.log(json);
            
            if (json.success) {
                let photoId = this.state.photoId;
                this.setState = {
                    photoLoaded: false,
                    photoUri: null,
                    photoId: null,
                    timestamp: null,
                    city: null,
                    description: null,
                    emotion: null,
                    dominantEmotion: null,
                    changeDescription: false,
                };
                this.props.unmountPhoto(photoId);
                
            }
        })
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

    firstCharToUpperCase = str => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }


    render() {
        const { photoLoaded,
                photoUri,
                timestamp,
                city,
                description,
                emotion,
                dominantEmotion,
                changeDescription,
                onlyImage
             } = this.state;


        return (
            (onlyImage && photoLoaded) ? <img src={photoUri} alt="Latest capture of yourself"/>
                                       : // if onlyImage is false display tagMenu, description, info

            <div className="photoContainer">
            

                <h3>{<FontAwesomeIcon icon={faCamera} />} {formatDate(timestamp)}</h3>
                {photoLoaded &&
                    <img src={photoUri} alt="Latest capture of yourself"/>
                }
                {/* <div>
                    <b>Dominant Emotion:</b> {""}
                    {this.firstCharToUpperCase(JSON.stringify(dominantEmotion).match(/"([^']+)"/)[1])} {""}
                    {JSON.stringify(dominantEmotion).match(/:([^']+)}/)[1]}{"%"} 
                </div> */}
                <div>
                    <b>Dominant Emotion: </b> {JSON.stringify(dominantEmotion)}
                </div>
                <div>
                    <b>Classified Emotions:</b> {JSON.stringify(emotion).split(/[."{}]/).join(' ')}
                </div>

                <div>
                    <b>Taken on:</b> {formatDate(timestamp)}
                </div>
                
                <div>
                    <b>Location:</b> {city && <p style={{display:'inline'}}> in {city}</p>}
                </div>

                {changeDescription ?
                    <div class = "text-center moodDiary">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Your Description: </span>
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
                    <Button className="btnDelete" variant="danger" onClick={this.onDeletePhoto}>
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
