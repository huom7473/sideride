import logo from "./logo.svg";
import React from "react";
import qs from "qs";
import { useHistory, useLocation } from "react-router"

import styled from 'styled-components';

const Container = styled.div`
  background: #282c34;
  display: flex;
  justify-content: center; // 1
  flex-flow: row wrap; // 2
  width: 100%;
  height: 100%;
`;
const List = styled.div`
  display: flex;
  justify-content: center; // 3
  flex-flow: column wrap; // 4
`;

const Card = styled.div`
  background: #36393e;
  margin: 10px;

  height: 50px;
  width: 400px;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-flow: column; // 5 
  justify-content: center;
  align-items: center;
`;


export default function SearchPage() {
    let history = useHistory();
    let location = useLocation();
    return (
        <div className="App">
            <header className="App-header">
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
            date: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).date,
            rides: []
        };
        this.testing_arr = ['a','b','c','d','e','f','g','h','i','j']

        for(var i = 0; i < this.testing_arr.length; i++){
            this.state.rides.push(new RideEntry({
                from: "UCLA",
                to: this.testing_arr[i]
            }));
        }
        

    }

    render() {
        console.log(this.state.rides);
        return (
            <div>
                <p>
                    Results for rides from {this.state.from} to {this.state.to} on {this.state.date}
                </p>
                
                <Container>
                    <List>
                        {this.state.rides.map((it, index) => <Card>{it.render()}</Card>)}
                    </List>
                </Container>
                
            </div>
            
        );
    }
}

class RideEntry extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <span>
                    From: {this.props.from} 
                </span>
                &nbsp;
                <span>
                    To: {this.props.to}
                </span>
            </div>

        );
    }
}