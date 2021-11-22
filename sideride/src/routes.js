import React from 'react';
import { Route, Switch } from 'react-router';

import App from "./App";
import SearchPage from "./SearchPage"
import LoginPage from "./LoginPage"
import NotFoundPage from "./NotFoundPage"
import ResultsPage from "./ResultsPage"
<<<<<<< HEAD
import CreateRidePage from "./CreateRide"
import CreateAccountPage from "./CreateAccount"
=======
import CreateAccountPage from './CreateAccount'
>>>>>>> 434565d... Added CreateAccount.js, using styled css

export default (
    <Switch>
        <Route exact path="/" component={LoginPage}/>
        <Route path="/login" component={LoginPage}/>
        <Route path="/search" component={SearchPage}/>
        <Route path="/results" component={ResultsPage}/>
<<<<<<< HEAD
        <Route path="/createride" component={CreateRidePage}/>
        <Route path="/create" component={CreateAccountPage}/> 
=======
        <Route path="/create" component={CreateAccountPage}/>
>>>>>>> 434565d... Added CreateAccount.js, using styled css
        <Route component={NotFoundPage}/>
    </Switch>




)
