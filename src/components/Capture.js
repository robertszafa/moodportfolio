import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo'
import 'react-html5-camera-photo/build/css/index.css'
import ImageUploader from 'react-images-upload';
import Button from 'react-bootstrap/Button';
import {apiMoodportfolio} from '../App'


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

    onUploadPhoto() {
        this.setState({ isUploading: true });
        let authToken = localStorage.getItem("authToken");
        let latitude = sessionStorage.getItem("latitude");
        let longitude = sessionStorage.getItem("longitude");

        fetch(apiMoodportfolio + '/api/Emotions', {
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
     
    render () {
        const { isUploading } = this.state;
        const { dataUri } = this.state;

        return (
          <div className="App">
            <Camera
                onTakePhoto = { (dataUri) => {
                    this.setState({ canUpload: true,
                                    dataUri: dataUri })
                } }
                idealFacingMode = {FACING_MODES.USER}
                idealResolution = {{width: 480, height: 480}}
                imageType = {IMAGE_TYPES.JPG}
                imageCompression = {0.97}
                isMaxResolution = {false}
                isDisplayStartCameraError = {true}
                sizeFactor = {1}
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
                disabled={!dataUri}
                onClick={!isUploading ? this.onUploadPhoto : null}
            >
                {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        );
    }


}
