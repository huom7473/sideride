import React from "react";
import styled from "styled-components";
import Header from "./Header";
import { useHistory, useLocation } from "react-router"
import { useLoadScript } from "@react-google-maps/api";
import {Alert, Button} from "react-bootstrap";
import { AddressSearch } from "./AddressSearch";

import { API } from 'aws-amplify'
import { Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';

const libraries = ["places"];

function CreateRidePage() {
  let history = useHistory();
  let location = useLocation();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries
  })
  return (
    <div className="App">
      {Header()}
      <div>
        <Title>
          Create a Ride
        </Title>
      </div>
      <div>
        <CreateRideMenu isLoaded={isLoaded} loadError={loadError} history={history} location={location} />
      </div>
    </div>
  );
}


export class CreateRideMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      from: "",
      to: "",
      toCoord: "",
      fromCoord: "",
      date: "",
      time: "",
      seats: "",
      price: "",
      make: "",
      model: "",
      plate: "",
      info: {},
      showAlert: false,
      errored: false,
    };
  }

  async componentDidMount() {
    const info = await Auth.currentUserInfo()
    this.setState({ info: info })
  }
  _handleUpdate = (evt) => {
    const { name, value } = evt.target;
    this.setState({ [name]: value }, () => {
      console.log("this.state", this.state);
    });
  };

  _handleToLatLong = ({ lat, lng, description }) => {
    this.setState({ toCoord: { lat, lng }, to: description });
  };

  _handleFromLatLong = ({ lat, lng, description }) => {
    this.setState({ fromCoord: { lat, lng }, from: description });
  };

  _handleSubmit = () => {
    const { from, to, date, time, seats, price } = this.state;
    console.log(time);

    if (from !== "" && to !== "" && date !== "" && time !== "" && seats !== "" && price !== "") {
      // actual call to add ride to DB 
      API.get('flaskapi', '/api/addride?from=' + this.state.from + "&to=" + this.state.to + "&date=" + this.state.date
        + "&fromLat=" + this.state.fromCoord.lat + "&fromLng=" + this.state.fromCoord.lng
        + "&toLat=" + this.state.toCoord.lat + "&toLng=" + this.state.toCoord.lng + "&time=" + this.state.time +
        "&seats=" + this.state.seats + "&price=" + this.state.price + "&make=" + this.state.make + "&model=" +
        this.state.model + "&plate=" + this.state.plate + "&driver=" + this.state.info.username).then((response) => console.log(response))

      // TODO: give user alert of succesful add rides
        this.props.history.push('/');
    } else {
      this.setState({showAlert: true});
    }
  };

  render() {
    const { errored } = this.state;
    if (!this.props.isLoaded) return "loading";
    else if (this.props.loadError) return "load error";
    return (
      <>
        <Alert className="floating-alert position-fixed"
               show={this.state.showAlert}
               variant="danger"
               onClose={() => {this.setState({showAlert: false})}}
               dismissible>
          Please fill in all required fields!
        </Alert>
        <Container>
          <Form>
            <Label>Pick-up location:</Label>
            <AddressSearch select={this._handleFromLatLong} /><br></br>
            <Label>Destination:</Label>
            <AddressSearch select={this._handleToLatLong} /><br></br>
            <Label>Date:</Label>
            <Input className="form-control" name="date" value={this.state.date} type="date" onChange={this._handleUpdate} errored={errored}></Input><br></br>
            <Label>Time:</Label>
            <Input className="form-control" name="time" type="time" onChange={this._handleUpdate} errored={errored}></Input><br></br>
            <Label>Seats:</Label>
            <Input className="form-control" name="seats" onChange={this._handleUpdate} errored={errored}></Input><br></br>
            <Label>Price:</Label>
            <Input className="form-control" name="price" type="number" onChange={this._handleUpdate} errored={errored} step="0.01"></Input><br></br>
            <Label>Vehicle Make:</Label>
            <Input className="form-control" name="make" onChange={this._handleUpdate} errored={errored}></Input><br></br>
            <Label>Vehicle Model:</Label>
            <Input className="form-control" name="model" onChange={this._handleUpdate} errored={errored}></Input><br></br>
            <Label>License Plate:</Label>
            <Input className="form-control" name="plate" onChange={this._handleUpdate} errored={errored}></Input><br></br>
            <Button type="button" onClick={this._handleSubmit}>Create Ride</Button>
          </Form>
        </Container>
      </>
    );
  };
};

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

const Container = styled.div`
  font-family: Roboto-light;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 400px;
  min-width: 100px;
  min-height: 400px;
  padding: 20px 40px 40px 40px;
  border-radius: 6px;
  box-shadow: 0px 8px 36px #222;
  background-color: #fefefe;
`;

const Label = styled.label`
  margin-bottom: 0.5em;
  color: #444;
  font-weight: lighter;
`;

const Input = styled.input`
  outline: ${(props) => (props.errored ? "red" : "none")};
`;

export default withAuthenticator(CreateRidePage);
