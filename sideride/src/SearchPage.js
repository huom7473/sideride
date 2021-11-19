import logo from "./logo.svg";
import React from "react";
import { useHistory } from "react-router"
import styled from "styled-components";

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



export class Selection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {from: '', to: '', date: ''};
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
        this.props.history.push('/results?from=' + this.state.from + "&to=" + this.state.to + "&date=" + this.state.date);
        // API.get('flaskapi', '/api/find')
        // .then((response) => console.log(response) )
        evt.preventDefault();
    };
    _handleCreateRide = (evt) => {
        this.props.history.push('/createride?from=' + this.state.from + "&to=" + this.state.to + "&date=" + this.state.date);
        evt.preventDefault();
    };

    render() {
        return (
            <form>
                <div>
                    <label>
                        From: &nbsp;
                        <input name="from" type="text" value={this.state.from} onChange={this._handleUpdate}/>
                        &nbsp;
                    </label>
                    <label>
                        To: &nbsp;
                        <input name="to" type="text" value={this.state.to} onChange={this._handleUpdate} />
                        &nbsp;
                    </label>
                    <label>
                        Date: &nbsp;
                        <input name="date" type="date" value={this.state.date} onChange={this._handleUpdate} />
                    </label>
                </div>
                <Button onClick = {this._handleCreateRide}>Host a Ride</Button>
                <Button onClick = {this._handleFindRide}>Find a Ride</Button>
            </form>
        );
    }
}


const Button = styled.button`
  background-color: lightblue;
  margin-top:1px;
  width: 100px;
  height:30px;
  font-family : -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
  sans-serif;
`;