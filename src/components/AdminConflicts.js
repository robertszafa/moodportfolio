
export default class Home extends React.Component {
    constructor(props) {
      super(props);
    }

    // componentWillMount(){
    //   this.getNumberOfUsers();
    //   this.getMostPopularTag();
    //   this.getMostPopularLoc();
    // }

    getNumberOfUsers() {
        let authToken = localStorage.getItem("authToken");

        fetch(apiMoodportfolio + '/AdminQuery', {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            withCredentials: true,
            credentials: "same-origin",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                                  'basedOn': "any",
                                  'splSQLQuery' : " SELECT COUNT(DISTINCT userID) FROM User",
                                })
        })
        .then((res) => res.json())
        .then(json => {
            console.log(json)
            if(json.success){
                //result is the answer.
                this.setState({numOfUsers: json.result})
            } else {
                this.setState({error: json.error})
            }
        })
    }

    //return the most popular tag from the TAG table
    getMostPopularTag() {
        let authToken = localStorage.getItem("authToken");

        fetch(apiMoodportfolio + '/AdminQuery', {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            withCredentials: true,
            credentials: "same-origin",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                                  'basedOn': "any",
                                  'splSQLQuery' : " SELECT name, MAX(count) from Tag",
                                })
        })
        .then((res) => res.json())
        .then(json => {
            console.log(json)
            if(json.success){
                //result is the answer.
                this.setState({mostPopularTag: json.result})
            } else {
                this.setState({error: json.error})
            }
        })
    }

    //return the most popular location users are from
    getMostPopularLoc() {
        let authToken = localStorage.getItem("authToken");

        fetch(apiMoodportfolio + '/AdminQuery', {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            withCredentials: true,
            credentials: "same-origin",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                                  'basedOn': "any",
                                  'splSQLQuery' : " SELECT country, MAX(country) from User",
                                })
        })
        .then((res) => res.json())
        .then(json => {
            console.log(json)
            if(json.success){
                //result is the answer.
                this.setState({mostPopularLoc: json.result})
            } else {
                this.setState({error: json.error})
            }
        })
    }



    //return the photos uploaded per day
    getPhotocountOverLastWeek() {
        let authToken = localStorage.getItem("authToken");

        fetch(apiMoodportfolio + '/AdminQuery', {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            withCredentials: true,
            credentials: "same-origin",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                                  'basedOn': "any",
                                  'splSQLQuery' : " SELECT Date(), count(photoID) FROM Photo GROUP BY DATE();",
                                })
        })
        .then((res) => res.json())
        .then(json => {
            console.log(json)
            if(json.success){
                //result is the answer.
                this.setState({mostPopularTag: json.result})
            } else {
                this.setState({error: json.error})
            }
        })
    }


    //Render web page
    render() {
      return (
          <div className = "text-center homePageContainer">
            <br></br>
            <br></br>
            <div className = "basicData">
                <div>
                  <p>Number of users registered : 4</p>

                </div>
                <div>
                    <p>Most popular tag: football</p>
                </div>
                <div>
                    <p>Most popular location : GB</p>
                </div>
            </div>
            <div className = "basicData text-center">
                <p>List of users</p>
                <ul className = "userList text-center">
                    <li className = "userInList"> Rahul K. </li>
                    <li className = "userInList"> Phill B.</li>
                    <li className = "userInList"> Thepnathi C.</li>
                    <li className = "userInList"> Matt H.</li>
                </ul>
                <Button variant="outline-danger" >
                    Delete Account
                </Button>

                <Button variant="outline-dark" type="submit">
                    <Link to="">Promote User</Link>
                </Button>
            </div>
            <div className = "photosOverTime">
                <p>How many photos have been uploaded over the last week</p>
            </div>
          </div>
      );
    }
  }
=======
