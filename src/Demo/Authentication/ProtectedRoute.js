import React from 'react';
import { Route, Redirect } from 'react-router-dom';

//import UserService from '../Demo/services/user.service'
import AuthService from '../services/auth.service';

const ProtectedRoute = ({component: Component, ...rest }) => {    

    const authState = AuthService.getCurrentUser()
    return (
        <Route {...rest} render={props => (
           authState !== null ? (
               <Component {...props} />               
           ) : (
                <Redirect to={{ pathname: '/auth/signIn-1', state: {from: props.location}}}  />
            )
            )} //path={props.path} exact={props.exact} component={props.component} />
        />
    )
};

export default ProtectedRoute;