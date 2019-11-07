import React                  from 'react';
import Map                    from './Leaflet/Map';
import Loading                from './../../img/loading-map.gif';
import BootstrapSwitchButton  from 'bootstrap-switch-button-react';
import { connect }            from "react-redux";
import { withRouter }         from "react-router-dom";
import {getDistance }         from 'geolib';
import { Button }             from 'reactstrap';
import {apiCoords, 
        browserCoords,
        addShop }             from './../login/actions';


class Home extends React.Component{
  constructor(props){
    super(props);  
    this.state = {
      User : {
        auth : this.props.auth,
        location : {
          lat: 0,
          lng: 0,
          country: null,
          country_name: null,
          ip : null,
        }
      },
      info: {
        title: '',
        text: '',
        color: '',
        hide : false
      },
      address: {
        fetched: false,
        lat: 0,
        lng: 0,
        name: null,
        address: null,
        distance: {
          mesure: false, // default 'Meter'
          mValue: 0,
          kmValue: 0
        }
      },
      Map :{
        status : false,
        center : {
          lat : 0,
          lng: 0
        }
      }
    };

    this.resetValues = this.resetValues.bind(this);
    this.changeMesure = this.changeMesure.bind(this);
    this.addStore = this.addStore.bind(this);
    this.resetValues = this.resetValues.bind(this);
    this.onHide = this.onHide.bind(this);
    this.clear = this.clear.bind(this);
  }

  componentDidMount(){
    
    // Ask for user's permission to geoLocate him 
    browserCoords()
    .then(res =>{
      if(res.error){
        
        // Get user's coordinats through www.ipapi.co/json
        apiCoords()
        .then(location =>{

          this.setState(prevState =>{
            let _prevState = Object.assign({}, prevState);  
            _prevState.User.location = {
              country_name : location.country_name,
              country: location.country,
              ip : location.ip,
              lat: location.latitude,
              lng: location.longitude
            };
            _prevState.info = {
              title: 'Disclaimer',
              text: " This web application uses an external JSON API for the purpose of GeoLocating based on ISP's IP address",
              color: 'warning',
              hide : false
            };
            _prevState.Map = {
              status: true,
              center:{
                lat: location.latitude,
                lng: location.longitude
              }
            };

            return _prevState;

            });
        })
        .catch(err =>{
          this.setState({
            info : {  
                title: 'Error',
                text: ' sounds like there is an error happend while setting your coordinates',
                color: 'danger',
                hide : false
              }
          });
        });

        this.setState({ 
          info :{  
            title: 'Error',
            text: ' sounds like there is no internet to fetch your coordinates',
            color: 'danger',
            hide : false
          }
        });

      }else if(res.error && res.latitude === null && res.longitude === null){

        this.setState({
          info :{  
            title: 'Error',
            text: ' sounds like there is no internet to fetch your coordinates',
            color: 'danger',
            hide : false
          }
        });
      }else {
        this.setState(prevState =>{
            let _prevState = Object.assign({}, prevState);  

            _prevState.User.location = {
              lat: res.latitude,
              lng: res.longitude
            };

            _prevState.info = {
              title: 'Precaution',
              text: ' This web application uses your browser to fetch your Location',
              color: 'primary',
              hide : false
            };

            _prevState.Map = {
              status: true,
              center:{
                lat: res.latitude,
                lng: res.longitude
              }
            };

            return _prevState;

        });
      }
      
    })
    .catch(err => {

      this.setState({
        info :{  
            title: 'Error',
            text: ' sounds like there is no internet to fetch your coordinates',
            color: 'danger',
            hide : false
          }
      })

    })   
  }

  // set adress Values depending on Search List selected result 
  resetValues(address){
    
    if (address) {
      let distance = getDistance(
            {latitude: this.state.User.location.lat , longitude: this.state.User.location.lng },
            {latitude: address.raw.lat, longitude:address.raw.lon });

      this.setState({
        address: {
          fetched: true,
          lat: address.raw.lat,
          lng: address.raw.lon,
          name: address.raw.display_name,
          address: address.raw.address.road+', '+address.raw.address.city,
          distance: {
            mesure: false,
            mValue: distance,
            kmValue: distance / 1000
          }
        }
      });
    }else{
      this.setState({
        info : {
          title: 'Warning',
          text: ' Something went worng while getting search\'s Coordinates',
          color: 'danger',
          hide : false
        }
      });
    }
  }

   // Ask user for his location
  getPosition() {
    
    return new Promise(function(resolve, reject) {
      var coordinates = {
          latitude: null,
          longitude: null,
          error: false,
      };
      function success (pos) {
          coordinates.latitude = pos.coords.latitude;
          coordinates.longitude = pos.coords.longitude;
          resolve(coordinates);
      }

      function fail(error){
          coordinates.error = true;
          resolve(coordinates); // or reject(error);
      }
      navigator.geolocation.getCurrentPosition(success, fail);
    });
  }

  //  Change Distance mesure  From KM to M vice versa
  changeMesure(mesure){

    this.setState(prevState =>{
      let _prevState = Object.assign({}, prevState);  

      _prevState.address.distance.mesure = mesure;
            
      return _prevState;

    })
  }

  // show /hide [info] banner
  onHide(){
    this.setState(prevState =>{
      let _prevState = Object.assign({}, prevState);  

      _prevState.info.hide = true;
            
      return _prevState;

    })
  }

  // Save Store to Database
  addStore(){

    // initilize shop
    const store = {
      Name      : this.state.address.name,
      Address   : this.state.address.address,
      Location  : {
        type        : 'Point',
        coordinates : [this.state.address.lng, this.state.address.lat]
      }
    };
    
    // save shop to database
    addShop(store)
         .then(data => {

            // save Failed
            if(data.Save === 'Failed'){
              this.setState({
                info : {
                  title: 'Failed',
                  text : ' item is unable to be saved to Database', 
                  color :'danger',
                  hide : false
                }
              });
            // save Succeed
            }else{
              this.setState({
                address: {
                  fetched: false,
                  lat: null,
                  lng: null,
                  name: null,
                  address: null,
                  distance: {
                    mesure: this.state.address.distance.mesure,
                    mValue: 0,
                    kmValue: 0
                  }
                },
                info : {
                  title: 'Succeed',
                  text : ' item was successfuly saved to Database ', 
                  color :'success',
                  hide : false
                }
              })
            }
          })
          // erro saving shop to database
          .catch(err => {
            this.setState({
              info : {
                title: 'Failed',
                text : ' cant add store, retry again ['+ err.response.statusText +']', 
                color :'danger',
                hide : false
              }
            })
          });
  }

  // reset point's address values to NULL
  clear(){
    this.setState({

      address:{
        fetched: false,
        lat: null,
        lng: null,
        name: null,
        address: null,
        distance: {
          mesure: false,   //  default is 'Meter'
        }
      },
      Map: {
        status: true,
        center : {
          lat: this.state.User.location.lat,
          lng: this.state.User.location.lng
        }
      }
    });
  }

  // show /hide MAP
  handleMap(){
    this.setState(prevState =>{
      let _prevState = Object.assign({}, prevState);  

      _prevState.Map.status = !_prevState.Map.status;
            
      return _prevState;

    })
  }


  render(){
    return(
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
          
          <div className="row col-12">
                <span className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                  <label className='float-left label'>Longitude</label>
                  <label className='float-right value' name='longitude'>{this.state.address.lng}</label>
                </span>

                <span className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                  <label className='float-left label'>Latitude</label>
                  <label className='float-right value' name='latitude'>{this.state.address.lat}</label>
                </span>
          </div>



          <div className="row col-12">
                <span className='col-lg-6 col-md-6 col-sm-6 col-xs-6'>
                  <label className='float-left label'>Name</label>

                  <label className='float-right value' name='latitude'>{this.state.address.name}</label>
                </span>

                <span className='col-lg-6 col-md-6 col-sm-6 col-xs-6'>
                  <label className='float-left label'>Address</label>

                  <label className='float-right value' name='latitude'>{this.state.address.address}</label>
                </span>
          </div>

          <div className="row col-12">

            <span className='col-lg-6 col-md-6 col-sm-6 col-xs-6'>
              <label className="float-left label">Distance in</label>


                <BootstrapSwitchButton    checked={this.state.address.distance.mesure}
                                          onlabel='kilometer'
                                          onstyle='secondary'
                                          offlabel='meter'
                                          offstyle='dark'
                                          size='sm'
                                          width={120}
                                          style='switch'
                                          onChange={this.changeMesure}
                                      />

                <label className='float-right value '  name='mesure'>{ !this.state.address.distance.mesure ?
                                                          this.state.address.distance.mValue  :
                                                          this.state.address.distance.kmValue   }</label>
            </span>
          </div>

          {
            (this.state.User.auth.isAuthenticated && this.state.address.fetched)?
            (

              <div className="row col-12">
                <span className="col-lg-7 col-md-8 col-sm-6 col-xs-12">
                  <Button outline color="success" size="lg" block onClick={this.addStore}>Save Location</Button>
                </span>
                <span className='col-lg-5 col-md-4 col-sm-6 col-xs-12'>
                  <Button outline color="warning" size="lg" block onClick={this.clear}>Clear</Button>
                </span>
              </div>
              
            ):
            ('')
          }

          <div className="row col-12">
              <div id='mapContainer' className='col' style={{'height':'500px','text-align': 'center'}}>
                  
                {
                  (!this.state.Map.status)                                                          ? 
                 
                  (<img src={Loading} alt='loading-map' style={{'height':'100px',
                                                               'width':'100px',
                                                               'margin-top': '200px',
                                                               'margin-right': 'auto'}}/> )  : 
                (

                  /*<Leaflet Map >*/
                  <Map  height= '500px'
                        zoom=   {15}
                        auth=           {this.state.User.auth}
                        center=         {this.state.Map.center}
                        action=         {this.resetValues}/>

                )
              }

            </div>
          </div>

        </div> 
      </React.Fragment>
    );

  }
}


const mapStateToProps = state => ({
                                    auth: state.auth,
                                    Map : state.Map,
                                    User: state.User
                                });

export default connect(mapStateToProps,{ Map })(withRouter(Home));