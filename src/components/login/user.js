import  React, {Component}  from 'react';
import  { Button }          from 'reactstrap';
import  PropTypes           from "prop-types";
import  { connect }         from "react-redux";
import  { Row }             from 'reactstrap';
import  { logoutUser, 
          resetUser }       from "./../manager/actions/authActions";




class UserModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.auth.user,
      oldPassword : '',
      newPassword: '',
      confirmPassword:'',
      info : {
        title: '',
        text: '',
        color: '',
        hide : false
      }
    };

    this.onLogoutClick = this.onLogoutClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.clearInput = this.clearInput.bind(this);
    this.onHide = this.onHide.bind(this);
    this.onReset = this.onReset.bind(this);
  }

  onLogoutClick(e){
    e.preventDefault();
    this.props.logoutUser();
    window.location.reload();
  }

  // Link inputs to states
  handleInputChange(event ){
    this.setState({
      [event.target.name] : event.target.value
    });
  }

  //reset input values
  clearInput(){
    this.setState({
      oldPassword : '',
      newPassword: '',
      confirmPassword:'',
      errors: undefined
    });
  }

  // reset info banner after updating user's password
  onReset(status, response){
    if(status === 'success'){
      this.setState({
        info: {
          title: 'Updated',
          text: ' Your password updates with success',
          color: 'success',
          hide : false
        }
      });
    }else if (status === 'incorrect'){
      this.setState({
        info: {
          title: 'Incorrect',
          text: ' '+response,
          color: 'warning',
          hide : false
        }
      });
    }else{
      this.setState({
        info: {
          title: 'Failed',
          text: ' an error occured while updating your password',
          color: 'danger',
          hide : false
        }
      });
    }
  }

  //change Password
  changePassword(){
    const oldPassword     = this.state.oldPassword;
    const newPassword     = this.state.newPassword;
    const confirmPassword = this.state.confirmPassword;

    if(newPassword === confirmPassword){
      let newAuth = {
        'oldPassword': oldPassword,
        'newPassword': newPassword,
        'confirmPassword': confirmPassword
      };
      
      this.props.resetUser(newAuth, this.onReset);
    }else{
      this.setState({
        info : {
          title: 'Unmatch',
          text: ' supplied passwords are not match',
          color: 'danger',
          hide : false
        }
      });
    }
  }
  
  // show Notification bar
  onHide(){
    this.setState({
      info : {
        hide : true
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="col-12 content-body">
        
          {
            (this.state.info.hide === false) ?

            (<div id="Alert" onClick={this.onHide}>          
              <div id={this.state.info.color}>
                <span>
                  <b>
                  {this.state.info.title !== undefined ? this.state.info.title  : ''}
                  </b>
                </span>

                <span>
                {this.state.info.text}
                </span>
              </div>  
            </div>):

            ('')
          }
          <Row>
            <div className='conContainer'>
              <span className='label col-12 float-left'>
                Hello <b>{this.state.user.firstName}</b>, welcome to <b>Dashboar </b>. bellow you can change your account
                password. or <a href="#" onClick={this.onLogoutClick}>click me to Logout</a>
              </span>           
            </div>
          </Row>

          <hr/>
          
          <Row>
            <div className='conContainer'>
              <span className='label col-4 float-left'>Email</span>
              <span className='value col-8 float-right'>
                <label>{ this.state.user.email }</label>
              </span>
            </div>
          </Row>
          
          <Row>
            <div className='conContainer'>
              <span className='label col-4 float-left'>Old password</span>
              <span className='value col-8 float-right'>
                <input type="password" name="oldPassword" placeholder="*******" value={this.state.oldPassword} onChange={e =>{this.handleInputChange(e)}}/>
              </span>            
            </div>
          </Row>
          
          <Row>
            <div className='conContainer'>
              <span className='label col-4 float-left'>New password</span>
              <span className='value col-8 float-right'>
                <input type="password" name="newPassword" placeholder="*******" value={this.state.newPassword} onChange={e =>{this.handleInputChange(e)}}/>
              </span>            
            </div>
          </Row>
          
          <Row>
            <div className='conContainer'>
              <span className='label col-4 float-left'>Confirm password</span>
              <span className='value col-8 float-right'>
                <input type="password" name="confirmPassword" placeholder="*******" value={this.state.confirmPassword} onChange={e =>{this.handleInputChange(e)}}/>
              </span>            
            </div>
          </Row>

          <Row>
            <div className='conContainer'>
              <span className='label col-4 float-left'>
              </span>

              <span className='label col-4'>
                <Button onClick={()=>{this.clearInput()}} outline color="secondary">Clear</Button>{''}
              </span>

              <span className='value col-4'>
                <Button onClick={()=>{this.changePassword()}}  color="primary">Change password</Button>
              </span>            
            </div>
          </Row>

        </div>
      </React.Fragment>
    );
  }
}


UserModal.propTypes = {
                        auth: PropTypes.object.isRequired,
                        logoutUser: PropTypes.func.isRequired,
                        resetUser: PropTypes.func.isRequired
                      };

const mapStateToProps = state => ({
                        auth: state.auth,
                      });

export default connect(mapStateToProps, { logoutUser, resetUser })(UserModal);

