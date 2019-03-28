import React from 'react'
import {withFormik, Form, Field} from 'formik'
import * as Yup from 'yup'

const passwordRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*)(?=.*[@$!.%*?&])[A-Za-z@$!%*?&]');


const App = ({
  values,
  errors,
  touched
}) => (
  <Form>

    <div>
      <Field 
        name="name"
        placeholder="Your Name"/>
        <br/>
    </div>

    {/* touched.* makes sure that errors are checked only once the fiels is left */}
    <div> {touched.email && errors.email && <p> {errors.email}</p>}
      <Field
        type="email" 
        name="email" 
        placeholder="Your Email"/>
        <br/>
    </div>

    <div>{touched.password && errors.password && <p> {errors.password}</p>}
    <Field
      type="password"
      name="password"
      placeholder="Your Password"/>
      <br/>
    </div>

    <button type="submit">Submit</button>
  </Form>
)


const Registration = withFormik ({
    mapPropsToValues({name, email, password}) {
        return {
            email: email || '',
            password: password ||'',
            name: name || ''
        }
    },

    validationSchema: Yup.object().shape({
    // TODO: asynchronously check if email exists
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
        fetch('http://localhost:5000/api/Register', {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, cors, *same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({'name' : values.name,
                                'email' : values.email,
                                'password' : values.password})
        })
        .then(function(res) {
          console.log(res.json())
        })
    }
}) (App)

export default Registration