import React, {Component} from 'react';
import Webcam from 'react-webcam';
import ImageUploader from 'react-images-upload';
import { Button } from 'react-bootstrap';
import {apiMoodportfolio} from '../App';

// Add Capture2 to App and disable others for now

export default class Capture extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataUri: "",
            isUploading: false
        }
        this.onDrop = this.onDrop.bind(this);
        this.onUploadPhoto = this.onUploadPhoto.bind(this);
    }

    setRef = webcam => {
        this.webcam = webcam;
    };

    capture = () => {
        const imageSrc =this.webcam.getScreenshot();
        this.setState({
            dataUri: imageSrc
        })
    };

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
        const { isUploading } = this.state;
        const { dataUri } = this.state;

        const videoConstraints = {
            width: 1280,
            height: 720,
            facingMode: "user"
        };

        return (
            <div className="App">

            {this.state.dataUri ? 
                <div>
                    <p><img src={this.state.dataUri} alt=""/></p>
                </div>
            : null}

                <Webcam
                audio={false}
                // height={1250}
                ref={this.setRef}
                screenshotFormat="image/jpeg"
                // width={650}
                videoConstraints={videoConstraints}/>

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
                disabled={!dataUri}
                onClick={!isUploading ? this.capture : null}>Capture photo
                </Button>

            </div>
        )
    }

}