import React from "react";
import logo from "./logo.svg";
import { useHistory, Link } from "react-router"
import { API } from 'aws-amplify'
import styled from "styled-components";
import {Button, Col, Container, Form, Row} from "react-bootstrap";

export default function LoginPage() {
    let history = useHistory();
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
            </header>
            <Container>
                <div>
                    <NameForm history={history}/>
                </div>
            </Container>
        </div>
    );
}

export class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    }

    _handleUpdate = (evt) => {
        const { name, value } = evt.target;
    
        //this code is really nifty, it dynamically sets the input field with "name" to the corresponding value,
        //so it can update any of: email, password, confirmedPassword, errored... 
        this.setState({ [name]: value }, () => {
          console.log("this.state", this.state);
        });
      };

    _handleSubmit = (evt) => {
        this.props.history.push('/search')
        
        // API.get('flaskapi', '/api/login/username=' + this.state.username + ',password=' + this.state.password)
        //     .then((response) => console.log(response))
        
        API.post('flaskapi', '/api/').then((response) => console.log(response))
        
        evt.preventDefault();
    };

    _handleCreateAccount = (evt) => {
        this.props.history.push('/create');
        evt.preventDefault();
    };

    render() {
        return (
            <Container>
                    <Form>
                        <Form.Group as={Row} className="mb-3 justify-content-center">
                            <Form.Label column sm="1">Username:</Form.Label>
                            <Col sm={"auto"}>
                            <Form.Control name="username"
                                          type="text"
                                          value={this.state.username}
                                          onChange={this._handleUpdate}
                                          placeholder="Username" />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3 justify-content-center">
                            <Form.Label column sm="1">Password:</Form.Label>
                            <Col sm={"auto"}>
                                <Form.Control name="password"
                                              type="password"
                                              value={this.state.password}
                                              onChange={this._handleUpdate}
                                              placeholder="Password" />
                            </Col>
                        </Form.Group>
                    </Form>
                <Button onClick = {this._handleSubmit} className="mb-2">Log in</Button>
                <div>Don't have an account?</div>
                <Button onClick = {this._handleCreateAccount}>Sign up</Button>
            </Container>
        );
    }
}


const Input = styled.input`
  outline: ${(props) => (props.errored ? "red" : "none")};
`;

const P = styled.p`
  line-height:0.2;
`;