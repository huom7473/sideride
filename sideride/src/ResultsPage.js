import logo from "./logo.svg";
import React from "react";
import qs from "qs";
import { useHistory, useLocation } from "react-router"

export default function SearchPage() {
    let history = useHistory();
    let location = useLocation();
    return (
        <div className="SearchPage">
            <header className="SearchPage-header">
                <img src={logo} className="App-logo" alt="logo" />
                <div>
                    <p>
                        <Selection history={history} location={location}/>
                    </p>
                </div>
                <div>
                    <Results location={location}/>
                </div>
            </header>
        </div>
    );
}


class Selection extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            from: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).from,
            to: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).to,
            date: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).date
        };
        this.handleChange = this.handleChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({from: event.target.value});
    }

    handlePasswordChange(event) {
        this.setState({to: event.target.value});
    }

    handleDateChange(event) {
        this.setState({date: event.target.value});
    }

    handleSubmit(event) {
        alert('From ' + this.state.from + ' to: ' + this.state.to + " on the date of " + this.state.date);
        this.props.history.push('/results?from=' + this.state.from + "&to=" + this.state.to + "&date=" + this.state.date);
        //Added the below since pages don't reload if you push the same route 
        window.location.reload(false);
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div>
                    <label>
                        From: &nbsp;
                        <input type="text" value={this.state.from} onChange={this.handleChange}/>
                        &nbsp;
                    </label>
                    <label>
                        To: &nbsp;
                        <input type="text" value={this.state.to} onChange={this.handlePasswordChange} />
                    </label>
                    <label>
                        Date: &nbsp;
                        <input type="date" value={this.state.date} onChange={this.handleDateChange} />
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
        this.state = {
            from: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).from,
            to: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).to,
            date: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).date
    
        };
    }

    render() {
        return (
            <p>
                Results for rides from {this.state.from} to {this.state.to} on {this.state.date}
            </p>

        );
    }
}