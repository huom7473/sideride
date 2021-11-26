import React from "react";
import qs from "qs";
import { Button, Accordion, Container } from "react-bootstrap";
import { useHistory, useLocation } from "react-router"
import { Auth } from 'aws-amplify';
import styled from 'styled-components';
import Header from './Header';
import { API } from 'aws-amplify'


export default function ResultsPage() {
    let history = useHistory();
    let location = useLocation();
    return (
        <div className="App">
            {Header()}
            <Container>
                <div>
                    <Selection history={history} location={location} />
                </div>
                <div>
                    <Results location={location} />
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
                        <input name="from" type="text" value={this.state.from} onChange={this._handleUpdate} />
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
            fromlat: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).fromlat,
            fromlng: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).fromlng,
            date: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).date,
            rides: []
        };
    }

    componentDidMount() {
        let results_arr = {};

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

            })
    }

    render() {
        // dummy API call to fetch query results from DB 

        console.log(this.state.rides);
        return (
            <div>
                <p>
                    Results for rides from {this.state.fromlat}, {this.state.fromlng} on {this.state.date}
                </p>
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
            info: {}
        };

    }

    _handleBookRide = (evt) => {
        //TODO: Backend call to 1) decrement ride seat count by 1 2) Update driver's list of carpoolers
        console.log(this.state.info.username);
    };

    render() {
        //note: ideally this is in the results class and it passes info to rideentry children, not sure how that should be done yet
        Auth.currentUserInfo().then(res => this.state = { info: res })
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
                    <AccordionBody>
                        <DetailContainer>
                            <div>
                                Seats left: {this.props.seats}
                            </div>
                            <div>
                                Distance from current location: {Math.round(this.props.distance * 100) / 100} miles
                            </div>
                        </DetailContainer>
                        <Button onClick={this._handleBookRide}>
                            Book Seat
                        </Button>
                    </AccordionBody>
                </Accordion.Body>
            </>
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
