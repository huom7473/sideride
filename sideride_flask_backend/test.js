import React from 'react';
import './App.css';

class App extends React.Component {

 constructor(props) {
    super(props);
    this.state = {value: '',
                  playerName: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    console.log("making request")
    fetch('/result')
      .then(response => {
        console.log(response)
        return response.json()
      })
      .then(json => {
      console.log=(json)
      this.setState({playerName: json[0]})
      })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} action="http://localhost:5000/result" method="get">
        <label>
          Player ID:
          <input type="text" name="player_id"/>
          <input type="submit" onChange={this.handleChange} value={this.state.value} />
        </label>
      </form>
        <h1> Player Name: {this.state.playerName} </h1>
      </div>
    );
  }
}