import logo from "./logo.svg";
import React from "react";

export default function SearchPage() {
    return (
        <div className="SearchPage">
            <header className="SearchPage-header">
                <img src={logo} className="App-logo" alt="logo" />
                <div>
                    <p>
                        <Selection/>
                    </p>
                </div>
                <div>
                    <Results/>
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
        this.props.history.push('/search')
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
                        &nbsp;
                    </label>
                    <input type="submit" value="Search" />
                </div>
            </form>

        );
    }
}

class Results extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <p>
                Dropdown Menu Here
            </p>

        );
    }
}