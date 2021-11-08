import logo from "./logo.svg";
import React from "react";
import { useHistory } from "react-router"

export default function SearchPage() {
    let history = useHistory();
    return (
        <div className="App">
            <header className="App-header">
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
        this.state = {from: '', to: '', date: ''};
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
        this.props.history.push('/results?from=' + this.state.from + "&to=" + this.state.to + "&date=" + this.state.date);
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
                        &nbsp;
                    </label>
                    <label>
                        Date: &nbsp;
                        <input type="date" value={this.state.date} onChange={this.handleDateChange} />
                    </label>
                </div>

                    

                <input type="submit" value="Host a Ride" />
                <input type="submit" value="Find a Ride" />
            </form>

        );
    }
}