import React, { Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';

import '../../node_modules/font-awesome/scss/font-awesome.scss';

import Loader from './layout/Loader'
import Aux from "../hoc/_Aux";
import ScrollToTop from './layout/ScrollToTop';
import routes from "../route";

import ProtectedRoute from '../Demo/Authentication/ProtectedRoute';
//import UserService from '../Demo/services/user.service'
//import AuthService from '../Demo/services/auth.service';

const AdminLayout = Loadable({
    loader: () => import('./layout/AdminLayout'),
    loading: Loader
});

const App = (props) => {
    //const [ authState, setAuthState ] = React.useState({user: ''});
/*
    React.useLayoutEffect(() => {
        async function getAuthState() {
            const isUser = await UserService.getUserBoard();
            if (isUser === null) {                 
                return isUser //setAuthState({user: ''});                                       
            } else {
            const user = await AuthService.getCurrentUser()      
                return user// setAuthState({user});
            }            
        }
        getAuthState().then((user) => {
            //console.log(user)
            return setAuthState({user});
        });
    }, []);

  */  

    const menu = routes.map((route, index) => {
        return (route.component) ? (
            <Route
                key={index}
                path={route.path}
                exact={route.exact}
                name={route.name}
                render={props => (
                    <route.component {...props} />
                )} />
        ) : (null);
    });
    //console.log(authState.user)
    return (
        <Aux>
            <ScrollToTop>
                <Suspense fallback={<Loader/>}>
                    <Switch>
                        {menu}
                        <ProtectedRoute exact path="/" name="AdminLayout" component={props => <AdminLayout {...props} /> } />
                        <ProtectedRoute name="AdminLayout" component={props => <AdminLayout {...props} /> } />
                    </Switch>
                </Suspense>
            </ScrollToTop>
        </Aux>
    );

}
//this.props.history.push('/auth/signIn-1');            
//return window.location.reload();            
export default App;
