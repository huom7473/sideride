import React from "react";
import styled from "styled-components";
import Header from "./Header";
import { Button, Accordion, Container } from "react-bootstrap";
import { Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';


function MyRidesPage() {
    return (
        <div className="App">
            {Header()}
            <div>
                My Rides
            </div>
            <div>
                <CreateRideMenu />
            </div>
        </div>
    );
}



class CreateRideMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rides: []
        };
    }

    componentDidMount() {
        let results_arr = {};

        /*
        API.get('flaskapi', '/api/findrides?fromLat=' + this.state.fromlat + '&fromLng=' +
            this.state.fromlng + "&date=" + this.state.date).then((response) => {
                console.log("anthony", response)
                console.log("response:", response);
                results_arr = response["Query results"];
                let temp_rides = []
                for (var i = 0; i < results_arr.length; i++) {
                    let item = results_arr[i]
                    temp_rides[i] = new RideEntry({
                        id: i,
                        from: item["from"],
                        to: item["to"],
                        time: item["time"],
                        price: item["price"],
                        seats: item["seats"],
                        distance: item["distance"],
                        info: "Stuff"
                    })
                    console.log(temp_rides)
                }
                this.setState({ rides: temp_rides });

            })*/

        //TODO: api call to backend to get associated rides, rather than dummy data below
        this.testing_arr = ['a', 'b']

        let rides = [];
        for (var i = 0; i < this.testing_arr.length; i++) {
            rides[i] = new RideEntry({
                id: i,
                from: "UCLA",
                to: this.testing_arr[i],
                time: 12,
                price: 20,
                seats: 4,
                info: "More Detailed information"
            });
        }
        this.setState({ rides: rides });

    }

    render() {
        return (
            <div>
                <div>
                    <Accordion defaultActiveKey="0" className="cool-accordion">
                        {this.state.rides.map((it, index) => <Accordion.Item key={index} eventKey={index}>{it.render()}</Accordion.Item>)}
                    </Accordion>
                </div>
            </div>

        );
    }
}

class RideEntry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
    }

    render() {

        this.testing_arr = ['a', 'b']

        let users = [];
        for (var i = 0; i < this.testing_arr.length; i++) {
            users[i] = new UserEntry({
                id: i,
                username: this.testing_arr[i],
                status: "Pending"
            });
        }
        console.log("Users temp ", users)
        this.state = ({ users: users });
        console.log("Users ", this.state.users);
        return (

            <>
                <Accordion.Header>
                    <AccordionContent>
                        <PlaceContainer>
                            <div>
                                From: {this.props.from}
                            </div>
                            <div>
                                To: {this.props.to}
                            </div>
                        </PlaceContainer>
                        <TimePriceContainer>
                            <div>
                                Pickup from:
                            </div>
                            <div>
                                {this.props.time}
                            </div>
                            <div>
                                ${this.props.price}
                            </div>
                        </TimePriceContainer>
                    </AccordionContent>
                </Accordion.Header>
                <Accordion.Body>

                    {this.state.users.map((it, index) => <AccordionBody key={index} eventKey={index}>{it.render()}</AccordionBody>)}

                </Accordion.Body>
            </>
        );
    }
}

class UserEntry extends React.Component {
    constructor(props) {
        super(props);
    }

    _handleApprove = (evt) => {
        alert("Approved user!")
        //TODO: API call to approve here
    };

    _handleDeny = (evt) => {
        alert("Denied user!")
        //TODO: API call to deny here
    };

    render() {
        // dummy API call to fetch query results from DB 
        return (
            //This will be an individual user with a username + button to accept them
            <div>
                <DetailContainer>
                    <div>
                        Username: {this.props.username}
                    </div>
                </DetailContainer>
                <Button onClick={this._handleApprove}>
                    Approve
                </Button>
                <Button onClick={this._handleDeny}>
                    Deny
                </Button>
            </div>

        );
    }
}

const PlaceContainer = styled.div`
    margin-right:1em;
    flex:4;
    display:flex;
    flex-direction:column;
    & > * {
        flex: 1;
        padding:0.25em 4em;
        background-color:#0074b2;
        border-radius:990px;
        margin:0.25em;
    }
`;

const TimePriceContainer = styled.div`
    width:125px;
    display:flex;
    flex-direction:column;
    justify-content:space-around;
    text-align:center;
`;

const AccordionContent = styled.div`
    display:flex;
    width:100%;
    color:white;
`;


const AccordionBody = styled.div`
    display:flex;
    width:100%;
`;

const DetailContainer = styled.div`
    flex:1;
    text-align:left;
    display:flex;
    flex-direction:column;
    & > * {
        flex: 1;
    }
`;


export default withAuthenticator(MyRidesPage);
