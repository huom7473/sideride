import React from "react";
import qs from "qs";
import { Button, Accordion, Container } from "react-bootstrap";
import { useHistory, useLocation } from "react-router"
import { Auth } from 'aws-amplify';
import styled from 'styled-components';
import Header from './Header';
import { API } from 'aws-amplify'
import Selection from "./Selection";
import { useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];

export default function ResultsPage() {
    let history = useHistory();
    let location = useLocation();
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: libraries
    })
    return (
        <div className="App">
            {Header()}
            <Container>
                <div>
                    <Selection isLoaded={isLoaded} loadError={loadError} history={history} location={location} />
                </div>
                <div>
                    <Results location={location} history={history} />
                </div>
            </Container>
        </div>
    );
}

class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fromlat: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).fromlat,
            fromlng: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).fromlng,
            tolat: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).tolat,
            tolng: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).tolng,
            date: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).date,
            rides: [null]
        };
    }

    componentDidMount() {
        let results_arr = {};

        API.get('flaskapi', '/api/findrides?fromLat=' + this.state.fromlat + '&fromLng=' +
            this.state.fromlng + "&toLat=" + this.state.tolat + "&toLng=" + this.state.tolng + "&date=" + this.state.date).then((response) => {
                console.log("anthony", response)
                console.log("response:", response);
                results_arr = response["Query results"];
                if (!Array.isArray(results_arr))
                    return;
                console.log(results_arr)
                let temp_rides = []
                for (let i = 0; i < results_arr.length; i++) {
                    let item = results_arr[i]
                    if (item === null) {
                        continue;
                    }
                    temp_rides[i] = new RideEntry({
                        id: item["ride_id"],
                        from: item["from"],
                        to: item["to"],
                        time: item["time"],
                        price: item["price"],
                        seats: item["seats"],
                        distance: item["fromDistance"],
                        history: this.props.history
                    })
                    console.log(temp_rides)
                }
                this.setState({ rides: temp_rides });

            })
    }

    render() {
        console.log(this.state.rides);
        if (!this.state.rides.length) {
            return <div>
                No rides found with the specified parameters.
            </div>
        } else if (this.state.rides.length === 1 && this.state.rides[0] === null) {
            return <div>
                Searching for rides...
            </div>
        }
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
            info: {}
        };

    }

    _handleBookRide = (evt) => {
        API.get('flaskapi', '/api/bookseat?id=' + this.props.id + "&user=" + this.state.info.username).then((response) => {
            console.log(response);
            this.props.history.push("/myrides");
        })
    };

    render() {
        //note: ideally this is in the results class and it passes info to rideentry children, not sure how that should be done yet
        Auth.currentUserInfo().then(res => this.state = { info: res });
        let [hours, minutes, seconds] = this.props.time.split(":");
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
                                Pickup time:
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
