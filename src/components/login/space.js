import React, { Component } from 'react';
import { connect }                from "react-redux";
import PropTypes                  from "prop-types";
import { withRouter }             from "react-router-dom";
import Register from './register';
import Login from './login';
import "./style.scss";
import "./App.scss";

class Space extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isLogginActive: true,
          email : (typeof this.props.location.state === "string") ? (this.props.location.state) : (''),
          info : {
            title: '',
            text: (
              <React.Fragment>
                <label className='united' style={{'top':'10%', 'textAlign':'left', 'paddingLeft': '10px'}}><b>[ INITIAL ]</b> As a User, I can sign up using my email & password</label>
              
                <label className='united' style={{'top':'-20%', 'textAlign':'left', 'paddingLeft': '10px'}}><b>[ INITIAL ]</b> As a User, I can sign in using my email & password</label>
              </React.Fragment>	),
            color: 'secondary',
            hide : false
          }
        };

        this.changeState = this.changeState.bind(this);
        this.onHide = this.onHide.bind(this);
      }
      
  componentDidMount() {
        
        // If logged in and user navigates to Register page, should redirect them to dashboard
          try {
              if (this.props.auth.isAuthenticated) {
                    this.props.history.push("/");
              }else{
                    //Add .right by default
                    this.rightSide.classList.add("right");
              }
          } catch (error) {
            alert('error : '+error);
          }
  }
  
  
  changeState(email) {
    if(email !== ''){
      this.setState({email : email});
    }
        const { isLogginActive } = this.state;
    
        if (isLogginActive) {
          this.rightSide.classList.remove("right");
          this.rightSide.classList.add("left");
        } else {
          this.rightSide.classList.remove("left");
          this.rightSide.classList.add("right");
        }
        this.setState(prevState => ({ isLogginActive: !prevState.isLogginActive }));
  }

	// show /hide [info] banner
	onHide(){
	  this.setState({
	    info : {
	      hide : true
	    }
	  });
	}
      
  
  render(){
    
          const { isLogginActive } = this.state;
          const current = isLogginActive ? "Register" : "Login";
          const currentActive = isLogginActive ? "login" : "register";
          return (
            <React.Fragment>
              <div className="col-12 content-body">
                {
                  (this.state.info.hide === false) 
                  ?
                  (
                    <div id="Alert" onClick={this.onHide}>          
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
                    </div>
                  )
                  :
                  ('')
                }
              </div>

              <div className="App">
                <div className="login">
                  <div className="container" ref={ref => (this.container = ref)}>
                    {isLogginActive && (
                      <Login containerRef={ref => (this.current = ref)} email={this.state.email} />
                    )}
                    {!isLogginActive && (
                      <Register containerRef={ref => (this.current = ref)} successRegister={this.changeState} />
                    )}
                  </div>
                  
                  <RightSide
                    current={current}
                    currentActive={currentActive}
                    containerRef={ref => (this.rightSide = ref)}
                    onClick={this.changeState}
                  />
                </div>
              </div>
            </React.Fragment>
          )
  }
}
      
const RightSide = props => {
        return (
          <div
            className="right-side"
            ref={props.containerRef}
            onClick={props.onClick}
          >
            <div className="inner-container">
              <div className="text">{props.current}</div>
            </div>
          </div>
        );
};

//export default Space;

Space.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors});


export default connect(mapStateToProps,{Space}) (withRouter(Space));