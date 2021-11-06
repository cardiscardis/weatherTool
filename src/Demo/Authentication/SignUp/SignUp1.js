import React, { useState, useEffect } from 'react';
import {NavLink} from 'react-router-dom';
import { Formik } from 'formik';

import './../../../assets/scss/style.scss';
import Aux from "../../../hoc/_Aux";
import Breadcrumb from "../../../App/layout/AdminLayout/Breadcrumb";
//import DEMO from "../../../store/constant";


import AuthService from "../../services/auth.service";
import UserService from '../../services/user.service.js'
import {
    minMaxLength,
    validEmail,
    passwordStrength, 
  } from '../Validation';


const SignUp1 = (props) => {    
    const [ user, setUser ] = useState();
    
    useEffect(() => {
        async function fetchData() {
            await UserService.getUserBoard().then(async () => {                                
                const user = await AuthService.getCurrentUser();
                setUser(user);        
            }, () => {
                props.history.push("/auth/signin-1");
                window.location.reload();
            });      
        }
        fetchData();
      }, [props]);

    return(
        <Aux>
            <Breadcrumb/>
            <div className="auth-wrapper">
                <div className="auth-content">
                    <div className="auth-bg">
                        <span className="r"/>
                        <span className="r s"/>
                        <span className="r s"/>
                        <span className="r"/>
                    </div>
                    <div className="card">
                        <div className="card-body text-center">
                            <div className="mb-4">
                                <i className="feather icon-user-plus auth-icon"/>
                            </div>
                            <h3 className="mb-4">{user? 'Welcome':'Sign up'}</h3>

                            {!user? <Formik
                                initialValues={{ firstname: '', lastname: '', username: '',  email: '', password: '', message: '' }}
                                validate={values => {
                                    const errors = {};
                                    if (!values.email || validEmail(values.email)) {
                                        errors.email = 'It seems the email address you entered is invalid';                                        
                                    } else {
                                        delete errors.email;
                                    }

                                    if (minMaxLength(values.firstname, 3)) {
                                        errors.firstname = `First Name should have minimum 3 characters`;                                          
                                    } else {
                                        delete errors.firstname;
                                    }

                                    if (minMaxLength(values.lastname, 3)) {
                                        errors.lastname = `Last Name should have minimum 3 characters`;                                          
                                    } else {
                                        delete errors.lastname;
                                    }

                                    if (minMaxLength(values.username, 3)) {
                                        errors.username = `User Name should have minimum 3 characters`;                                          
                                    } else {
                                        delete errors.username;
                                    }

                                    if (minMaxLength(values.password, 6)) {
                                        errors.password = 'Password should have minimum 6 characters';
                                    } else if (passwordStrength(values.password)) {
                                        errors.password =
                                            'Password is not strong enough. Include an upper case letter, a number or a special character to make it strong';
                                    } else {
                                        delete errors.password;
                                    }

                                    return errors;
                                }}
                                
                                onSubmit={async (values, { setSubmitting }) => {
                                    setSubmitting(true);
                                    await AuthService.register(
                                        values.username,
                                        values.email,
                                        values.password
                                    ).then(
                                        response => {                                         
                                            values.message = response.data.message;
                                            /*props.history.push("/");
                                            window.location.reload();*/
                                            setUser(response);
                                        }, error => {
                                            const resMessage =
                                              (error.response &&
                                                error.response.data &&
                                                error.response.data.message) ||
                                              error.message ||
                                              error.toString();
                                                
                                              setSubmitting(false);                                              
                                              values.message = resMessage;                                                                                          
                                        }
                                    );
                                }}
                                >
                                {({
                                    values,
                                    errors,
                                    touched,                                    
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    isSubmitting,
                                    /* and other goodies */
                                }) => (
                            <form onSubmit={handleSubmit}>    
                                <div className="input-group mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="firstname"
                                        placeholder="First name"      
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.name}
                                    />                                    
                                      {errors.firstname && touched.firstname && errors.firstname}                                                                            
                                </div>
                                <div className="input-group mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="lastname"
                                        placeholder="Last name"                                            
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.lastname}
                                    />  
                                     {errors.lastname && touched.lastname && errors.lastname}                                                                           
                                </div>
                                <div className="input-group mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        placeholder="Username"                                            
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.username}
                                    />                                                                                                                                                        
                                      {errors.username && touched.username && errors.username}                                                                                                                                     
                                </div>
                                <div className="input-group mb-3">
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        placeholder="Email"                                            
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                    />                                                                                                                
                                    {errors.email && touched.email && errors.email}
                                </div>
                                <div className="input-group mb-4">
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        placeholder="Password"                                            
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                    />                                        
                                      {errors.password && touched.password && errors.password}                                                                            
                                </div>
                                {/*<div className="form-group text-left">
                                    <div className="checkbox checkbox-fill d-inline">
                                        <input 
                                        type="checkbox" 
                                        name="checkboxNews" 
                                        id="checkbox-fill-2" 
                                        // value={values.checkboxNews}  
                                        //onChange={handleChange}
                                        //onBlur={handleBlur}
                                        />
                                            <label htmlFor="checkboxNews" className="cr">Send me the <a href={DEMO.BLANK_LINK}> Newsletter</a> weekly.</label>
                                    </div>
                                </div>*/}
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-block"
                                    disabled={Object.keys(errors).length > 0}
                                >
                                    {isSubmitting && (
                                    <span className="spinner-border spinner-border-sm"></span>
                                    )}
                                    <span>Sign Up</span>
                                </button>
                                {values.message && (
                                <div className="form-group">
                                    <div
                                    className={"alert alert-danger"}
                                    role="alert"
                                    >
                                    {values.message}
                                    </div>
                                </div>
                                )}
                                {/*<button className="btn btn-primary shadow-2 mb-4">Sign up</button>*/}
                                <p className="mb-0 text-muted">Already have an account? <NavLink to="/auth/signin-1">Login</NavLink></p>                                    
                            </form>
                                )}
                                </Formik> 
                                : <button className="btn btn-primary btn-block" onClick={() => {
                                    props.history.push("/auth/signin-1");
                                    window.location.reload();
                                    }}>Click Here to Log In
                                </button>}
                        </div>
                    </div>
                </div>
            </div>
        </Aux>
    );
    
}

export default SignUp1;