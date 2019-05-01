import React, {Component} from 'react';
import { Button} from 'react-bootstrap';
import {apiMoodportfolio} from '../App';
import '../stylesheet/tagMenu.css';
import Tag from './Tag'


export default class TagMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newTag: "",
            Tags: new Array(),
            photoId: this.props.photoId,
            errorMessage: "",
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
        this.setState({newTag: event.target.value, errorMessage: ""})
    }

    onAddTag() {
        console.log('Addding ', this.state.newTag);
        this.state.newTag = this.state.newTag.toLowerCase();

        let tagExist = false;
        let notOneWord = false;
        let noSpecialChar = false;
        const specialCharacters = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g;

        for (let i = 0; i < this.state.Tags.length; i++) {
            if (this.state.Tags[i].props.name == this.state.newTag) {
                this.setState({errorMessage: "This tag already exists"})
                tagExist = true;
                this.setState({errorMessage: "This tag already exists"})
            }
        }

        if (!this.state.newTag.match(specialCharacters)) {
            this.setState({errorMessage: "No special characters allowed"});
            noSpecialChar = true;
        }

        if (this.state.newTag.trim().indexOf(' ') != -1) {
            this.setState({errorMessage: "The tag must be one word only"})
            notOneWord = true;
        }

        if (this.state.newTag.length > 0 && tagExist == false && notOneWord == false && noSpecialChar == false) {
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
                                    key={tagId}
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
                            maxLength = "30"
                            value={this.state.newTag} 
                            onChange={this.onChange}>
                        </input>
                        <Button onClick={this.onAddTag}>
                            Add Tag
                        </Button>
                    </form>
                    <div className="errorMessage">{this.state.errorMessage}</div>
                    {this.state.Tags}
                </ul>
            </div>
        );
    }

}