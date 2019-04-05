import React from 'react'
import ReactDOM from 'react-dom'
import {withFormik, Form, Field} from 'formik'
import App from '../App'
import Register from './Register'
import logo from '../images/logo.png'
import '../stylesheet/register.css'



function redirectToRegister() {
  ReactDOM.render(
    <Register />,
    document.getElementById('root')
  ); 
}

const LoginApp = ({
  values,
  errors
}) => (
  <div>
    <Form className="formBody">
      <img id="registerLogo" src={logo} alt="Moodportfol.io Logo"/>
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

      <button type="submit">Submit</button>

    </Form>

    <label>No account?</label>
    <button type="submit" onClick={redirectToRegister}>Sign up!</button>

  </div>
)


const Login = withFormik ({
    mapPropsToValues({name, email, password}) {
        return {
            email: email || '',
            password: password ||''
        }
    },

    handleSubmit(values) {
        fetch('http://localhost:5000/api/Login', {
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
            sessionStorage.setItem("authToken", json.authToken);
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