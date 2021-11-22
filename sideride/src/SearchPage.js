import logo from "./logo.svg";
import React from "react";
import { useHistory } from "react-router"
import { API } from 'aws-amplify'
import { Button, Col, Container, Form, FormControl, Row } from "react-bootstrap";
import styled from "styled-components";
import Amplify from 'aws-amplify';
import { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import { AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react';

Amplify.configure(awsconfig);
function SearchPage() {
    let history = useHistory();
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
            </header>
            <AmplifySignOut />
            <Container>
                <div>
                    <p>
                        Where are you headed?
                    </p>
                </div>
                <div>
                    <Selection history={history} />
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
        console.log("Selection mounted")
        const info = await Auth.currentUserInfo()
        console.log('Returned info: ', info)
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
        console.log("Current:", this.state.info.username);
        this.props.history.push('/results?from=' + this.state.from + "&to=" + this.state.to + "&date=" + this.state.date);
        API.get('flaskapi', '/api/find')
            .then((response) => console.log(response))
        evt.preventDefault();
    };
    _handleCreateRide = (evt) => {
        this.props.history.push('/createride?from=' + this.state.from + "&to=" + this.state.to + "&date=" + this.state.date);
        API.get('flaskapi', '/api/createride/from=' + this.state.from + "&to=" + this.state.to + "&date=" + this.state.date)
            .then((response) => console.log(response))
        evt.preventDefault();
    };

    render() {
        return (
            <Container>
                <Form>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={"auto"}>From:</Form.Label>
                        <Col>
                            <Form.Control name="from"
                                type="text"
                                value={this.state.from}
                                onChange={this._handleUpdate}
                                placeholder="UCLA" />
                        </Col>
                        <Form.Label column sm={"auto"}>To:</Form.Label>
                        <Col>
                            <Form.Control name="to"
                                type="text"
                                value={this.state.to}
                                onChange={this._handleUpdate}
                                placeholder="Westwood" />
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
