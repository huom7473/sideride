import React from "react";
import { useHistory } from "react-router"
import { API } from 'aws-amplify'
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Amplify from 'aws-amplify';
import { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import { AddressSearch } from "./AddressSearch";
import { useLoadScript } from "@react-google-maps/api";
import { withAuthenticator } from '@aws-amplify/ui-react';
import Header from './Header';

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



export class Selection extends React.Component {
    constructor(props) {
        super(props);
        this.state = { from: '', to: '', date: '', info: {} };
    }

    async componentDidMount() {
        const info = await Auth.currentUserInfo()
        this.setState({ info: info })
    }

    _handleUpdate = (evt) => {
        const { name, value } = evt.target;

        //this code is really nifty, it dynamically sets the input field with "name" to the corresponding value,
        //so it can update any of: email, password, confirmedPassword, errored... 
        this.setState({ [name]: value }, () => {
            console.log("this.state", this.state);
        });
    };

    _handleFindRide = (evt) => {
        this.props.history.push('/results?fromlat=' + this.state.toCoord.lat + "&fromlng=" + this.state.toCoord.lng + "&date=" + this.state.date);
  
        evt.preventDefault();
    };

    _handleCreateRide = (evt) => {
        this.props.history.push('/createride?from=' + this.state.from + "&to=" + this.state.to + "&date=" + this.state.date);

        //API Test
        API.get('flaskapi', '/api/createride?from=' + this.state.from + "&to=" + this.state.to + "&date=" + this.state.date)
            .then((response) => console.log(response))

        evt.preventDefault();
    };

    _handleToLatLong = ({ lat, lng, description }) => {
        this.setState({ toCoord: { lat, lng }, to: description });
    };

    _handleFromLatLong = ({ lat, lng, description }) => {
        this.setState({ fromCoord: { lat, lng }, from: description });
    };

    render() {
        if (!this.props.isLoaded) return "loading";
        else if (this.props.loadError) return "load error";
        return (
            <Container>
                <Form>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={"auto"}>From:</Form.Label>
                        <Col>
                            <AddressSearch select={this._handleToLatLong} />
                        </Col>
                        <Form.Label column sm={"auto"}>To:</Form.Label>
                        <Col>
                            <AddressSearch select={this._handleFromLatLong} />
                        </Col>
                        <Form.Label column sm={"auto"}>Date:</Form.Label>
                        <Col>
                            <Form.Control name="date"
                                type="date"
                                value={this.state.date}
                                onChange={this._handleUpdate} />
                        </Col>
                    </Form.Group>
                </Form>
                <Button onClick={this._handleCreateRide}
                    className="me-2">Host a Ride</Button>
                <Button onClick={this._handleFindRide}>Find a Ride</Button>
            </Container>
        );
    }
}

export default withAuthenticator(SearchPage);
