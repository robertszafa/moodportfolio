import React, {Component} from 'react'
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo'
import 'react-html5-camera-photo/build/css/index.css'

export default class Capture extends Component {
    constructor(props) {
        super(props);
    }

    onTakePhoto (dataUri) {
        let authToken = localStorage.getItem("authToken");
        fetch('http://localhost:5000/api/Emotions', {
            method: "POST", 
            mode: "cors",
            cache: "no-cache",
            withCredentials: true,
            credentials: "same-origin",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 'dataUri': dataUri })
        })
        .then((res) => res.json())
        .then(json => {
            console.log(json)
            
        })
    }
     
    render () {
        return (
          <div className="App">
            <Camera
                onTakePhoto = { (dataUri) => { this.onTakePhoto(dataUri); } }
                idealFacingMode = {FACING_MODES.USER}
                idealResolution = {{width: 480, height: 480}}
                imageType = {IMAGE_TYPES.JPG}
                imageCompression = {0.97}
                isMaxResolution = {false}
                // isImageMirror = {false}
                isDisplayStartCameraError = {true}
                sizeFactor = {1}
                // onCameraStart = { (stream) => { this.onCameraStart(stream); } }
                // onCameraStop = { () => { this.onCameraStop(); } }
            />
          </div>
        );
    }


}
