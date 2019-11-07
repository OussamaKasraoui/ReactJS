import React, { Component }     from "react";
import Axios                    from 'axios';
import {Like, Dislike}          from './actions';
import { Card, Button, 
      CardHeader, CardFooter, 
      CardBody, CardSubtitle, 
      CardText, Row, Col }       from 'reactstrap';

class Shops extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeIn : true,
      isLoading : false,
      shops : [],
      info : {
        title: '',
        text: (
          <React.Fragment>
            <label className='united' style={{'top':'10%', 'textAlign':'left', 'paddingLeft': '10px'}}><b>[ INITIAL ]</b> As a User, I can like a shop, so it can be added to my preferred shops</label>
          
            <label className='united' style={{'top':'-20%', 'textAlign':'left', 'paddingLeft': '10px'}}><b>[ INITIAL ]</b> Acceptance criteria: liked shops shouldn’t be displayed on the main page</label>
          </React.Fragment>	),
        color: 'secondary',
        hide : false
      }
    };

    this.onHide = this.onHide.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // fetch store object from database
  componentDidMount(){
    Axios.get('/api/store', localStorage.jwtToken)
        .then(res => {

					let response = res.data.response;
					let status   = res.data.status;

            if(status ==='error'){
              this.setState({
                info : {
                  title : 'Error',
                  color : 'danger',
                  hide : false,
                  text : ' '+response
                }
              });
            }else{
              if(response.length === 0){
                this.setState({
                  info : {
                    title : 'Empty',
                    color : 'info',
                    text : ' There is no SHOPS saved in Database',
                    hide : false
                  }
                });
              }else{
                
                const shops = response.filter(str =>{
                  let toReturn = {
                    'id'      : str.Id,
                    'Name'    : str.Name ,
                    'Address' : str.Address,
                    'Coords'  : {
                            'latitude':  str.Coords.latitude,
                            'longitude': str.Coords.longitude},
                    'Like'    : str.Like,       //  default value is False
                    'Dislike' : str.Dislike     //  value depends on user's event
                  };

                  if(!toReturn.Like){
                    return toReturn;
                  }
                });

                if(shops.length){
                  this.setState({
                    shops : shops
                  });
                }else{
                  this.setState({
                    info : {
                      title : 'Empty',
                      color : 'success',
                      text : ' Available SHOPS are already attached to your Preffered list',
                      hide : false
                    }
                  })
                }
              }
            }
          })
          .catch(err =>{
             this.setState({
              info : {
                title : 'Error',
                color : 'danger',
                hide : false,
                text : ' '+err
              }
            })
          });
  }

  // handle Like / Dislike events
  handleChange(e){
    e.preventDefault();
    let item = e.target;

    if(item.value === 'Like'){
	      
      Like(e).then(res =>{

        console.log('res de Like = '+ JSON.stringify(res));
        
        if(res.status === 'Liked'){
          
          let shops = this.state.shops.filter(shop => {
            return shop.Id !== item.id
          })

          this.setState({
            shops : shops,
            info : {
              title : res.response.Name,
              color : 'success',
              text : ' was added to your preferred List',
              hide : false
            }
          })

        }else{

        }
        
        // let shops = this.state.shops.filter(shop =>{
  
        //     return shop.id !== item.id;
        // })
 
      })

    }else{
      Dislike(e).then(() =>{
        let shops = this.state.shops.map(shop =>{
          if(item.id === shop.Id){
            if(shop.Like !== shop.Dislike){
              shop.Like = !shop.Like;
              }
            shop.Dislike = !shop.Dislike;
          }
          return shop;
        });
              
        this.setState({
          shops : shops,
          info : {
            title : 'Disliked',
            color : 'danger',
            text : ' Shop won’t be displayed within “Nearby Shops” list during the next 2 hours',
            hide : false
          }
        });
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
            {
              (this.state.shops.length > 0)?
              (this.state.shops.map((shop)=>{
                return(
                    <Col sm="4" style={{'margin-top': '15px',
  																      'margin-bottom': '15px'}}>
                      <Card>
                        <CardHeader>{shop.Name}</CardHeader>
                        <CardBody>
                          <CardSubtitle><b>coordinates</b></CardSubtitle>
                          <CardText>[{shop.Coords.latitude}, {shop.Coords.longitude}]</CardText>
                          <CardSubtitle><b>Address</b></CardSubtitle>
  					              <CardText>{shop.Address}</CardText>
                          <CardSubtitle><b>ID</b></CardSubtitle>
  					              <CardText>{shop.Id}</CardText>
                        </CardBody>
                        <CardFooter>
                          <Button value='Like'    disabled={shop.Like}    outline={shop.Like}     id={shop.Id}  color='success' className='float-left'  onClick={e => { this.handleChange(e)}} >Like</Button>
                          <Button value='Dislike' disabled={shop.Dislike} outline={shop.Dislike}  id={shop.Id}  color='danger'  className='float-right' onClick={e => { this.handleChange(e)}} >{ (shop.Dislike) ? ('Disliked') : ('Dislike')}</Button>
                        </CardFooter>
                      </Card>
                    </Col>
                  )
              })):
              ('')
            }
          </Row>

        </div>
      </React.Fragment>
    );
  }
}


export default Shops;