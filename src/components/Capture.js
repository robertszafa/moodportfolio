import React, {Component} from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo'
import 'react-html5-camera-photo/build/css/index.css'
import ImageUploader from 'react-images-upload';
import { Button, Container, Row, Col } from 'react-bootstrap';
import {apiMoodportfolio} from '../App';
import TagMenu from './TagMenu'


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
        }
        this.onDrop = this.onDrop.bind(this);
        this.onUploadPhoto = this.onUploadPhoto.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.onUploadDescription = this.onUploadDescription.bind(this);
    }

    // Upload the photo to the server for classification
    onUploadPhoto() {
        this.setState({ isUploading: true });
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

    render() {
        const { isUploading, dataUri, photoId } = this.state;

        const EnableCaptureAndUpload = (
            <div>

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
                        singleImage={true} />
                </div>


            </div>
        )

        return (
            <div className="captureContainer">
                <Container>
                    <Row className="justify-content-md-center">

                    {this.state.dataUri || this.state.emotion || this.state.error ?
                        <div>
                            <p><img src={this.state.dataUri} alt="Your photo"
                                    width="100%"/></p>

                            {this.state.emotion && 
                                <p>You look: {this.state.dominantEmotionValue}% {this.state.dominantEmotion}</p>}
                            {this.state.error && <p>An error occured: {this.state.error}</p>}

                            <Button
                            variant="primary"
                            disabled={isUploading}
                            onClick={!isUploading ? this.handleRecapture : null}>
                                Recapture
                            </Button>

                            <Button
                            variant="primary"
                            disabled={!dataUri || isUploading || this.state.emotion}
                            onClick={!isUploading ? this.onUploadPhoto : null}>
                                Upload
                            </Button>
                        </div>
                    : EnableCaptureAndUpload }
                    </Row>
                </Container>

                {this.state.emotion &&
                    <div class = "text-center moodDiary">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Add description: </span>
                            </div>

                            <textarea class="form-control" 
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