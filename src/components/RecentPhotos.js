import React, {Component} from 'react';
import ReactDOM from 'react-dom'
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

        this.unmountPhoto = this.unmountPhoto.bind(this);
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

    unmountPhoto(photoId) {
        let newPhotos = this.state.photos
        for (let i = 0; i < newPhotos.length; i++){ 
            if ( newPhotos[i].photoID === photoId) {
              newPhotos.splice(i, 1);
              break;
            }
        }

        this.setState({
            photos: newPhotos,
        }); 

        // TODO: remove this photo from render
    }


    render() {
        
        const {photos, } = this.state;
        console.log('RENDER ', JSON.stringify(photos))  ;
        const Photos = photos.map(photo => 
                                    <Photo
                                        photoId={photo.photoID}
                                        timestamp={photo.timestamp}
                                        city={photo.city}
                                        description={photo.description}
                                        emotion={photo.emotion}
                                        dominantEmotion={photo.dominantEmotion}
                                        unmountPhoto={this.unmountPhoto}
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