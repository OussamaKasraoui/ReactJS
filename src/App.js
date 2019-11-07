import React, { Component }       from "react";
import {Route, Switch}            from 'react-router-dom';
import { connect }                from "react-redux";
import jwt_decode                 from 'jwt-decode';
import PropTypes                  from "prop-types";
import Navbar                     from './components/core/nav';
import Footer                     from './components/core/footer';
import store                      from './components/manager/store';
import setAuthToken               from './components/manager/utils/setAuthToken';
import PrivateRoute               from './components/prv/PrivateRoute';
import Space                      from './components/login/space';
import Nearby                     from './components/login/nearby';
import Preferred                  from './components/login/preferred';
import Home                       from './components/core/home';
import Shops                      from './components/login/shops';
import User                       from './components/login/user';
import { setCurrentUser,
        logoutUser }              from './components/manager/actions/authActions';


// Check for token to keep user logged in
if (localStorage.jwtToken) {

  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);

  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));// Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  
  if (decoded.exp < currentTime) {
  
    // Logout user
    store.dispatch(logoutUser());    // Redirect to login
    window.location.href = "./space";
  }
}

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      auth: this.props.auth
    };
  }

  render(){
    return(
      <React.Fragment>
        <div className='container'>
          <Navbar />
          <Switch>
            <Route        path="/"          component={Home}      exact />
            <Route        path="/home"      component={Home}      exact />
            <Route        path="/space"     component={Space}     exact />
            <PrivateRoute path="/shops"     component={Shops}     exact />
            <PrivateRoute path="/nearby"    component={Nearby}    exact />
            <PrivateRoute path="/preferred" component={Preferred} exact />
            <PrivateRoute path="/user"      component={User}      exact />
            <Route                          component={() => {return <h1>Hoomie what are you doing here (~ _-) its Four 0 Four !</h1> }} />
          </Switch>
          <Footer />
        </div>
      </React.Fragment>
    );
  }
}


App.propTypes = { 
                  auth: PropTypes.object.isRequired
                };

const mapStateToProps = state => ({ 
                                    auth: state.auth
                                  });



export default connect(mapStateToProps,{ App })(App);