import React, { Component }     from "react";
import { connect }              from "react-redux";
import { Row, Button }          from 'reactstrap';
import PropTypes                from "prop-types";
import loginImg                 from "../../img/programmer.svg";
import { loginUser }            from "./../manager/actions/authActions";
import { withRouter }           from "react-router-dom";

class Login extends Component {
  constructor(props) {
      super(props);
      this.state = {
        email      : this.props.email,
        password : '',
        errors: {}
      };
        
      this.handleInputChange = this.handleInputChange.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
  }

  // errors from authActions are expected here
  componentWillReceiveProps(nextProps) {
    
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/home", 'success'); // this will take us to login page directly
    }


    if(nextProps.errors){
      switch (nextProps.errors.status){
        case 'email':
          this.setState({
            errors: {
              email : nextProps.errors.response
            }
          });
        break;

        case 'password':
          this.setState({
            errors: {
              password : nextProps.errors.response
            }
          });
        break;

        default:
          this.setState({
            errors: nextProps.errors
          });
        break;
      }
    }
  }
  
  // Link inputs to states
  handleInputChange(event ){

    this.setState({
      [event.target.name] : event.target.value
    });
  }

  // submit Email & Password to authActions
  onSubmit(event){
    event.preventDefault();
    
    const userData = {
            email: this.state.email,
            password: this.state.password
          };
          
    this.props.loginUser(userData);
  }


  render() {
    
    const { errors } = this.state;
    return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="header">Login</div>
        <div className="content">
          <div className="image">
            <img src={loginImg} alt='logo'/>
          </div>
          
          {(typeof this.state.errors === "string")?
           ( <div className="text-danger danger">Cannot connect to database</div>):
           ("")
          }

          <Row>
            <div className="float-right col-4">
              <label>Email</label>
            </div>
          
            <div className="float-right col-8">
              <span className="text-danger danger">{this.state.errors.email}</span>
            </div>
              
            <div className="float-right col-12">
              <input  type="email" 
                      name="email" 
                      placeholder="your@email.here" 
                      value={ (typeof this.state.email === "string") ? (this.state.email) : ('')} 
                      onChange= {this.handleInputChange} required  
                      error={errors.email} />
            </div>
            
            
              
          </Row>

          <Row>
            
            <div className="float-right col-4">
              <label>Password</label>
            </div>
          
            <div className="float-right col-8">
              <span className="text-danger danger">{this.state.errors.password}</span>
            </div>
              
            <div className="float-right col-12">
              <input  type="password" 
                      name="password" 
                      placeholder="password" 
                      value={this.state.password} 
                      onChange={this.handleInputChange} required 
                      error={errors.password}/>
            </div>
            
              
          </Row>

          <Row>
            <Button color="primary" size="lg" block onClick={this.onSubmit}>Login</Button>
          </Row>
          
          </div>
        </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors});


export default connect(mapStateToProps,{loginUser}) (withRouter(Login));