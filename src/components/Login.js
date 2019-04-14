import React from 'react'
import ReactDOM from 'react-dom'
import {withFormik, Form, Field} from 'formik'
import App from '../App'
import {apiMoodportfolio} from '../App'
import Register from './Register'
import ForgotPassword from './ForgotPassword'
import logo from '../images/logo.png'
import '../stylesheet/register.css'
import { Button } from 'react-bootstrap'



function redirectToRegister() {
  ReactDOM.render(
    <Register />,
    document.getElementById('root')
  ); 
}

function redirectToForgotPassword() {
  ReactDOM.render(
    <ForgotPassword />,
    document.getElementById('root')
  ); 
}


const LoginApp = ({
  values,
  errors
}) => (
  <div>
    <Form className="formBody" class="text-left">
      {/* <img id="registerLogo" src={logo} alt="Moodportfol.io Logo"/> */}
    </Form>

    <Form class="text-center">
      <div>
        <Field className="field"
          type="email" 
          name="email" 
          placeholder="Your Email"/>
      </div>

      <div>
      <Field className="field"
        type="password"
        name="password"
        placeholder="Your Password"/>
      </div>

      <Button type="submit" variant="primary" size="lg">Login</Button>
      <br></br>
      <br></br>
      

      <label>Forgot password?</label>
      <br></br>
      
      <Button type="submit" variant="primary" size="lg" onClick={redirectToForgotPassword}>Reset password</Button>

      <br></br>
      <br></br>
      <br></br>

    <label>No account?</label>
    <br></br>
    <Button type="submit" variant="primary" size="lg" onClick={redirectToRegister}>Sign up!</Button>

    </Form>

  </div>
)


const Login = withFormik ({
    mapPropsToValues({email, password}) {
        return {
            email: email || '',
            password: password || '',
        }
    },

    handleSubmit(values) {
        fetch(apiMoodportfolio+ '/Login', {
          method: "POST", 
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({'email' : values.email, 'password' : values.password})
        })
        .then((res) => res.json())
        .then(json => {
          if (json.loggedIn) {
            localStorage.setItem("authToken", json.authToken);
            ReactDOM.render(
              <App />,
              document.getElementById('root')
            );
          }
          else {
            alert(json.error);
          }
        })
    }
}) (LoginApp)

export default Login
