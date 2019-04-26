import React, {Component} from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import {apiMoodportfolio} from '../App';
import TextField from '@material-ui/core/TextField';
import Photo from './Photo'



export default class RecentPhotos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: this.props.limit,
            photos: new Array(),
            loaded: false,
        };
    }

    componentWillMount() {
		let authToken = localStorage.getItem("authToken");
        fetch(apiMoodportfolio + '/EmotionsQuery', {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            withCredentials: true,
            credentials: "same-origin",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
                "BasedOn": "all",
                "StartDate": "",
                "EndDate": "",
                "Limit": this.state.limit,
            },
        })
        .then((res) => res.json())
        .then(json => {
            console.log(json);
            
            const result = json.result;
            let photos = new Array();
            result.forEach(jsonData => {
                photos.push(jsonData);
            });

            this.setState({
                photos: photos,
                loaded: true,
            })
        })
        .catch(err => console.log(err))
    }
    

    handleChange(e) {
    }

    render() {
        const {photos, loaded} = this.state;
        console.log("test", photos[0]);

        return (
          <div>
              {loaded &&
                <Photo
                    photoId={photos[0].photoID}
                    timestamp={photos[0].timestamp}
                    emotion={photos[0].emotion}
                    dominantEmotion={photos[0].dominantEmotion}
                />
              }
          </div>    
        )
    }

}