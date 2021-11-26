import React from "react";
import {API, Auth} from "aws-amplify";
import {Alert, Button, Col, Container, Form, Row} from "react-bootstrap";
import {AddressSearch} from "./AddressSearch";
import qs from "qs";

export default class Selection extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.location !== undefined) {
            this.state = {
                from: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).from,
                to: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).to,
                date: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).date,
                fromCoord: '',
                toCoord: '',
                showAlert: false,
                info: {}
            };
        } else {
            this.state = { from: '', to: '', date: '', fromCoord: '', toCoord: '', showAlert: false, info: {} };
        }
    }

    async componentDidMount() {
        const info = await Auth.currentUserInfo()
        this.setState({ info: info })
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
        if (this.state.fromCoord === '' || this.state.toCoord === '' || this.state.date === '') {
            this.setState({showAlert: true});
        }
        else {
            this.props.history.push('/results?fromlat=' + this.state.toCoord.lat + "&fromlng=" + this.state.toCoord.lng + "&date=" + this.state.date
                + '&from=' + this.state.from + '&to=' + this.state.to);
            API.get('flaskapi', '/api/find/' + this.state.info.username)
                .then((response) => console.log(response))
            evt.preventDefault();
        }
    };

    _handleCreateRide = (evt) => {
        this.props.history.push('/createride?from=' + this.state.from + "&to=" + this.state.to + "&date=" + this.state.date);

        //API Test
        API.get('flaskapi', '/api/createride?from=' + this.state.from + "&to=" + this.state.to + "&date=" + this.state.date)
            .then((response) => console.log(response))

        evt.preventDefault();
    };

    _handleToLatLong = ({ lat, lng, description }) => {
        this.setState({ toCoord: { lat, lng }, to: description });
    };

    _handleFromLatLong = ({ lat, lng, description }) => {
        this.setState({ fromCoord: { lat, lng }, from: description });
    };

    render() {
        if (!this.props.isLoaded) return "loading";
        else if (this.props.loadError) return "load error";
        return (
            <Container>
                <Alert className="floating-alert position-fixed"
                       show={this.state.showAlert}
                       variant="danger"
                       onClose={() => {this.setState({showAlert: false})}}
                       dismissible>
                    Please enter valid values for all required fields!
                </Alert>
                <Form>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={"auto"}>From:</Form.Label>
                        <Col>
                            <AddressSearch select={this._handleToLatLong} initialValue={this.state.to}/>
                        </Col>
                        <Form.Label column sm={"auto"}>To:</Form.Label>
                        <Col>
                            <AddressSearch select={this._handleFromLatLong} initialValue={this.state.from}/>
                        </Col>
                        <Form.Label column sm={"auto"}>Date:</Form.Label>
                        <Col>
                            <Form.Control name="date"
                                          type="date"
                                          value={this.state.date}
                                          onChange={this._handleUpdate} />
                        </Col>
                    </Form.Group>
                </Form>
                <Button onClick={this._handleCreateRide}
                        className="me-2">Host a Ride</Button>
                <Button onClick={this._handleFindRide}>Find a Ride</Button>
            </Container>
        );
    }
}