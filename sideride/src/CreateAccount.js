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
            <Title>Create Account</Title>
            <Label>Username:</Label>
            <Input name="username" onChange={this._handleUpdate} errored={errored}></Input><br></br>
            <Label>Password:</Label>
            <Input name="password" onChange={this._handleUpdate} errored={errored}></Input><br></br>
            <Label>Confirm Password:</Label>
            <Input name="confirmPassword" onChange={this._handleUpdate} errored={errored}></Input><br></br>
            <Label>First Name:</Label>
            <Input name="firstName" onChange={this._handleUpdate} errored={errored}></Input><br></br>
            <Label>Last Name:</Label>
            <Input name="lastName" onChange={this._handleUpdate} errored={errored}></Input><br></br>
            <Label>email:</Label>
            <Input name="email" onChange={this._handleUpdate} errored={errored}></Input><br></br>
            <Button onClick={this._handleSubmit} > Submit </Button>
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
  height: 97vh;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: lightblue;
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

const Button = styled.button`
  min-width: 100%;
  cursor: pointer;
  margin-right: 0.25em;
  margin-top: 0.5em;
  padding: 	0.938em;
  border: none;
  border-radius: 4px;
  background-color: #22223B;
  color: #fefefe;

  &:hover {
    background-color: #4A4E69;
    color: #fefefe;
  }
`;

const Label = styled.label`
  margin-bottom: 0.5em;
  color: #444;
  font-weight: lighter;
`;

const Input = styled.input`
  outline: ${(props) => (props.errored ? "red" : "none")};
`; 


