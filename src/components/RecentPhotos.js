import React, {Component} from 'react';
import {apiMoodportfolio} from '../App';
import Photo from './Photo'



export default class RecentPhotos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: this.props.limit,
            Photos: new Array(),
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
        .then((json) => {
            const result = json.result;
            console.log(result);
            
            let newPhotos = new Array();
            result.forEach(photo => {
                newPhotos.push(
                    <Photo
                        key={photo.photoId}
                        photoId={photo.photoID}
                        timestamp={photo.timestamp}
                        city={photo.city}
                        description={photo.description}
                        emotion={photo.emotion}
                        dominantEmotion={photo.dominantEmotion}
                        unmountPhoto={this.unmountPhoto}
                    />
                );
            });

            this.setState({
                Photos: newPhotos
            })
        })
        .catch(err => console.log(err))
    }

    unmountPhoto(photoId) {
        console.log('unmounting in recents ', photoId);
        
        this.setState({Photos: this.state.Photos.filter(function(Photo) {
            console.log(Photo.props.photoId !== photoId);
            console.log(Photo.props.photoId, photoId);
            
            
            return Photo.props.photoId !== photoId;
        })})
    }


    render() {
        return (
          <div>
              <p>Your recent emotions</p>
              
              {this.state.Photos}
          </div>    
        )
    }

}