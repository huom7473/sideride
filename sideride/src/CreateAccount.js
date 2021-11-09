import React from "react";
import styled from "styled-components";

export default class CreateAccountPage extends React.Component {
  constructor(props) {
    super(props);

    //username
    //password
    //confirm password
    //firstname
    //lastname
    //email
    //phone number
    this.state = {
      username: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      email: "",
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
    const { email, password } = this.state;

    if (email !== "" && password !== "") {
      //post to backend
    } else {
      this.setState({ errored: true });
    }
  };

  render() {
    const { errored } = this.state;


    // if form submitted
    //     return redirect this.component


    return (
      <>
        <Container>
          <Form>
            <label>Username:</label>
            <Input name="username" onChange={this._handleUpdate} errored={errored}></Input><br></br>
            <label>Password:</label>
            <Input name="password" onChange={this._handleUpdate} errored={errored}></Input><br></br>
            <label>Confirm Password:</label>
            <Input name="confirmPassword" onChange={this._handleUpdate} errored={errored}></Input><br></br>
            <label>First Name:</label>
            <Input name="firstName" onChange={this._handleUpdate} errored={errored}></Input><br></br>
            <label>Last Name:</label>
            <Input name="lastName" onChange={this._handleUpdate} errored={errored}></Input><br></br>
            <label>email:</label>
            <Input name="email" onChange={this._handleUpdate} errored={errored}></Input><br></br>
            <label>password:</label>
            <Input name="password" onChange={this._handleUpdate}></Input><br></br>
            <button onClick={this._handleSubmit}>Submit</button>
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
