import React from "react";
import logo from "./logo.svg";
import { useHistory, Link } from "react-router"
import { API } from 'aws-amplify'
import styled from "styled-components";
import { Button, Container, Form } from "react-bootstrap";
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react';

Amplify.configure(awsconfig);

function LoginPage() {
    return (
        <div className="App">
            <header className="App-header">
                <AmplifySignOut />
                <h2>New Login Page</h2>
            </header>
        </div>
    );
}
export default withAuthenticator(LoginPage);
/*function LoginPage() {
    let history = useHistory();
    return (
        <div className="App">
            <header className="App-header">
            </header>
            <Container>
                <img src={logo} className="App-logo" alt="logo" />
                <div>
                    <NameForm history={history} />
                </div>
            </Container>
        </div>
    );
}*/


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

        API.get('flaskapi', '/api/login/username=' + this.state.username + ',password=' + this.state.password)
            .then((response) => console.log(response))

        API.post('flaskapi', '/api/').then((response) => console.log(response))

        evt.preventDefault();
    };

    _handleCreateAccount = (evt) => {
        this.props.history.push('/create');
        evt.preventDefault();
    };

    render() {
        return (
            <div>
                <Form>
                    <div>
                        <label>
                            Username: &nbsp;
                            <Input name="username" type="text" value={this.state.username} onChange={this._handleUpdate}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Password: &nbsp;
                            <Input name="password" type="password" value={this.state.password} onChange={this._handleUpdate}
                            />
                        </label>
                    </div>
                    <Button onClick={this._handleSubmit}>Login</Button>
                </Form>
                <Button onClick={this._handleCreateAccount}>Sign up</Button>
            </div>
        );
    }
}


const Input = styled.input`
  outline: ${(props) => (props.errored ? "red" : "none")};
`;

const P = styled.p`
  line-height:0.2;
`;

