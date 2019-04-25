import React, {Component} from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import {apiMoodportfolio} from '../App';
import TextField from '@material-ui/core/TextField';



export default class Tag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            photoID: "",
            tagID: "",
            savedOnServer: false,
        };
    }

    osSaveTag() {
        let authToken = localStorage.getItem("authToken");
        fetch(apiMoodportfolio + '/PhotoTag', {
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
                    "photoId": this.state.photoID,                                
                    "tagName": this.state.name,                     
                })
        })
        .then(res => res.json())
        .then(json => {
            console.log(json);
            
            if (json.success) {
                this.setState({
                    savedOnServer: true,
                })
            }
        })
    }

    handleChange(e) {
        this.setState({ 
            name: e.target.value,
            savedOnServer: false,
        })
    }

    render() {

        return (
            <TextField
                label="Tag"
                value={this.state.name}
                onChange={e => this.handleChange(e)}
                margin="normal"
            />
        )
    }

}