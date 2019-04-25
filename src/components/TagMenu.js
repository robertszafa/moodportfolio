import React, {Component} from 'react';
import { Button} from 'react-bootstrap';
import {apiMoodportfolio} from '../App';
import '../stylesheet/tagMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons';


export default class TagMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newTag: "",
            tags: ["Football", "Study", "Breakfast", "Work", "Gym", 
                    "Family", "Party", "Friends", "Books", "Tidying"]
        };
    }

    componentDidMount() {
        let authToken = localStorage.getItem("authToken");
        fetch(apiMoodportfolio + '/Tags', {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then(json => {
            console.log("json\n ", json);
            const tags = json.success ? json.data : null;
            this.setState({tags: tags});
        })
    }

    onChange = event => {
        this.setState({newTag: event.target.value})
    }

    onAddTag = () => {
        this.setState({
            tags: [...this.state.tags, this.state.newTag],
            newTag: ""
        })
    }

    deleteTag = event => {
        this.setState({tags: this.state.tags.filter(function(tag) {
            return tag !== event;
        })})
    }

    render() {
        const TagList = this.state.tags.map(tag => <div><li key={tag}>{tag}<FontAwesomeIcon className="binIcon" onClick={() => this.deleteTag(tag)} icon={faTrashAlt} /></li></div>)

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
            </div>
        );
    }

}