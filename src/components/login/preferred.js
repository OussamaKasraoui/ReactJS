import React, {Component} 			from 'react';
import Axios 						from 'axios';
import { Dislike, Remove }			from './actions';
import { Card, Button, CardBody,
		 CardHeader, CardFooter,
  		 CardText,CardSubtitle,
  		  Row, Col } 				from 'reactstrap';   
        

class Preferred extends Component{

	constructor(props){
		super(props);
		this.state = {
			shops : [],
		    info : {
		    	'title' : '',
		      'color': 'secondary',
		      'text' : (
						<React.Fragment>
							<label className='united' style={{'top':'10%', 'textAlign':'left', 'paddingLeft': '10px'}}><b>[ BONUS ]</b> As a User, I can display the list of preferred shops</label>
						
							<label className='united' style={{'top':'-20%', 'textAlign':'left', 'paddingLeft': '10px'}}><b>[ BONUS ]</b> As a User, I can remove a shop from my preferred shops list ( By clicking Dislike button )</label>
						</React.Fragment>	),
		      'hide' : false
		    }
		}
		this.onHide = this.onHide.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	// fetching Shops from Backend
	componentDidMount(){
		Axios.get('/api/store/preferred')
		 	 .then(res => {
				let response = res.data.response;
				let status = res.data.status;

		 	 	if(status ==='error'){
					this.setState({
						info : {
							title : 'Error',
							color : 'danger',
							text : ' There is no SHOPS saved in your Preferred List yet',
							hide : false
						}
					});
		      	}else{

		        	if(!response.length){
		          		this.setState({
				    	    info : {
								title : 'Empty',
				        color : 'info',
								text : ' There is no SHOPS saved in your Preferred List yet',
								hide: false
				        	}
				    	});
		        }else{
							
			        const shops = response.filter(str =>{
				      	let point = {
							      		'id'      : str.Id,
							          	'Name'    : str.Name ,
							          	'Address' : str.Address,
							          	'Owner'	  : str.Owner,
							          	'Like'	  : str.Like,
							          	'Dislike' : str.Dislike,
							          	'Coords'  : {	latitude:  str.Coords.latitude,
														longitude: str.Coords.longitude
													}
				       	 			};
				       	return point.Like;
			        });

				    this.setState({
				       	shops : shops
				    });

			    }
	      	}
		})
		 	 .catch(err =>{
				 
				 this.setState({
					info : {
						color : 'danger',
						text : ' an error occured while fetching Stores List [ ' + err.response.statusText + ' ]',
						hide : false
					}
				});
			});
	}

	// Handle Like / Remove events
	handleChange(e){
	    e.preventDefault();
	    let item = e.target;

	    if(item.value === 'Remove'){
		    Remove(e)
		    .then(res =>{
	    		if(res.status === 'removed'){
			        let shops = this.state.shops.filter(shop => {
			          return shop.Id !== item.id;
			        });
			        
			        this.setState({
			          	'shops' : shops,
			          	'info' : {
			          		'title': res.response.Name,
				            'color' : 'secondary',
				            'text' : ' was completly removed from Database',
				            'hide' : false
			          	}
			        });
	    		}
		     })
		    .catch(err =>{
		    	console.log('error dyal remove hahwa : '+ JSON.stringify(err));
		    });

	    }else{
	      	Dislike(e)
	      	.then(res =>{
		      	if(res.status === 'disliked'){
			        let shops = this.state.shops.filter(shop => {
			          return shop.Id !== item.id;
			        });
			        
			        this.setState({
			          'shops' : shops,
			          'info' : {
									'title' : res.Name,
			            'color' : 'danger',
			            'text' : ' won’t be displayed within “Nearby Shops” list during the next 2 hours',
			            'hide' : false
			          }
			        });
		      	}
	     	})
		    .catch(err =>{
		    	console.log('error dyal dislike hahwa : '+ JSON.stringify(err));
		    });;
		}
	}

	// show /hide [info] banner
	onHide(){
	 	this.setState({
		    info : {
		      hide : true
		    }
		})
	}


	render(){
		const handleChange = this.handleChange;
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
			        
			     	<Row>
			           {
			            this.state.shops.map((shop)=>{
			              return(
			                  	<Col sm="4"key={shop.Id}>
							        <Card>
							            <CardHeader>{shop.Name}</CardHeader>
							            <CardBody>
							                <CardSubtitle><b>coordinates</b></CardSubtitle>
							                <CardText>[{shop.Coords.latitude}, {shop.Coords.longitude}]</CardText>
							                <CardSubtitle><b>Address</b></CardSubtitle>
							                <CardText>{shop.Address}</CardText>
							            	
							            </CardBody>
							        	<CardFooter>
											{
												(shop.Owner === true)?
												(<Button value='Remove'	id={shop.Id} disabled={!shop.Owner}   color='secondary'  className='float-left' onClick={e => {handleChange(e)}} >Remove</Button>):
												('')
											}
											<Button value='Dislike'	id={shop.Id} disabled={shop.Dislike} color='danger'     className='float-right' onClick={e => { handleChange(e)}} >{ (shop.Dislike) ? ('Disliked') : ('Dislike')}</Button>

											
										</CardFooter>
							    	</Card>
							    </Col>
			                )
			            })
			          }
			        </Row>

				</div>
      		</React.Fragment>
    );
	}
}



export default Preferred;