import React, {Component} from 'react';
import { Button} from 'react-bootstrap';
import {apiMoodportfolio} from '../App';
import '../stylesheet/tagMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import Tag from './Tag'


export default class TagMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newTag: "",
            Tags: new Array(),
            photoId: this.props.photoId,
        };
        this.unmountTag = this.unmountTag.bind(this);
        this.onAddTag = this.onAddTag.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        let authToken = localStorage.getItem("authToken");
        fetch(apiMoodportfolio + '/PhotoTag', {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
                "PhotoId": this.state.photoId,
            },
        })
        .then((res) => res.json())
        .then(json => {
            const photoTags = json.photoTags;
            let newTags = new Array();
            if (photoTags) {
                photoTags.forEach(tag => {
                    newTags.push(<Tag
                                    tagId={tag.tagID}
                                    name={tag.name}
                                    photoId={this.state.photoId}
                                    unmountTag={this.unmountTag}
                                />
                                )
                });
            }
            this.setState({
                Tags: newTags,
            })
        })
        .catch(err => console.log(err))
    }

    onChange(event) {
        this.setState({newTag: event.target.value})
    }

    onAddTag() {
        console.log('Addding ', this.state.newTag);
        
        if (this.state.newTag.length > 0) {
            console.log('Addding 2');
            let authToken = localStorage.getItem("authToken");
            fetch(apiMoodportfolio + '/PhotoTag', {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Authorization": authToken,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    'photoId': this.state.photoId,
                    'tagName': this.state.newTag,
                }),
            })
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                
                let tagId = json.tagId;
                if (tagId) {
                    this.setState({
                        Tags: [...this.state.Tags, 
                                <Tag
                                    tagId={tagId}
                                    name={this.state.newTag}
                                    photoId={this.state.photoId}
                                    unmountTag={this.unmountTag}
                                />
                            ],
                        newTag: ""
                    })
                }
            })
        }
    }

    unmountTag(tagId) {
        this.setState({Tags: this.state.Tags.filter(function(Tag) {
            return Tag.props.tagId !== tagId;
        })})
    }

    render() {

        return(
            <div className="tagMenuComponent">
                <ul className="single-tag">
                    <form>
                        <input className="fakeInput"></input>
                        <input type="text" 
                            value={this.state.newTag} 
                            onChange={this.onChange}>
                        </input>
                        
                        <Button onClick={this.onAddTag}>
                            Add Tag
                        </Button>
                    </form>

                    {this.state.Tags}
                </ul>
            </div>
        );
    }

}