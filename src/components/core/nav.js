import PropTypes                  from "prop-types";
import { logoutUser, resetUser }  from "./../manager/actions/authActions";
import { FontAwesomeIcon }        from "@fortawesome/react-fontawesome";
import { connect }                from "react-redux";
import { Link}                    from 'react-router-dom';
import React, {Component}         from 'react';
import {Navbar, NavbarBrand,
        Nav, NavItem,Collapse,
        NavbarToggler}            from 'reactstrap';
import { faHome, faStore, 
         faMapMarkerAlt, 
         faThumbsUp, faUser }     from "@fortawesome/free-solid-svg-icons";
         

class NavBar extends Component{
  constructor(props){
    super(props);
    this.state = {
      isOpen    : false,
      auth      : this.props.auth,
      showModal : false,
      navItems  : (
          <React.Fragment>
            <NavItem>
               <Link to='/home'><FontAwesomeIcon icon={faHome} />  Home</Link>
            </NavItem>
            <NavItem>
              <Link to='/space'><FontAwesomeIcon icon={faUser} />  User</Link>
            </NavItem>
          </React.Fragment>
          )
    };

    this.onLogoutClick = this.onLogoutClick.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  onLogoutClick(e){
    e.preventDefault();
    this.props.logoutUser();
    window.location.reload();
  }

  componentWillMount(){
    if(this.state.auth.isAuthenticated){
      this.setState({
        navItems: (
          <React.Fragment>
            <NavItem>
              <Link to='/home'     ><FontAwesomeIcon icon={faHome}         />  Home</Link>
            </NavItem>
            <NavItem>
              <Link to='/shops'    ><FontAwesomeIcon icon={faStore}        />  Shops</Link>
            </NavItem>
            <NavItem>
              <Link to='/nearby'   ><FontAwesomeIcon icon={faMapMarkerAlt} />  Nearby</Link>
            </NavItem>
            <NavItem>
              <Link to='/preferred'><FontAwesomeIcon icon={faThumbsUp}     />  Preferred</Link>
            </NavItem>
            <NavItem>
              <Link to='/user'     ><FontAwesomeIcon icon={faUser} />  { this.state.auth.user.firstName }</Link>
            </NavItem>
          </React.Fragment>
        )
      });
    }
  }


  componentWillReceiveProps(nextProps) {

      if(nextProps.auth.isAuthenticated){
          this.setState({
            auth: nextProps.auth,
            navItems: (
              <React.Fragment>
                <NavItem>
                  <Link to='/home'     ><FontAwesomeIcon icon={faHome}         />  Home</Link>
                </NavItem>
                <NavItem>
                  <Link to='/shops'    ><FontAwesomeIcon icon={faStore}        />  Shops</Link>
                </NavItem>
                <NavItem>
                  <Link to='/nearby'   ><FontAwesomeIcon icon={faMapMarkerAlt} />  Nearby</Link>
                </NavItem>
                <NavItem>
                  <Link to='/preferred'><FontAwesomeIcon icon={faThumbsUp}     />  Preferred</Link>
                </NavItem>
                <NavItem>
                  <Link to='/user'     ><FontAwesomeIcon icon={faUser} />  { nextProps.auth.user.firstName }</Link>
                </NavItem>
              </React.Fragment>
            )
          });
        }else{
          this.setState({
            auth: nextProps.auth, 
            navItems:(
              <React.Fragment>
                <NavItem> 
                   <Link to='/home'><FontAwesomeIcon icon={faHome} />  Home</Link>
                </NavItem>
                <NavItem>
                  <Link to='/space'><FontAwesomeIcon icon={faStore} />  User</Link>
                </NavItem>
              </React.Fragment>
            )
          });
        }
  }

  render() {
    
    return (
      <Navbar light expand="md" id="navigation-bar">
          
        <NavbarBrand href='/'>
          Shops
        </NavbarBrand>

        <NavbarToggler onClick={this.toggle} />
          
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className='ml-auto' navbar id="navigation-bar-ul">
              { this.state.navItems }
          </Nav>
        </Collapse>
      </Navbar>
        
    );
  }
}        
    


NavBar.propTypes = {  
                      auth: PropTypes.object.isRequired
                    };

const mapStateToProps = state => ({
                      auth: state.auth
});

export default connect(mapStateToProps,{ logoutUser, resetUser })(NavBar);