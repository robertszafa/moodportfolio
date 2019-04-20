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
        };
    }

    componentDidMount() {
        let authToken = localStorage.getItem("authToken");
        fetch(apiMoodportfolio + '/PhotoTag', {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            withCredentials: true,
            credentials: "same-origin",
            headers: {
                "Authorization": authToken,
                "Path": this.state.path,
                "Content-Type": "application/json",
            },
        })
        .then(res => res.json())
        .then(json => {
            this.setState({
                photoUri: json.photoUri,
            })
        })
    }

    handleChange(e) {
        this.setState({ name: e.target.value })
    }

    render() {

        return (
            <TextField
                label="Tag"
                value={this.state.name}
                onChange={this.handleChange()}
                margin="normal"
            />
        )
    }

}