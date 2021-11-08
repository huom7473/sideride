import React from "react";
import logo from "./logo.svg";
import { useHistory } from "react-router"
import { API } from 'aws-amplify'


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

class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {username: '', password: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({username: event.target.value});
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }

    handleSubmit(event) {
        this.props.history.push('/search')
        //const resp = API.get('flaskapi', '/api/' + this.props.username)
        //console.log(resp)
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div>
                    <label>
                        Username: &nbsp;
                        <input type="text" value={this.state.username} onChange={this.handleChange}/>
                    </label>
                </div>
                <div>
                    <label>
                        Password: &nbsp;
                        <input type="password" value={this.state.password} onChange={this.handlePasswordChange} />
                    </label>
                </div>
                <input type="submit" value="Login" />
            </form>

        );
    }
}