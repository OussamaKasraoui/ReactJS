import React 						from 'react';
import ReactDOM 					from 'react-dom';
import App 							from './App';
import * as serviceWorker 			from './serviceWorker';
import store                     	from './components/manager/store';
import { Provider }               	from 'react-redux';
import { BrowserRouter as Router} 	from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import '@fortawesome/react-fontawesome';


const router =(
			<Provider store={store}>
				<Router>
					<App />
				</Router>
			</Provider>
			)



ReactDOM.render(router, document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
