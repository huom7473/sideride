import logo from './logo.svg';
import './App.css';
import React from "react";

function App() {
  return (
    
      
    
    <div className="App">
      
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
         <NameForm />
        </div>
      </header>
    </div>
  );
}

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username: '', password: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({username: event.target.value});
  }
  
  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.username + ' with password ' + this.state.password);
    event.preventDefault();
  }

  render() {
    return (
    <form onSubmit={this.handleSubmit}>
          <div>
          <label>
            Username: &nbsp;
            <input type="text" value={this.state.username} onChange={this.handleChange}/>
          </label>
          </div>
          <div>
          <label>
            Password: &nbsp;
            <input type="password" value={this.state.password} onChange={this.handlePasswordChange} />
          </label>
          </div>
          <input type="submit" value="Login" />
        </form>

    );
  }
}



export default App;
