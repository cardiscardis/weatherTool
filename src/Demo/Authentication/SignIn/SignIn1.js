import React from 'react';
import {NavLink} from 'react-router-dom';
import { Formik } from 'formik';

import './../../../assets/scss/style.scss';
import Aux from "../../../hoc/_Aux";
import Breadcrumb from "../../../App/layout/AdminLayout/Breadcrumb";

import AuthService from "../../services/auth.service";
import {
    minMaxLength,
//    validEmail,
    passwordStrength, 
} from '../Validation';

const SignIn1 = (props) => {     
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
                                <i className="feather icon-unlock auth-icon"/>
                            </div>
                            <h3 className="mb-4">Login</h3>
                            <Formik
                                initialValues={{ username: '', password: '', message: '' }}
                                validate={values => {
                                    const errors = {};
                                    
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
                                        await AuthService.login( values.username, values.password).then(
                                        () => {
                                            props.history.push("/");
                                            window.location.reload();
                                        },
                                        error => {
                                          const resMessage =
                                            (error.response &&
                                              error.response.data &&
                                              error.response.data.message) ||
                                            error.message ||
                                            error.toString();  
                                          
                                          values.message = resMessage; 
                                          setSubmitting(false);                                       
                                    });                                    
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
                                    placeholder="Username"
                                    name="username"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.username}
                                    />                                  
                                {errors.username && touched.username && errors.username}                                  
                            </div>
                            <div className="input-group mb-4">
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    placeholder="password"
                                    name="password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}/>                                    
                                {errors.password && touched.password && errors.password}                                    
                            </div>
                            {/*<div className="form-group text-left">
                                <div className="checkbox checkbox-fill d-inline">
                                    <input type="checkbox" name="checkbox-fill-1" id="checkbox-fill-a1" />
                                        <label htmlFor="checkbox-fill-a1" className="cr"> Save credentials</label>
                                </div>
                            </div>*/}
                            <button 
                                type="submit" 
                                className="btn btn-primary shadow-2 mb-4"                                
                                disabled={isSubmitting}
                            >   
                                {isSubmitting && (
                                    <span className="spinner-border spinner-border-sm"></span>
                                )}
                                <span>Login</span>                                
                            </button>
                            {values.message && (
                                <div className="form-group">
                                  <div className="alert alert-danger" role="alert">
                                    {values.message}
                                  </div>
                                </div>
                              )}
                            </form>                            
                            )}
                            </Formik>
                            <p className="mb-2 text-muted">Forgot password? <NavLink to="/auth/reset-password-1">Reset</NavLink></p>
                            <p className="mb-0 text-muted">Don’t have an account? <NavLink to="/auth/signup-1">Signup</NavLink></p>
                        </div>
                    </div>
                </div>
            </div>
        </Aux>
    );
}

export default SignIn1;