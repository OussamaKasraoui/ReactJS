import Axios from 'axios';

/*	used for   : Frontend 
 *	dependency : None
 */

 // GET request to www.ipapi.co/json for having user coordinates
export const apiCoords = async function(){
	return Axios.get('https://ipapi.co/json')
  			.then(res => res.data)
			.catch(err => {throw  err})
};

 // ASK user To allow Geolocating feature in browser
export const browserCoords = async function(){
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
};


/*	used for   : Frontend - Backend 
 *	dependency : authentication
 */

// add shop to Database [ global access for all users ]
export const addShop = async function(s){
  return Axios.post('/api/store/add', s)
              .then(res => res.data)
              .catch(err => { throw err});
};

// like a store
export const Like = async function(e){
  		let data = 	{	storeId : e.target.id,
  						uri     : '/api/store/like',
  		   				userId  : localStorage.jwtToken};

  		return Axios.post(data.uri, data)
  			 .then(res => res.data)
  			 .catch(err => {throw  err});
};

// dislike a store 
export const Dislike = (e) =>{
  		let data = 	{	storeId : e.target.id,
  						uri     : '/api/store/dislike',
  		   				userId  : localStorage.jwtToken};

  		return Axios.post(data.uri, data)
  			 .then(res => res.data)
  			 .catch(err => {throw  err});
};

// remove a store from Database
//        if User === Owner
export const Remove = (e) =>{
      let data =  { storeId : e.target.id,
                    uri     : '/api/store/remove',
                    userId  : localStorage.jwtToken};

      return Axios.post(data.uri, data)
         .then(res => res.data)
         .catch(err => {throw  err});
};