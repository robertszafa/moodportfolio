import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import Jumbotron from 'react-bootstrap/Jumbotron'
import {withFormik, Form, Field} from 'formik'
import {Datepicker} from 'react-formik-ui'
import * as Yup from 'yup'
import {passwordRegex} from './Register'
import {apiMoodportfolio} from '../App'


export default class ChangePassword extends Component {
    constructor(props) {	
		super(props);
	}

    componentDidMount() {
        const { resetToken } = this.props.match.params
    }

    render () {
        return(
            <Jumbotron>
                <PasswordApp/>
            </Jumbotron>
        )
  }
}



const PasswordForm = props => {
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
  } = props;

  return (
      <div>
        <div class="page-header">
            <h1 class="text-center">
                Change Password
            </h1>
        </div>


        <div>
            <Form class="text-center" onSubmit={handleSubmit}>
                <div>
                    <Field className="field"
                        type="password"
                        name="currentPassword"
                        placeholder="Current Password"/>
                </div>

                <div>
                    <Field className="field"
                        type="password"
                        name="password"
                        placeholder="New Password"/>
                        {touched.password && errors.password && <p> {errors.password}</p>}
                </div>

                <div>
                    <Field className="field"
                        type="password"
                        name="repeatPassword"
                        placeholder="Repeat New Password"/>
                        {touched.repeatPassword && errors.repeatPassword && <p> {errors.repeatPassword}</p>}
                </div>

                <Button
                    variant="primary"
                    type="submit"
                >
                    Save      
                </Button>
            </Form>
        </div>
    </div>
  );
};

const PasswordApp = withFormik({
  mapPropsToValues: props => ({ 
        currentPassword: '',
        password: '',
        repeatPassword: '',
  }),

  validationSchema: Yup.object().shape({
        password: Yup.string()
                     .min(8, 'Password must be 8 characters or longer')
                     .max(100, 'Password must be shorter than 100 characters')
                     .matches(passwordRegex, 'Password must have a number, capital letter and a special character.'),
        repeatPassword: Yup.string()
                     .min(8, 'Password must be 8 characters or longer')
                     .max(100, 'Password must be shorter than 100 characters')
                     .oneOf([Yup.ref('password'), null], "Passwords don't match")
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
})(PasswordForm);

