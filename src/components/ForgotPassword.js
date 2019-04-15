import React from 'react'
import ReactDOM from 'react-dom'
import {withFormik, Form, Field} from 'formik'
import * as Yup from 'yup'
import App from '../App'
import {apiMoodportfolio} from '../App'
import Login from './Login'
import Header from './Header'
import '../stylesheet/register.css'
import logo from '../images/logo.png'
import Button from 'react-bootstrap/Button';

let buttonDisabled = false;

function redirectToLogin() {
  ReactDOM.render(
    <Login />,
    document.getElementById('root')
  );
}

const FormApp = ({
  values,
  errors,
  touched
}) => (
  <div>
    <Form className="formBody">
      <img id="registerLogo" src={logo} alt="Moodportfol.io Logo"/>
      </Form>
      <Form class="text-center inputForm">

      {/* touched.* makes sure that errors are checked only once the fiels is left */}
      <div>
        <Field className="field"
          type="email"
          name="email"
          placeholder="Your Email"/>
          {touched.email && errors.email && <p> {errors.email}</p>}
      </div>
      <Button
          type="submit"
          variant="primary"
          disabled={buttonDisabled}
      >
          {buttonDisabled ? 'Wait...' : 'Send'}
      </Button>
      <br></br>
      <label>A reset password link will be sent to your email.</label>
      <div id = "altButtonContainer">
        <label>Remembered your password?</label>
        <Button
         className = "altButton"
         variant="light"
         size = "sm"
         onClick={redirectToLogin}>Log in!</Button>

      </div>
    </Form>
  </div>

)


const ForgotPassword = withFormik ({
    mapPropsToValues({email}) {
        return {
            email: email || '',
        }
    },

    validationSchema: Yup.object().shape({
    email: Yup.string()
              .email('Email not valid')
              .max(100)
              .required('Email is required')
              .test("checkEmail", "Email doesn't exist",
                async function(email) {
                  const res = await fetch(apiMoodportfolio + '/UserExists', {
                    method: "POST",
                    mode: "cors",
                    cache: "no-cache",
                    credentials: "same-origin",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ 'email': email })
                  });
                  const res_1 = await res.json();
                  return res_1.exists;
                }),
    }),

    handleSubmit(values) {
        buttonDisabled = true;
        fetch(apiMoodportfolio + '/ResetPassword', {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({'email' : values.email})
        })
        .then((res) => res.json())
        .then(json => {
          buttonDisabled = false;
          console.log(json)
          ReactDOM.render(
            <Login />,
            document.getElementById('root')
          );
        })
    }
}) (FormApp)

export default ForgotPassword
