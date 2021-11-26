import React from "react";
import { useHistory } from "react-router"
import { Container } from "react-bootstrap";
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { useLoadScript } from "@react-google-maps/api";
import { withAuthenticator } from '@aws-amplify/ui-react';
import Header from './Header';
import Selection from "./Selection";

Amplify.configure(awsconfig);
const libraries = ["places"];

function SearchPage() {
    let history = useHistory();
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: libraries
    })
    return (
        <div className="App">
            {Header()}

            <Container>
                <div>
                    <p>
                        Where are you headed?
                    </p>
                </div>
                <div>
                    <Selection isLoaded={isLoaded} loadError={loadError} history={history} />
                </div>
            </Container>
        </div>
    );
}

export default withAuthenticator(SearchPage);
