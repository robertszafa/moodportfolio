import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import Jumbotron from 'react-bootstrap/Jumbotron'
import {withFormik, Form, Field} from 'formik'
import {Datepicker} from 'react-formik-ui'
import * as Yup from 'yup'
import {passwordRegex} from './Register'
import {apiMoodportfolio} from '../App'


export default class Profile extends Component {
    constructor(props) {
		super(props);
		this.state = {
            userData: '',
		};
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
            <ProfileApp userData={this.state.userData}/>
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
    <div class= "inputForm">
        <div class="page-header">
            <h1 class="text-center">
                Personal Profile
            </h1>
        </div>
        <p id="name">{props.userData.name}</p>


        <div>
            <Form class="text-center" onSubmit={handleSubmit}>

                <div>
                <Field className="field"
                    type="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="email"
                    disabled={true}
                    value={props.userData.email}/>
                    {touched.email && errors.email && <p>{errors.email}</p>}
                <p>Email address</p>
                </div>

                <div>
                <Field className="field"
                    type="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.nominatedContact}
                    name="nominatedContact"
                    placeholder={props.userData.nominatedContact}/>
                    {touched.nominatedContact && errors.nominatedContact && <p>{errors.nominatedContact}</p>}
                <p>Contact Email address</p>
                </div>

                <div>
                <Field className="field"
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.country}
                    name="country"
                    placeholder={props.userData.country}/>
                    {touched.country && errors.country && <p>{errors.country}</p>}
                <p>Country</p>
                </div>

                <div>
                <Field className="field"
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.townCity}
                    name="townCity"
                    placeholder={props.userData.townCity}/>
                    {touched.townCity && errors.townCity && <p>{errors.townCity}</p>}
                <p>City</p>
                </div>

                <div>
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
                <p>Date of birth</p>
                </div>

                <div>
                <select
                    name="gender"
                    value={values.gender}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{ display: 'block' }}
                >
                    {/* ISO/IEC 5218 standard */}
                    <option value="0" label="" />
                    <option value="1" label="Male" />
                    <option value="2" label="Female" />
                    <option value="9" label="Other" />
                </select>
                <p>Gender</p>
                </div>

                <div>
                <Field className="field"
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={props.userData.signupDate}
                    name="signupDate"
                    disabled={true}/>
                    {touched.signupDate && errors.signupDate && <p>{errors.signupDate}</p>}
                <p>Member since</p>
                </div>

                <Button
                    variant="primary"
                    type="submit"
                >
                    Save
                </Button>
            </Form>

            <br></br>
            <div class="text-center">
                <Button
                    variant="secondary"
                    type="submit"
                >
                    Change password
                </Button>
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
