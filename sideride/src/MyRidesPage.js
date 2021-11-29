import React from "react";
import styled from "styled-components";
import Header from "./Header";
import { Button, Accordion, Container } from "react-bootstrap";
import { Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { API } from 'aws-amplify'

function MyRidesPage() {
    return (
        <div className="App">
            {Header()}
            <Title className="mb-2">
                My Rides
            </Title>
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

    async componentDidMount() {
        let results_arr = {};
        const info = await Auth.currentUserInfo()
        this.setState({ info: info })

        API.get('flaskapi', '/api/myrides?username=' + this.state.info.username).then((response) => {
            let rides_response = response["rides i am part of"];
            let passengers_response = response["my_passengers"];
            let rides = [];
            for (var i = 0; i < rides_response.length; i++) {
                //If user is the driver of the ride
                if (rides_response[i]["driver_username"] === this.state.info.username) {
                    let passengers = [];
                    for (var j = 0; j < passengers_response.length; j++) {
                        if (passengers_response[j]["ride_id"] === rides_response[i]["ride_id"]) {
                            passengers.push(passengers_response[j]);
                        }
                    }
                    console.log(rides_response[i]);
                    rides[i] = new DriverEntry({
                        id: rides_response[i]["ride_id"],
                        from: rides_response[i]["from"],
                        to: rides_response[i]["to"],
                        time: rides_response[i]["date"],
                        price: rides_response[i]["price"],
                        seats: rides_response[i]["seats"],
                        passengers: passengers
                    });
                }
                //If user is a rider of the ride 
                else {
                    rides[i] = new RiderEntry({
                        id: rides_response[i]["ride_id"],
                        driver: rides_response[i]["driver_username"],
                        make: rides_response[i]["make"],
                        model: rides_response[i]["model"],
                        plate: rides_response[i]["plate"],
                        from: rides_response[i]["from"],
                        to: rides_response[i]["to"],
                        time: rides_response[i]["date"],
                        price: rides_response[i]["price"],
                        seats: rides_response[i]["seats"],
                        status: rides_response[i]["status"]
                    });
                }

                this.setState({ rides: rides });
            }

        });
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

class RiderEntry extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let [weekday, day, month, year, time, zone] = this.props.time.split(" ")
        let [hours, minutes, seconds] = time.split(":");
        const AMPM = hours < 12 ? "AM" : "PM";
        hours = hours > 12 ? hours - 12 : hours;
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
                                Time:
                            </div>
                            <div>
                                {weekday} {day} {month} {year}
                            </div>
                            <div>
                                {hours}:{minutes}&nbsp;{AMPM}
                            </div>
                            <div>
                                ${this.props.price}
                            </div>
                        </TimePriceContainer>
                    </AccordionContent>
                </Accordion.Header>
                <Accordion.Body>
                    <DetailContainer>
                        <div>
                            YOUR STATUS: {this.props.status}
                        </div>
                        <div>
                            Driver username: {this.props.driver}
                        </div>
                        <div>
                            Vehicle: {this.props.make} {this.props.model}
                        </div>
                        <div>
                            License Plate: {this.props.plate}
                        </div>
                        <div>
                            Price: ${this.props.price}
                        </div>
                        <div>
                            Seats remaining: {this.props.seats}
                        </div>
                    </DetailContainer>
                </Accordion.Body>
            </>
        );
    }
}

class DriverEntry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
    }

    render() {
        let users = [];
        let my_passengers = this.props.passengers;
        for (var i = 0; i < my_passengers.length; i++) {
            let passenger = my_passengers[i];
            users[i] = new UserEntry({
                id: i,
                username: passenger["username"],
                status: passenger["status"],
                ride: passenger["ride_id"]
            });
        }
        this.state = ({ users: users });

        let [weekday, day, month, year, time, zone] = this.props.time.split(" ")
        let [hours, minutes, seconds] = time.split(":");
        const AMPM = hours < 12 ? "AM" : "PM";
        hours = hours > 12 ? hours - 12 : hours;

        return (
            <>
                <DriverHeader>
                    <DriverAccordionContent>
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
                                Time:
                            </div>
                            <div>
                                {weekday} {day} {month} {year}
                            </div>
                            <div>
                                {hours}:{minutes}&nbsp; {AMPM}
                            </div>
                            <div>
                                ${this.props.price}
                            </div>
                        </TimePriceContainer>
                    </DriverAccordionContent>
                </DriverHeader>
                <Accordion.Body>
                    {this.state.users.length !== 0 && this.state.users.map((it, index) => <AccordionBody key={index} eventKey={index}>{it.render()}</AccordionBody>)}
                    {this.state.users.length === 0 && <div>No passengers.</div>}
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
        // If current status already approved, just raise ALERT 
        // Use username + ride_id to update status from PENDING->APPROVED in Riders table
        // Then decrement seat count in MasterRides 
        console.log(this.props.ride, this.props.status, this.props.username)
        if (this.props.status == 'ACCEPTED') {
            alert("Rider has already been accepted!")
        }
        else {
            API.get('flaskapi', '/api/acceptride?ride_id=' + this.props.ride +
                "&user=" + this.props.username).then((response) => response.SUCCESS && alert("Accepted rider!"))
        }
    };

    _handleDeny = (evt) => {
        if (this.props.status == 'DENIED') {
            alert("Rider has already been denied!")
        }
        // If current status already DENIED, just raise ALERT 
        // Use username+ ride_id to update status from PENDING->DENIED in Riders table
        else {
            API.get('flaskapi', '/api/denyride?ride_id=' + this.props.ride +
                "&user=" + this.props.username).then((response) => response.SUCCESS && alert("Denied rider!"))
        }
    };

    render() {
        return (
            //This will be an individual user with a username + button to accept them
            <UserContainer>
                <DetailContainer>
                    <div>
                        Username: {this.props.username}
                    </div>
                    <div>
                        Status: {this.props.status}
                    </div>
                </DetailContainer>
                <Button onClick={this._handleApprove} className="me-2">
                    Approve
                </Button>
                <Button onClick={this._handleDeny}>
                    Deny
                </Button>
            </UserContainer>

        );
    }
}

const Title = styled.h1`
  display: flex;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;  
  font-weight: lighter;
  margin-top: 0.5em;
  letter-spacing: 2px;
`;

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
    width:140px;
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

const DriverAccordionContent = styled.div`
    display:flex;
    width:100%;
    color:white;
    border-color:red;
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

const UserContainer = styled.div`
    display:flex;
    flex-direction:row;
    width:100%;
`;

const DriverHeader = styled(Accordion.Header)`
    button {
        background-color:#1a548f !important;
}
`;



export default withAuthenticator(MyRidesPage);