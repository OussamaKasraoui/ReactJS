import React, { Component}    from "react";
import { connect }            from "react-redux";
import { Button, Row }        from "reactstrap";
import PropTypes              from "prop-types";
import classnames             from "classnames";
import { withRouter }         from 'react-router-dom';
import { registerUser }       from "../manager/actions/authActions";
import loginImg               from "../../img/programmer.svg";

class Register extends Component {
  constructor(props) {
        super(props);
        this.state = {
                firstName: undefined,
                lastName: undefined,
                email: undefined,
                password:undefined,
                confirmPassword:undefined,
                errors: undefined
    };
    this.onChange = this.onChange.bind(this);
    this.onsubmit = this.onsubmit.bind(this);
  }

  // errors from authActions are expected here
  componentWillReceiveProps(nextProps) {

    this.errorControl(nextProps.errors);
  }
    
  // Link inputs to states
  onChange(event ){
      
    this.setState({[event.target.name] : event.target.value});
  }
  
  // comparing Passwor === confirmPassword
  // then submit credentials to authActions
  onsubmit(e){
    e.preventDefault();

    if(this.state.password === this.state.confirmPassword){
      const newUser = {
        'firstName': this.state.firstName,
        'lastName': this.state.lastName,
        'email': this.state.email,
        'password': this.state.password,
        'confirmPassword': this.state.confirmPassword
      };

      this.props.registerUser(newUser, this.props.successRegister);  
      
    }else{
      this.setState({
        errors : {
          confirmPassword : "supplied Passwords are not much"
        }
      });
    }
  }

  // managing errors Origine and where to show up
  errorControl(err){
    let retError = [];

    // case where ERRor is related to Backend
    if(typeof err === 'string'){
      retError = err;
      
    // case where ERRor is related to user (invalid inputs)  
    }else if(Array.isArray(err)){
      
      err.map(_err =>{
        switch (_err.param){
          case 'firstName':
              retError[_err.param] = _err.msg;
          break;
          
          case 'lastName':
              retError[_err.param] = _err.msg;
          break;
          
          case 'email':
              retError[_err.param] = _err.msg;
          break;

          case 'password':
              retError[_err.param] = _err.msg;
          break;

          default:
              retError[_err.param] = _err.msg;
          break;
        }
      });
      
    // case where ERRor is related to application logic
    }else{
      retError[err.key] = err.value;
    }
    
    this.setState({
      errors : retError
    });
  }

  render() {

    return (
      <div className="base-container" ref={this.props.containerRef}>
      <div className="header">Register</div>
      <div className="content">
        <div className="image">
          <img src={loginImg} alt='logo'/>
        </div>
              
            {(this.state.errors && this.state.errors.end) ?
             ( <div className="text-danger danger">{this.state.errors.end}</div>):
             ("")
            }
        <Row>
        <div className="col-12">
                <span className="float-right text-danger danger">{this.state.errors?this.state.errors.firstName:''}</span>
              </div>
                
              <div className=" col-12">
                <label className="float-left col-4"  htmlFor="firstName">First name</label>
                <input  type="text" 
                        name="firstName" 
                        placeholder="Oussama ..." 
                        onChange={this.onChange}
                        value={this.state.firstName} 
                        className={'float-right  col-8'+classnames("", {invalid: 'errors.firstName'})}/>
              </div>
        </Row>
        
        <Row>
          <div className='col-12'>
            <span className=" float-right text-danger danger">{this.state.errors ? this.state.errors.lastName : ''}</span>
          </div>
              
          <div className='col-12'>
            <label className="float-left col-4" htmlFor="lastName">Last name {' '}</label>
            <input  type="text" 
                    name="lastName" 
                    placeholder="Kasraoui ..." 
                    onChange={this.onChange}
                    value={this.state.lastName} 
                    className={'float-right  col-8'+classnames("", {invalid: 'errors.lastName'})} />         
          </div>
        </Row>   

        <Row>
        <div className='col-12'>
                <span className=" float-right text-danger danger">{this.state.errors ? this.state.errors.email : ''}</span>
              </div>
              
              <div className='col-12'>
                <label className="float-left col-4" htmlFor="email">Email {' '}</label>
                <input  type="email" 
                        name="email" 
                        placeholder="email@host.dom" 
                        onChange={this.onChange}
                        value={this.state.email} 
                        className={'float-right  col-8'+classnames("", {invalid: 'errors.email'})} />         
              </div>
        </Row>   

        <Row>
        <div className='col-12'>
                <span className=" float-right text-danger danger">{this.state.errors ? this.state.errors.password : ''}</span>
              </div>
              
              <div className='col-12'>
                <label className="float-left col-4" htmlFor="password">Password {' '}</label>
                <input  type="text" 
                        name="password" 
                        placeholder="******" 
                        onChange={this.onChange}
                        value={this.state.password} 
                        className={'float-right  col-8'+classnames("", {invalid: 'errors.password'})} />         
              </div>
        </Row>

        <Row>
        <div className='col-12'>
                <span className=" float-right text-danger danger">{this.state.errors? this.state.errors.confirmPassword : ''}</span>
              </div>
              
              <div className='col-12'>
                <label className="float-left col-4" htmlFor="confirmPassword">Confirm password {' '}</label>
                <input  type="text" 
                        name="confirmPassword" 
                        placeholder="******" 
                        onChange={this.onChange}
                        value={this.state.confirmPassword} 
                        className={'float-right  col-8'+classnames("", {invalid: 'errors.confirmPassword'})} />         
              </div>
        </Row>
            
        <Button color="primary" size="lg" block onClick={this.onsubmit}>Sign up</Button>  
         
        </div> 
      </div>
        
    ); 
    }

  }
              

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors});

export default connect(mapStateToProps,{ registerUser }) (withRouter(Register));
