import React from 'react'
import {withFormik, Form, Field} from 'formik'
import * as Yup from 'yup'
import logo from './logo.png'
import '../stylesheet/register.css'

const passwordRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!.%*?&])[A-Za-z\d@$!%*?&]');


const App = ({
  values,
  errors,
  touched
}) => (
  <Form className="formBody">
      <img id="registerLogo" src={logo} alt="Moodportfol.io Logo"/>
    <div>
      <Field className="field"
        name="name"
        placeholder="Your Name"/>
        {touched.name && errors.name && <p>{errors.name}</p>}
    </div>

    {/* touched.* makes sure that errors are checked only once the fiels is left */}
    <div>
      <Field className="field"
        type="email" 
        name="email" 
        placeholder="Your Email"/>
        {touched.email && errors.email && <p> {errors.email}</p>}
    </div>

    <div>
    <Field className="field"
      type="password"
      name="password"
      placeholder="Your Password"/>
      {touched.password && errors.password && <p> {errors.password}</p>}
    </div>

    <button type="submit">Submit</button>
  </Form>
)


const Registration = withFormik ({
  // Same as handleChange
    mapPropsToValues({name, email, password}) {
        return {
            email: email || '',
            password: password ||'',
            name: name || ''
        }
    },

    validationSchema: Yup.object().shape({
    // TODO: asynchronously check if email exists
    name: Yup.string() 
              .min(3, 'Name must be 3 characters or longer')
              .max(60, 'Name must be shorter than 60 characters')
              .required('Name is required'),
    email: Yup.string()
              .email('Email not valid')
              .max(100)
              .required('Email is required'),
    password: Yup.string()
                 .min(8, 'Password must be 8 characters or longer')
                 .max(100, 'Password must be shorter than 200 characters')
                 .matches(passwordRegex, 'Password must have a number, capital letter and a special character.')
                 .required('Password is required')
    }),
    
    handleSubmit(values) {
        // TODO //
        // send request to server using fetch()
        // -> need to figure out CORS (Cross Origin Resource Sharing)
        
        // let headers = new Headers();
        // // headers.append('Content-Type', 'application/json');
        // // headers.append('Accept', 'application/json');
        // // headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
        // // headers.append('Access-Control-Allow-Credentials', 'true');
        // // headers.append('POST', 'OPTIONS');

        // (async () => {
        //     const rawResponse = await fetch('http://localhost:5000/api/user/register', {
        //       method: 'POST',
        //     //   mode: 'cors',
        //     //   headers: headers,
        //       contentType: "application/json",
        //       body: JSON.stringify({"name": values.name, "email": values.email, "password": values.password})
        //     });
        //     const content = await rawResponse.json();
        
        //     console.log(content);
        //   })();
    }
}) (App)

export default Registration