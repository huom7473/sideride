import logo from "./logo.svg";
import React from "react";
import qs from "qs";
import {Accordion, Container} from "react-bootstrap";
import { useHistory, useLocation } from "react-router"

import styled from 'styled-components';

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
            </header>
            <Container>
            <div>
                <Selection history={history} location={location}/>
            </div>
            <div>
                <Results location={location}/>
            </div>
            </Container>
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
        alert('From ' + this.state.from + ' to: ' + this.state.to + " on the date of " + this.state.date);
        this.props.history.push('/results?from=' + this.state.from + "&to=" + this.state.to + "&date=" + this.state.date);
        //Added the below since pages don't reload if you push the same route 
        window.location.reload(false);
        evt.preventDefault();
    };

    render() {
        return (
            <form onSubmit={this._handleSubmit}>
                <div>
                    <label>
                        From: &nbsp;
                        <input name="from" type="text" value={this.state.from} onChange={this._handleUpdate}/>
                        &nbsp;
                    </label>
                    <label>
                        To: &nbsp;
                        <input name="to" type="text" value={this.state.to} onChange={this._handleUpdate} />
                    </label>
                    <label>
                        Date: &nbsp;
                        <input name="date" type="date" value={this.state.date} onChange={this._handleUpdate} />
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
                <div>
                    <Accordion defaultActiveKey="0" className="accordionnonretard">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Accordion Item #1</Accordion.Header>
                            <Accordion.Body>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                                velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                                cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                                est laborum.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Accordion Item #2</Accordion.Header>
                            <Accordion.Body>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                                velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                                cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                                est laborum.
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>

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