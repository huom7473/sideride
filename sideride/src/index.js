import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import routes from "./routes"
import {Router} from 'react-router'
import {createBrowserHistory} from 'history'
import { Amplify } from 'aws-amplify'
import config from './aws-exports'

Amplify.configure(config)

const history = createBrowserHistory();

ReactDOM.render(
    <Router history={history}>{routes}</Router>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
