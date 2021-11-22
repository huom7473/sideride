import React from 'react';
import { Route, Switch } from 'react-router';

import SearchPage from "./SearchPage"
import NotFoundPage from "./NotFoundPage"
import ResultsPage from "./ResultsPage"
import CreateRidePage from "./CreateRide"

export default (
    <Switch>
        <Route exact path="/" component={SearchPage} />
        <Route path="/results" component={ResultsPage} />
        <Route path="/createride" component={CreateRidePage} />
        <Route component={NotFoundPage} />
    </Switch>




)
