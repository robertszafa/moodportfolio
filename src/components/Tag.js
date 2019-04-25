import React, {Component} from 'react';
import {apiMoodportfolio} from '../App';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default class Tag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTag: "",
            photoID: "",
            newTag: "",
            tagList: ["Football", "Study", "Breakfast", "Work", "Gym", 
                    "Family", "Party", "Friends", "Books", "Tidying"],
            savedOnServer: false,
        };
    }

    componentDidMount() {
        let authToken = localStorage.getItem("authToken");
        fetch(apiMoodportfolio + '/Tag', {
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
            const userData = json.success ? json.data : null;
            this.setState({userData: userData});
        })
    }

    onSaveTag() {
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
                    "tag": this.state.selectedTag,                     
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
            selectedTag: e.target.value,
            savedOnServer: false,
        })
    }

    handleSelectTag = tag => {
        this.setState({
            selectedTag: [...this.state.selectedTag, this.state.tag]
        })
    }

    render() {
        const TagList = this.state.tagList.map(tag => <Button onClick={() => this.handleSelectTag(tag)} variant="contained" color="secondary">{tag}</Button>)

        return (
            <div className="TagComponent">
                {TagList}
                <TextField
                    label="Tag"
                    value={this.state.selectedTag}
                    onChange={e => this.handleChange(e)}
                    margin="normal"
                /> 
            </div>
        )
    }

}