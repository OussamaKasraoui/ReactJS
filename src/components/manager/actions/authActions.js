import axios              from "axios";
import setAuthToken       from "../utils/setAuthToken";
import jwt_decode         from "jwt-decode";
import {GET_ERRORS,
        SET_CURRENT_USER,
        USER_LOADING}     from "./types";

// Register User
export const registerUser = (userData, successful) => dispatch => {
  axios.post("/api/register", userData)
       .then(res => {
        let status = res.data.status;
        let response = res.data.response;
        
        // if cridentials are valid But Email is already taken
        if(status === 'exist'){
          throw {
            'status' : status, // in case  'exist'
            'response': {
                'key': response.key,
                'value': response.value               
            }
          };
        }else if(status === 'error'){
          throw {
            'status': status, // in case   'error'
            'response': response
          };
        
        // re-direct to login on successful register
        }else if(status === 'save'){
          if(userData.email){
            
            //return history.push('/space', userData.email);
            successful(userData.email);
          }else{
            console.log ('Error in authActions Line }else if(status === \'save\'){');
            return alert('Error in authActions Line }else if(status === \'save\'){');
          }
        }             
       }) 
       .catch(err =>{
          let status = '';
          let response= '';
          
          if(typeof err === "object" && err.name === "Error"){
            status = 'error';
            response= { errors : [{
                          msg: err.message,
                          param: "end"
                        }]
            };
          }else if (typeof err === "object" && err.response.name === "MongoError"){
            switch(err.response){
              case 11000:
                status = 'error';
                response= { errors : [{
                              msg: 'please singup using another email',
                              param: "email"
                            }]
                };
              break;

              default:
                status = 'error';
                response= { errors : [{
                              msg: err.response.errmsg,
                              param: "end"
                            }]
                };
              break;
            }
          }else{
            status = err.status;
            response= err.response;
          }
         

          let error = '';

          // case where Email is already taken
          if(status === 'exist'){
            error = { 
              key : response.key,
              value : response.value
            };
          
          // case where internal server error
          // OR         input values are invalid
          }else if(status === 'error'){
            error = response.errors;
          }
          
          // let redux handle errors
          dispatch({
            type: GET_ERRORS,
            payload: error
          });
                          
        });
};

// Login - get user token
export const loginUser = userData => dispatch => {

  axios.post("/api/login", userData)
       .then(res => {

          let status = res.data.status;
          let response = res.data.response;

          if(status === 'success'){
            // Save token to localStorage
            const token = response;
            localStorage.setItem("jwtToken", token);
            // Set token to Auth header
            setAuthToken(token);
            // Decode token to get user data
            const decoded = jwt_decode(token);
            // Set current user
            dispatch(setCurrentUser(decoded));
          }else{
            throw {
              response : {
                data :{
                  status : 'error',
                  response: response
                }
              }
            };
          }
      })            
       .catch(err => {
          dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
    });
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};

// Reset user's password
export const resetUser = (userData,success) => dispatch => {
    axios.post("/api/reset", userData)
       .then(res =>{
          console.log('res = '+ JSON.stringify(res));

          let status = res.data.status;
          let response = res.data.response;

          if(status === 'success'){
            // Save token to localStorage
            const token = response;
            localStorage.setItem("jwtToken", token);
            // Set token to Auth header
            setAuthToken(token);
            // Decode token to get user data
            const decoded = jwt_decode(token);
            // Set current user
            dispatch(setCurrentUser(decoded));

            // notify user success = true
            success(status, response);
          }else if('incorrect'){
            success(status, response);
          }else{
            throw {
              response : {
                data :{
                  status : 'error',
                  response: response
                }
              }
            };
          }
       })
       .catch(err => {
          console.log('err = '+ JSON.stringify(err));
       });
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};
