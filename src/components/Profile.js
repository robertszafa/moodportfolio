import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import { Button } from 'react-bootstrap'
import Jumbotron from 'react-bootstrap/Jumbotron'
import {withFormik, Form, Field} from 'formik'
import {Datepicker} from 'react-formik-ui'
import matt from '../images/Gareth.jpg'
import * as Yup from 'yup'
import {passwordRegex} from './Register'
import {apiMoodportfolio} from '../App'
import RecentPhotos from './RecentPhotos'


export default class Profile extends Component {
    constructor(props) {
		super(props);
		this.state = {
            userData: '',
        };
        // this.onChangePassword = this.onChangePassword.bind(this);
	}

    componentDidMount() {
        let authToken = localStorage.getItem("authToken");
        fetch(apiMoodportfolio + '/UserInfo', {
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

    render () {
        return(
    <div id="inputForm">
            <ProfileApp userData={this.state.userData}/>
    </div>
        )
  }
}



const ProfileForm = props => {
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
  } = props;

  return (
    <div class= "profile">
        <div class="page-header">
            <h1 class="text-center"> Personal Profile </h1>
            <br></br>
        </div>
        <div class = "ProfileContainer row">
            <div class = "col-sm-6  text-center profileLeft">
                <h3>Diary entries</h3>
                    <RecentPhotos limit={5}/>
            </div>
            <div class = "col-sm-6 profileRight">
                <h5 id="name">{props.userData.name}</h5>
                <Form onSubmit={handleSubmit}>
                    <div>
                        <p>Email address</p>
                        <Field className="field"
                            type="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="email"
                            disabled={true}
                            value={props.userData.email}/>
                            {touched.email && errors.email && <p>{errors.email}</p>}
                    </div>
                    <br></br>
                    <div>
                        <p>Contact Email address</p>
                        <Field className="field"
                            type="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.nominatedContact}
                            name="nominatedContact"
                            placeholder={props.userData.nominatedContact}/>
                            {touched.nominatedContact && errors.nominatedContact && <p>{errors.nominatedContact}</p>}
                    </div>
                    <br></br>

                    <div>
                        <p>Country</p>
                        <Field className="field"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.country}
                            name="country"
                            placeholder={props.userData.country}/>
                            {touched.country && errors.country && <p>{errors.country}</p>}
                    </div>
                    <br></br>
                    <div>
                        <p>City</p>
                        <Field className="field"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.townCity}
                            name="townCity"
                            placeholder={props.userData.townCity}/>
                            {touched.townCity && errors.townCity && <p>{errors.townCity}</p>}
                    </div>
                    <br></br>
                    <div>
                        <p>Date of birth</p>
                        <Datepicker className="field"
                            yearDropdownItemNumber={100}
                            showYearDropdown
                            showMonthDropdown
                            scrollableYearDropdown
                            dateFormat="dd/MM/yyyy"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={props.userData.dob || values.dob}
                            name="dob"
                            maxDate={(new Date())}
                            disabled={props.userData.dob}
                            placeholder={!props.userData.dob && "Click to select"}/>
                            {touched.dob && errors.dob && <p>{errors.dob}</p>}
                    </div>
                    <br></br>
                    <div>
                        <p>Gender</p>
                        <select
                            id = "genderSelect"
                            name="gender"
                            value={values.gender}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            style={{ display: 'block' }}
                        >
                            {/* ISO/IEC 5218 standard */}
                            <option selected> {props.userData.gender} </option>
                            {/* <option value="0" label="Not known"/> */}
                            <option value="1" label="Male"/>
                            <option value="2" label="Female"/>
                            <option value="9" label="Other"/>
                        </select>
                        <br></br>
                        <p>Member since</p>
                        <Field className="field"
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={props.userData.signupDate}
                            name="signupDate"
                            disabled={true}/>
                            {touched.signupDate && errors.signupDate && <p>{errors.signupDate}</p>}
                    </div>
                    <Button variant="primary" type="submit">
                      Save
                    </Button>
                    <br></br>
                    <br></br>
                    <div class="text-center">
                    <Button variant="outline-danger" type="submit">
                        <Link to="">Delete Account</Link>
                    </Button>
                    <Button variant="outline-dark" type="submit">
                        <Link to="/change-password">Change password</Link>
                    </Button>
                    <br></br>
                    </div>
                  </Form>
            </div>
        </div>
    </div>
  );
};

const ProfileApp = withFormik({
  mapPropsToValues: props => ({
        country: '',
        townCity: '',
        dob: '',
        gender: '',
        nominatedContact: '',
  }),

  validationSchema: Yup.object().shape({
        password: Yup.string()
                     .min(8, 'Password must be 8 characters or longer')
                     .max(100, 'Password must be shorter than 100 characters')
                     .matches(passwordRegex, 'Password must have a number, capital letter and a special character.'),
        nominatedContact: Yup.string()
                             .email('Email not valid')
                             .max(100),
    }),

  handleSubmit: (values, { setSubmitting }) => {
    let authToken = localStorage.getItem("authToken");
    fetch(apiMoodportfolio + '/UserInfo', {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Authorization": authToken,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values)
    })
    .then((res) => res.json())
    .then(json => {
        console.log("json\n ", json);
        setSubmitting(false);
    })

  },

  displayName: 'BasicForm',
})(ProfileForm);
