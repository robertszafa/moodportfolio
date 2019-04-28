import React, {Component} from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import {apiMoodportfolio} from '../App';
import TextField from '@material-ui/core/TextField';
import '../stylesheet/tagMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faTrashAlt} from '@fortawesome/free-solid-svg-icons';





export default class Tag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            photoId: this.props.photoId,
            tagId: this.props.tagId,
        };
        this.onDelete = this.onDelete.bind(this);
    }

    onDelete() {
        let authToken = localStorage.getItem("authToken");
        fetch(apiMoodportfolio + '/PhotoTag', {
            method: "DELETE",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
                "PhotoId": this.state.photoId,
                "TagId": this.state.tagId,
            },
        })
        .then((res) => res.json())
        .then(json => {
            console.log(json);
            if (json.success) {
                this.props.unmountTag(this.state.tagId);
            }
        })
        .catch(err => console.log(err))
    }

    render() {
        const {tagId, name, photoID} = this.state;
        return (
            <div>
                <li>
                    <FontAwesomeIcon 
                        className="binIcon" 
                        onClick={this.onDelete} 
                        icon={faTrashAlt} 
                    />
                    {name}
                </li>
            </div>
        )
    }

}