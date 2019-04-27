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
            const result = json.result;
            let photos = new Array();
            result.forEach(jsonData => {
                photos.push(jsonData);
            });

            this.setState({
                photos: photos,
            })
        })
        .catch(err => console.log(err))
    }


    render() {
        const {photos, } = this.state;
        const Photos = photos.map(photo => 
                                    <Photo
                                        photoId={photo.photoID}
                                        timestamp={photo.timestamp}
                                        city={photo.city}
                                        description={photo.description}
                                        emotion={photo.emotion}
                                        dominantEmotion={photo.dominantEmotion}
                                    />
                                )

        return (
          <div>
              <p>Your recent emotions</p>
              
              {Photos}
          </div>    
        )
    }

}