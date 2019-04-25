import React, {Component} from 'react';
import { Button} from 'react-bootstrap';
import {apiMoodportfolio} from '../App';
import Tag from '../components/Tag';


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
        console.log("delete");
        console.log(event);
        this.setState({tags: this.state.tags.filter(function(tag) {
            return tag !== event;
        })})
    }

    render() {
        const TagList = this.state.tags.map(tag => <li key={tag}>{tag}<Button onClick={() => this.deleteTag(tag)} style={{marginLeft: '12px'}}>Delete</Button></li>)

        return(
            <div>
                <input type="text" on={this.state.newTag} onChange={this.onChange}></input>
                <form>
                    <input type="text" value={this.state.newTag} onChange={this.onChange}></input>
                    <Button onClick={this.onAddTag}>Add Tag</Button>
                </form>
                <ul className="single-tag">
                    {TagList}
                </ul>
                {/* For testing */}
                <Tag />
            </div>
        );
    }

}