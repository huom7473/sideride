import React from 'react';
import { Route, Switch } from 'react-router';

import App from "./App";
import SearchPage from "./SearchPage"
import LoginPage from "./LoginPage"
import NotFoundPage from "./NotFoundPage"
import ResultsPage from "./ResultsPage"

export default (
    <Switch>
        <Route exact path="/" component={LoginPage}/>
        <Route path="/login" component={LoginPage}/>
        <Route path="/search" component={SearchPage}/>
        <Route path="/results" component={ResultsPage}/>
        <Route component={NotFoundPage}/>
    </Switch>




)