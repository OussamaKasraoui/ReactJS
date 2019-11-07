import React, {Component} 	from 'react';
import Axios 				from 'axios';
import { connect }            from "react-redux";
import { withRouter }         from "react-router-dom";
import { getDistance } 		from 'geolib';
import { Like, Dislike} 	from './actions';
import BootstrapSwitchButton  from 'bootstrap-switch-button-react';
import { Card, Button, 
       CardHeader,  Row, 
       CardFooter, 
       CardBody, Col, 
       CardSubtitle, 
       CardText }    from 'reactstrap';



class Nearby extends Component{

	constructor(props){
		super(props);
		this.state = {
			timer : 0,
			fadeIn : true,
			user: this.props.auth.user,
			myPosition : {},
			isLoading : false,
			shops : [],
			shopsLater: [],
			hide : true,
		  info : {
	      title: '',
				text: (
					<React.Fragment>
						<label className='united' style={{'top':'-15%', 'textAlign':'left', 'paddingLeft': '10px'}}><b>[ INITIAL ]</b> As a User, I can display the list of shops sorted by distance</label>
					
						<label className='united' style={{'top':'10%', 'textAlign':'left', 'paddingLeft': '10px'}}><b>[ BONUS ]</b> As a User, I can dislike a shop, so it won’t be displayed within “Nearby Shops” list during the next 2 Hours</label>
					</React.Fragment>	),
	      color: 'secondary',
	      hide : false
		  }
		};
		
		this.onHide = this.onHide.bind(this);
		this.showLater = this.showLater.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentWillMount(){
		let me = undefined;

		Axios.get('https://ipapi.co/json')
			 .then(res => {
			 	me = { 
			 		latitude : res.data.latitude,
			 		longitude: res.data.longitude
			 	};
			 })
			 .then(()=>{
			 	Axios.get('/api/store/nearby', localStorage.jwtToken)
				.then(res => {

					let response = res.data.response;
					let status   = res.data.status;

					if(status !== 'error'){
						if(response.length === 0){
							this.setState({
								info : {
									'title' : 'Empty',
									'color' : 'info',
									'text' : ' There is no SHOPS saved in Database',
									'hide' : false
								}
							});
						}else{
							// sort STORES by distance
							const sorted = response.map(function(shop){
								return {
									'id'  	 	: shop.Id,
									'Name'		: shop.Name ,
									'Address'	: shop.Address,
									'Distance'	: getDistance(
													{latitude:me.latitude , longitude:me.longitude },
													{latitude:shop.Location.coordinates[1] , longitude:shop.Location.coordinates[0] }
												),
									'Coords'	: {
													latitude:  shop.Location.coordinates[1],
													longitude: shop.Location.coordinates[0]},
									'Like' 		: shop.Like,
									'Dislike' 	: shop.Dislike,
									'Later'		: shop.Later,
									'Date'		: shop.Date,

								};
							});

							// points to show up after 2 hours
							let later2H = sorted.filter(shop =>{
								return shop.Later.status;
							}).sort(function(a, b){
								return a.Distance - b.Distance;
							});
							

							// points to show up right now
							let rightNow = sorted.filter(shop =>{
								return !shop.Later;
							}).sort(function(a, b){
								return a.Distance - b.Distance;
							});

							// re-initillize this.state
							this.setState({
									shops : rightNow,
									shopsLater: later2H
								});
						}
					}else{
						this.setState({
			        info : {
			          color : 'danger',
			          text : ' some errors occured in the Backend, [ '+ res.data.response +' ]',
								hide : false
			            	}
						});
					}
				})
			 	.catch(err =>{
			 		this.setState({
			        info : {
			          color : 'info',
			          text : ' There is no SHOPS saved in Database',
								hide : false
			            	}
			        });
				});
					
			})
			 .catch(err => {
			 	this.setState({
			            	info : {
			            		title: 'Error',
					            text: ' sounds like there is no internet to fetch your coordinates',
					            color: 'danger',
					            hide : false
			            	}
			            });
			 	console.log('\n\nfile[nerby.js] componentDidMount() catch(ipapi)  \n err ='+ err+'\n json v='+ JSON.stringify(err))
			 });
	}

	componentWillUnmount() {
		// clear the interval
		clearInterval(this.interval);
	}

	componentDidMount(){

		setInterval(()=>{
			
			let point2Hours = this.state.shopsLater;
			let point2HoursResult = undefined;
			
			point2HoursResult = point2Hours.filter(point=>{
				

				if(point.Later.rest > 0){
					point.Later.rest = --point.Later.rest ;
					return point;
				}else{
					this.setState({
						shops : this.state.shops.concat(point).sort(function(a, b){
											return a.Distance - b.Distance;
										})
					});
				}
			});

			this.setState({
				timer: ++this.state.timer,
				shopsLater : point2HoursResult.sort(function(a, b){
								return a.Distance - b.Distance;
							})
				});
				
			}, 60000);
	}

	//Ask user for his location
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
	    })
	}

  // Like/Dislike a Store and add it to My preferred Shops
	handleChange(e){
	    e.preventDefault();
	    let item = e.target;

	    if(item.value === 'Like'){
	      
	      Like(e).then(() =>{
	        let shops = this.state.shops.map(shop =>{
	          if(item.id === shop.id){
				  if(shop.Like !== shop.Dislike){
					shop.Dislike = !shop.Dislike;
				  }
	            shop.Like = !shop.Like;
	          }
	          return shop
	        })
	 
	        this.setState({
	          'shops' : shops,
	          info : {
	            color : 'success',
	            text : ' Shop was added to your preferred List',
	            hide : false
	          }
	        })
	      })

	    }else{
	      Dislike(e).then(() =>{

			let reservedShop = {}; // this will hold the store should be rendred after 2 Hours

	        let shops = this.state.shops.filter(shop =>{
	          if(item.id === shop.id){
				  
				if(shop.Like !== shop.Dislike){
					shop.Like = !shop.Like;
				  }

				shop.Dislike = !shop.Dislike;
				shop.Later = {
					'status' : true,
					'rest' : 120
				};
				
				reservedShop = shop;
			  }
			  
	          return shop.id !== item.id
	        })
	        
	        this.setState({
			  'shops' : shops,
			  'shopsLater': this.state.shopsLater.concat(reservedShop),
	          info : {
	            color : 'danger',
	            text : ' Shop won’t be displayed within “Nearby Shops” list during the next 2 hours',
	            hide : false
	          }
	        })
	      })
	    }
  }

	// show /hide [info] banner
	onHide(){
	  this.setState({
	    info : {
	      hide : true
	    }
	  });
	}

	// Show / Hide Points in shopsLater[]
	showLater(){
		this.setState({
			hide : !this.state.hide
		});
	}
	
	render(){
		const handleChange = this.handleChange;

		return(
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



					
					{
						(this.state.shops.length)
					?
						(
								<div>
									<label>	Hello <b>{this.state.user.firstName}</b>, all Locations are sorted by distance and shown bellow.</label>
								</div>
						)
					:
						('')
					}



					{
						(this.state.shopsLater.length) 
						?
						(	<div>
								{
									(!this.state.shops.length )
									?  
									(
										<span>
											<span>Hello </span>
											<span><b>{this.state.user.firstName}</b></span>
											<span>, there is </span>
											<span>{this.state.shopsLater.length} item(s) you Disliked wich will be mounted in between 2 hours from now. any way you still can</span>
										</span>
									)
									: 
									(
										<span>
											<span>there is also </span>
											<span>{this.state.shopsLater.length} item(s) you Disliked wich will be mounted in between 2 hours from now. any way you still can</span>
										</span>
									)
								}
								{'  '}
								<BootstrapSwitchButton  checked={this.state.hide}
																				onlabel='show them'
																				onstyle='outline-danger'
																				offlabel='hide them'
																				offstyle='outline-dark'
																				size='sm'
																				width={120}
																				style={{'marginLeft' : '5px'}}
																				onChange={this.showLater}
								/>
							</div>
						)
						:
						('')
					}

					<Row>
					{
						this.state.shops.map((shop)=>{
							return(
								<Col sm="4"key={shop.id} style={{'margin-top': '15px',
																'margin-bottom': '15px'}}>
									<Card>
										<CardHeader>{shop.Name}</CardHeader>
										<CardBody>
											<CardSubtitle><b>coordinates</b></CardSubtitle>
											<CardText>[{shop.Coords.latitude}, {shop.Coords.longitude}]</CardText>
											<CardSubtitle><b>Address</b></CardSubtitle>
											<CardText>{shop.Address}</CardText>
											<CardSubtitle><b>Distance</b></CardSubtitle>
											<CardText>{(shop.Distance > 1000)?(shop.Distance/1000 +' km'):(shop.Distance+' m' ) }</CardText>
											</CardBody>
											<CardFooter>
												<Button value='Like'    disabled={shop.Like}    outline={shop.Like}     id={shop.id}  color='success' className='float-left'  onClick={e => { handleChange(e)}} >{ (shop.Like) ? ('Liked') : ('Like')}</Button>
												<Button value='Dislike' disabled={shop.Dislike} outline={shop.Dislike}  id={shop.id}  color='danger'  className='float-right' onClick={e => { handleChange(e)}} >{ (shop.Dislike) ? ('Disliked') : ('Dislike')}</Button>
											</CardFooter>
									</Card>
								</Col>
										);
						})
					}
					</Row>

					{
					(!this.state.hide)
					?
					(
					<Row>
					{
						this.state.shopsLater.map((shop)=>{

									return(
										<Col sm="4"key={shop.id} style={{'margin-top': '15px',
																		'margin-bottom': '15px'}}>
											<Card>
												<CardHeader>{shop.Name}</CardHeader>
												<CardBody>
												<CardSubtitle><b>coordinates</b></CardSubtitle>
												<CardText>[{shop.Coords.latitude}, {shop.Coords.longitude}]</CardText>
												<CardSubtitle><b>Address</b></CardSubtitle>
												<CardText>{shop.Address}</CardText>
												<CardSubtitle><b>Distance</b></CardSubtitle>
												<CardText>{(shop.Distance > 1000)?(shop.Distance/1000 +' km'):(shop.Distance+' m' ) }</CardText>
												
												<CardSubtitle><b>Time left to be available</b></CardSubtitle>
												<CardText>{shop.Later.rest + ' '} minutes</CardText>
												
												
												</CardBody>
												<CardFooter>
													<Button value='Like'    disabled  outline={shop.Like}     id={shop.id}  color='success' className='float-left'  onClick={e => { handleChange(e)}} >{ (shop.Like) ? ('Liked') : ('Like')}</Button>
													<Button value='Dislike' disabled 	outline={shop.Dislike}  id={shop.id}  color='danger'  className='float-right' onClick={e => { handleChange(e)}} >{ (shop.Dislike) ? ('Disliked') : ('Dislike')}</Button>
												</CardFooter>
											</Card>
										</Col>
										);
						})
					}
					</Row>
					)
					:
					('')
					}
					
      	</div>
	    </React.Fragment>
    	);
	}
}

const mapStateToProps = state => ({ auth: state.auth });

export default connect(mapStateToProps)(withRouter(Nearby));
//export default Nearby;