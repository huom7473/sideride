import logo from "./logo.svg";
import React from "react";
import { useHistory } from "react-router"

export default function SearchPage() {
    let history = useHistory();
    return (
        <div className="SearchPage">
            <header className="SearchPage-header">
                <img src={logo} className="App-logo" alt="logo" />
                <div>
                    <p>
                        Where are you headed?
                    </p>
                </div>
                <div>
                    <Selection history={history}/>
                </div>
            </header>
        </div>
    );
}



class Selection extends React.Component {
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
        alert('A name was submitted: ' + this.state.username + ' with password ' + this.state.password);
        this.props.history.push('/results')
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div>
                    <label>
                        From: &nbsp;
                        <input type="text" value={this.state.username} onChange={this.handleChange}/>
                        &nbsp;
                    </label>
                    <label>
                        To: &nbsp;
                        <input type="text" value={this.state.password} onChange={this.handlePasswordChange} />
                    </label>
                    <label>
                        Date: &nbsp;
                        <input type="date" value={this.state.password} onChange={this.handlePasswordChange} />
                    </label>
                </div>

                    

                <input type="submit" value="Host a Ride" />
                <input type="submit" value="Find a Ride" />
            </form>

        );
    }
}