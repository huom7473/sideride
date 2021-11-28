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

    async componentDidMount() {
        let results_arr = {};
        const info = await Auth.currentUserInfo()
        this.setState({ info: info })
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


        API.get('flaskapi', '/api/myrides?username=' + this.state.info.username).then((response) => {
            //console.log(response);
            //console.log(response["rides i am part of"]);
            let rides_response = response["rides i am part of"];
            let passengers_response = response["my_passengers"];
            let rides = [];
            for (var i = 0; i < rides_response.length; i++) {
                //If user is the driver of the ride
                if (rides_response[i]["driver_username"] == this.state.info.username) {
                    let passengers = [];
                    for (var j = 0; j < passengers_response.length; j++) {
                        if (passengers_response[j]["ride_id"] === rides_response[i]["ride_id"]) {
                            passengers.push(passengers_response[j]);
                        }
                    }
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
        /*
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
                this.setState({ rides: rides });*/

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
                            Price: {this.props.price}
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
        //console.log("MY PASSENGERS ", this.props.passengers);

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
                                {this.props.time}
                            </div>
                            <div>
                                ${this.props.price}
                            </div>
                        </TimePriceContainer>
                    </DriverAccordionContent>
                </DriverHeader>
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
        // If current status already approved, just raise ALERT 
        // Use username + ride_id to update status from PENDING->APPROVED in Riders table
        // Then decrement seat count in MasterRides 
        console.log(this.props.ride, this.props.status, this.props.username)
        if (this.props.status == 'ACCEPTED') {
            alert("Rider has already been accepted!")
        }
        // API.get('flaskapi', '/api/acceptride?ride_id=' + this.props.ride + 
        //"&user=" + this.props.username).then((response) => console.log(response))
    };

    _handleDeny = (evt) => {
        alert("Denied user!")
        if (this.props.status == 'DENIED') {
            alert("Rider has already been denied!")
        }

        //TODO: API call to deny here
        // If current status already DENIED, just raise ALERT 
        // Use username+ ride_id to update status from PENDING->DENIED in Riders table
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
                <Button onClick={this._handleApprove}>
                    Approve
                </Button>
                <Button onClick={this._handleDeny}>
                    Deny
                </Button>
            </UserContainer>

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
