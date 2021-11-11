import React from "react";
import logo from "./logo.svg";
import { useHistory, Link } from "react-router"
import { API } from 'aws-amplify'
import styled from "styled-components";

export default function LoginPage() {
    let history = useHistory();
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <div>
                    <NameForm history={history}/>
                </div>
            </header>
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
        API.get('flaskapi', '/api/' + this.state.username)
            .then((response) => console.log(response))
        evt.preventDefault();
    };

    _handleCreateAccount = (evt) => {
        this.props.history.push('/create');
        evt.preventDefault();
    };

    render() {
        return (
            <>
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
                <Button onClick = {this._handleSubmit}>Login</Button>
            </Form>
            <Button onClick = {this._handleCreateAccount}>Sign up</Button>
            </>
        );
    }
}

const Form = styled.form`
  width: 600px;
  height: 110px;
`; 

const Input = styled.input`
  outline: ${(props) => (props.errored ? "red" : "none")};
`; 

const Button = styled.button`
  background-color: lightblue;
  margin-top:1px;
  width: 100px;
  height:30px;
  font-family : -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
  sans-serif;
`;
