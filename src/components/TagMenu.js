import React, {Component} from 'react';
import { Button} from 'react-bootstrap';
import {apiMoodportfolio} from '../App';
import '../stylesheet/tagMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faTrashAlt} from '@fortawesome/free-solid-svg-icons';


export default class TagMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newTag: "",
            tags: [],
            photoId: this.props.photoId,
        };

        console.log('TAG state ', this.state);
        
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
            console.log('TAGS ', json);
            
            // const tags = json.success ? JSON.parse(json.photoTags) : null;
            // this.setState({tags: tags});
        })
    }

    onChange = event => {
        this.setState({newTag: event.target.value})
    }

    onAddTag = () => {
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
        })


        if (this.state.newTag > 0) {
            this.setState({
                tags: [...this.state.tags, this.state.newTag],
                newTag: ""
            })
        }
    }

    deleteTag = event => {
        this.setState({tags: this.state.tags.filter(function(tag) {
            return tag !== event;
        })})
    }

    render() {
        const {tags} = this.state;
        const TagList = tags ? this.state.tags.map(tag => <div><li key={tag}>{tag}<FontAwesomeIcon className="binIcon" onClick={() => this.deleteTag(tag)} icon={faTrashAlt} /></li></div>) : null;

        return(
            <div className="tagMenuComponent">
                <ul className="single-tag">
                <form>
                    <input className="fakeInput"></input>
                    <input type="text" value={this.state.newTag} onChange={this.onChange}></input>
                    <Button onClick={this.onAddTag}>Add Tag</Button>
                </form>
                    {TagList}
                </ul>
                {/* For testing */}
            </div>
        );
    }

}