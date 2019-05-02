import React, {Component} from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import ImageUploader from 'react-images-upload';
import { Button, Container, Row } from 'react-bootstrap';
import {apiMoodportfolio} from '../App';
import TagMenu from './TagMenu';
import GraphPlotter from './GraphPlotter.js';
import '../stylesheet/capture.css';

export default class Capture extends Component {
    constructor(props) {
        super(props);
        this.maxDescriptionLength = 280;
        this.state = {
            dataUri: "",
            webcamEnabled: true,
            canUpload: false,
            isUploading: false,
            emotion: "",
            dominantEmotion: "",
            dominantEmotionValue: "",
            photoId: "",
            description: "",
            error: "",
            showRadoiButtons: false,
            editedEmotion: ""
        }
        this.onDrop = this.onDrop.bind(this);
        this.onUploadPhoto = this.onUploadPhoto.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.onUploadDescription = this.onUploadDescription.bind(this);
        this.onClickEditEmotions = this.onClickEditEmotions.bind(this);
        this.handleChangeEditEmotions = this.handleChangeEditEmotions.bind(this)
        this.handleSubmitEditEmotions = this.handleSubmitEditEmotions.bind(this)
    }

    // Upload the photo to the server for classification
    onUploadPhoto() {
        this.setState({ 
            isUploading: true,
            showRadoiButtons: false,
            editedEmotion: "" 
        });
        let authToken = localStorage.getItem("authToken");
        let latitude = sessionStorage.getItem("latitude");
        let longitude = sessionStorage.getItem("longitude");

        fetch(apiMoodportfolio + '/ClassifyEmotion', {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            withCredentials: true,
            credentials: "same-origin",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "dataUri": this.state.dataUri,
                                    "latitude": latitude,
                                    "longitude": longitude })
        })
        .then((res) => res.json())
        .then(json => {
            console.log(json)
            if (json.success) {

                this.setState({ isUploading: false,
                                emotion: json.emotion,
                                photoId: json.photoId,
                                dominantEmotion: Object.keys(json.dominantEmotion)[0],
                                dominantEmotionValue: Object.values(json.dominantEmotion)[0],
                            })
                    
            }
            else {
                this.setState({ isUploading: false,
                                error: json.error
                            })
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
        .then((res) => res.json())
        .then(json => {
            console.log(json)
        })
    }

    handleDescriptionChange(event) {
        this.setState({description: event.target.value});
    }


    // Reset all states when user wants to choose another image
    handleRecapture = e => {
        e.preventDefault();
        this.setState({
            dataUri: "",
            webcamEnabled: true,
            isUploading: false,
            description: "",
            error: "",
            emotion: "",
            photoId: "",
            showRadoiButtons: false,
            editedEmotion: ""
        })
    };

    // Upload a photo from the user's files
    onDrop(picture) {
        let reader = new FileReader();
        reader.readAsDataURL(picture[0]);

        let dataUri = ""
        reader.onload = () => {
            dataUri = reader.result;
        };
        reader.onerror = (error) => {
            console.log('Error: ', error);
        };

        reader.onloadend = () => {
            this.setState({ dataUri: dataUri });
        }
    }

    handleSubmitEditEmotions(e) {
        e.preventDefault();

        let authToken = localStorage.getItem("authToken");

        fetch(apiMoodportfolio + '/EditEmotions', {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            withCredentials: true,
            credentials: "same-origin",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "photoID": this.state.photoId,
                "emotionName" : this.state.editedEmotion
            })
        })
        .then((res) => res.json())
        .then(json => {
            console.log(json)
            if(json.success) {
                this.setState({
                    dominantEmotion: this.state.editedEmotion,
                    dominantEmotionValue: "100",
                    showRadoiButtons: false
                })
            }
        })
    }


    onClickEditEmotions(e) {
        e.preventDefault()
        this.setState({showRadoiButtons: true})
    }

    handleChangeEditEmotions(event) {
        this.setState({editedEmotion: event.target.value});
      }

    render() {
        const { isUploading, dataUri, photoId } = this.state;

        let radioButtons = 
		<div>
			<form onSubmit={this.handleSubmitEditEmotions}>
			  <p className="text-center merriweather">Select the right emotion:</p>			  
			  <ul>
				<li>
				  <label> <input type="radio" value="happiness" checked={this.state.editedEmotion === "happiness"} onChange={this.handleChangeEditEmotions} /> Happiness </label>
				</li>				
				<li>
				  <label> <input type="radio" value="neutral" checked={this.state.editedEmotion === "neutral"} onChange={this.handleChangeEditEmotions} />Neutral </label>
				</li>
                <li>
				  <label> <input type="radio" value="surprise" checked={this.state.editedEmotion === "surprise"} onChange={this.handleChangeEditEmotions} /> Surprise </label>
				</li>
                <li>
				  <label> <input type="radio" value="sadness" checked={this.state.editedEmotion === "sadness"} onChange={this.handleChangeEditEmotions} />Sadness </label>
				</li>
                <li>
				  <label> <input type="radio" value="anger" checked={this.state.editedEmotion === "anger"} onChange={this.handleChangeEditEmotions} />Anger </label>
				</li>
                <li>
				  <label> <input type="radio" value="disgust" checked={this.state.editedEmotion === "disgust"} onChange={this.handleChangeEditEmotions} />Disgust </label>
				</li>
                <li>
				  <label> <input type="radio" value="fear" checked={this.state.editedEmotion === "fear"} onChange={this.handleChangeEditEmotions} />Fear </label>
				</li>
                <li>
				  <label> <input type="radio" value="contempt" checked={this.state.editedEmotion === "contempt"} onChange={this.handleChangeEditEmotions} /> Contempt </label>
				</li>
			  </ul>
			  <Button className="center" variant="warning" type="submit">Confirmed</Button>
			</form>		
		</div>

        const EnableCaptureAndUpload = (
            <div className="center">

                <div className="cam">
                    <Camera
                        onTakePhoto = { (dataUri) => {
                            this.setState({ canUpload: true,
                                            dataUri: dataUri })
                        } }
                        idealFacingMode = {FACING_MODES.USER}
                        idealResolution = {{width: 64, height: 64}}
                        imageType = {IMAGE_TYPES.JPG}
                        imageCompression = {0.97}
                        isMaxResolution = {false}
                        isDisplayStartCameraError = {true}
                        siz eFactor = {1}
                    />
                </div>

                <div className="file-photo">
                    <ImageUploader
                        withIcon={false}
                        withLabel={false}
                        buttonText='Choose from your files'
                        onChange={this.onDrop}
                        imgExtension={['.jpg', '.gif', '.png', '.gif']}
                        maxFileSize={5242880}
                        singleImage={true} 
                    />
                </div>
                
                <div className="instructions">
                        <h3 className="text-center montserrat">Quick Guide</h3>
                        <div className="instructions merriweather">1. Take or upload a photo of youself.</div>
                        <div className="instructions merriweather">2. Press upload button.</div>
                        <div className="instructions merriweather">3. Let our artificial intelligence read your emotions.</div>
                        <div className="instructions merriweather">4. Add notes about your day or activity tags.</div>
                </div>

            </div>
        )
		
		//Create graph data for radio graph
		const emos = this.state.emotion;
		console.log('em',emos);
		const graphData = {
			labels: ['fear','anger','contempt','disgust','sadness','neutral','surprise','happiness'],
			datasets: [{
				label: 'AI Confidence',
				data: [emos.fear, emos.anger, emos.contempt, emos.disgust, emos.sadness, emos.neutral, emos.surprise, emos.happiness],
				backgroundColor: 'rgba(244,179,255,200)',
				borderColor: 'rgba(120,0,150,100)',
				pointBackgroundColor: ['#11ff00','#ff0011','#ee00ff','#80027a','#1003ff','#06ffb4','#ff7206','#fff700'],
			}]
		};
		
		var radarGraph = <GraphPlotter type={4} data={graphData}/>;

        return (
            <div className="captureContainer">
                <Container>
                    <Row className="justify-content-md-center">

                    {this.state.dataUri || this.state.emotion || this.state.error ?
                        <div>
                            <p><img className="recentPhotograph" src={this.state.dataUri} alt="Your recent photograph"
                                    width="100%"/></p>

                            {this.state.emotion && 
                                <p className="resultParagraph merriweather">You are feeling: <b>{this.state.dominantEmotion} ({this.state.dominantEmotionValue}% confidence)</b></p>}
                            {this.state.error && <p>An error occured: {this.state.error}</p>}
                        
                        <div className="captureBtn">
                            <Button 
                            className="btn"
                            variant="primary"
                            disabled={isUploading}
                            onClick={!isUploading ? this.handleRecapture : null}>
                                Recapture
                            </Button>

                            <Button
                            className="btn"
                            variant="primary"
                            disabled={!dataUri || isUploading || this.state.emotion}
                            onClick={!isUploading ? this.onUploadPhoto : null}>
                                Upload
                            </Button>
                        </div>
                        
                        <div className="btnChangeEmotion">
                        {this.state.emotion!=="" ? <p className="merriweather text-center">Not the right emotion displayed? </p> : null}
                        {this.state.emotion!=="" ? <button class="btn btn-dark center" onClick={this.onClickEditEmotions}>Change Emotion</button> : null}
                        {this.state.showRadoiButtons ? radioButtons : null}
						</div>

                        <div>
							{radarGraph}
						</div>	

                        </div>
                    : EnableCaptureAndUpload }
                    </Row>
                </Container>

                {this.state.emotion &&
                    <div class = "text-center afterPhotoContainer">
                        <div>Add descriptions</div>
                        <div class="input-group">
                            <textarea className="form-control descriptionBox" 
                                    type="text"
                                    maxLength="280"
                                    aria-label="With textarea"
                                    value={this.state.description}
                                    onChange={this.handleDescriptionChange}>
                            </textarea>

                            <div class="input-group-append">
                                <button class="btn btn-dark" 
                                        type="submit" 
                                        value="submit"
                                        disabled={!this.state.description}
                                        onClick={this.onUploadDescription}>
                                    Save
                                </button>
                            </div>
                        </div>
                        <div>
                            {this.state.description.length} / {this.maxDescriptionLength}
                        </div>

                    </div>
                }

                {this.state.emotion &&
                    <TagMenu photoId={photoId}/>
                }

            </div>
        )
    }

}




