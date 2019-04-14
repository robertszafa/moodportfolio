import React, {Component} from 'react';
import Webcam from 'react-webcam';
import ImageUploader from 'react-images-upload';
import { Button } from 'react-bootstrap';
import {apiMoodportfolio} from '../App';

export default class Capture extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataUri: "",
            webcamEnabled: true,
            isUploading: false
        }
        this.onDrop = this.onDrop.bind(this);
        this.onUploadPhoto = this.onUploadPhoto.bind(this);
    }

    // Activates the webcam from react-webcam 
    setRef = webcam => {
        this.webcam = webcam;
    };

    // Capture the image in encoded base64
    handleCapture = () => {
        const imageSrc =this.webcam.getScreenshot();
        this.setState({
            dataUri: imageSrc
        })
    };
    
    // Reset all states when user wants to choose another image
    handleRecapture = e => {
        e.preventDefault();
        this.setState({
            dataUri: "",
            webcamEnabled: true,
            isUploading: false
        })
    };

    // Upload the photo to the database
    onUploadPhoto() {
        this.setState({ isUploading: true });
        let authToken = localStorage.getItem("authToken");
        let latitude = sessionStorage.getItem("latitude");
        let longitude = sessionStorage.getItem("longitude");

        fetch(apiMoodportfolio + '/Emotions', {
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
        })
        .then(
            this.setState({ isUploading: false,
                            dataUri: "" })
        )
    }

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
        const { isUploading, dataUri } = this.state;

        const videoConstraints = {
            width: 1280,
            height: 720,
            facingMode: "user"
        };

        const EnableCaptureAndUpload = (
            <div>
                <Webcam
                    audio={false}
                    // height={1250}
                    ref={this.setRef}
                    screenshotFormat="image/jpeg"
                    // width={650}
                    videoConstraints={videoConstraints}
                />

                <ImageUploader
                withIcon={false}
                withLabel={false}
                buttonText='Choose image from filestorage'
                onChange={this.onDrop}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
                singleImage={true}
                />

                <Button 
                variant="primary"
                // disabled={dataUri}
                onClick={!isUploading ? this.handleCapture : null}>Capture photo
                </Button>
            </div>
        )

        return (
            <div className="App">

            {this.state.dataUri ? 
                <div>
                    <p><img src={this.state.dataUri} alt=""/></p>
                    <Button 
                    variant="primary"
                    // disabled={dataUri}
                    onClick={!isUploading ? this.handleRecapture : null}>Recapture
                    </Button>
                </div>
            : EnableCaptureAndUpload }
            </div>
        )
    }

}