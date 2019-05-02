

export default class TagSelect extends React.Component {
	
	constructor(props){
		super(props);
	}
	
	componentWillMount(){
		let basedOn = "tagUsage";
		let startDate = '01/01/1970';
		let endDate = "29/04/2019"; // exclusive
		let authToken = localStorage.getItem("authToken");
		
		
		fetch(apiMoodportfolio + '/EmotionsQuery', {
			method: "GET",
			mode: "cors",
			cache: "no-cache",
			credentials: "same-origin",
			headers: {
				"Authorization": authToken,
				"Content-Type": "application/json",
				"BasedOn": basedOn,
				"StartDate": startDate,
				"EndDate": endDate,
			},
		})
		.then((res) => res.json())
		.then(json => {
			console.log('tag emotionsquery', json)
		})
		.catch(err => console.log(err))
	}
	
	render(){
		
		var tagButtons = [];

		for (let i = 0; i < this.props.tags.length; i++) {
			tagButtons.push(
				<div key={i} className="tag-button">
					<Button variant = "primary" onClick={this.props.onClick}>{this.props.tags[i]}</Button>
				</div>
			)
		}
		
		return tagButtons;
	}
	
}