import logo from "./logo.svg";
import React from "react";
import styled from "styled-components";
import { useHistory, useLocation } from "react-router"
import qs from "qs";

export default function CreateRidePage() {
    let history = useHistory();
    let location = useLocation();
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <div>
                    <p>
                        Create a Ride
                    </p>
                </div>
                <div>
                    <CreateRideMenu history={history} location={location}/>
                </div>
            </header>
        </div>
    );
}


export class CreateRideMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        from: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).from,
        to: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).to,
        date: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).date,
        time: "",
        seats: "",
        price: "",
        errored: false,
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

  _handleSubmit = () => {
    const { from, to, date, time, seats, price } = this.state;

    if (from !== "" && to !== "" && date !== "" && time !== "" && seats !== "" && price !== "") {
      //post to backend

      this.props.history.push('/results');
    } else {
      this.setState({ errored: true });
    }
  };

  render() {
    const { errored } = this.state;
    return (
      <>
        <Container>
          <Form>
            <label>Pick-up location:</label>
            <Input name="from" value={this.state.from} onChange={this._handleUpdate} errored={errored}></Input><br></br>
            <label>Destination:</label>
            <Input name="to" value={this.state.to} onChange={this._handleUpdate} errored={errored}></Input><br></br>
            <label>Date:</label>
            <Input name="date" value={this.state.date} type="date" onChange={this._handleUpdate} errored={errored}></Input><br></br>
            <label>Time:</label>
            <Input name="time" onChange={this._handleUpdate} errored={errored}></Input><br></br>
            <label>Seats:</label>
            <Input name="seats" onChange={this._handleUpdate} errored={errored}></Input><br></br>
            <label>Price:</label>
            <Input name="price" onChange={this._handleUpdate} errored={errored}></Input><br></br>
            <Button onClick={this._handleSubmit}>Create Ride</Button>
          </Form>

        </Container>
      </>
    );
  }; 
}; 

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`; 

const Form = styled.form`
  width: 600px;
  height: 500px;
  background-color: lightblue;
`; 

const Input = styled.input`
  outline: ${(props) => (props.errored ? "red" : "none")};
`; 

const Button = styled.button`
  background-color: lightblue;
  margin-top:1px;
  width: 100px;
  height:30px;
  font-family : -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
  sans-serif;
`;