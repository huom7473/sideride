import logo from "./logo.svg";
import React from "react";
import { useHistory } from "react-router"

export default function SearchPage() {
    let history = useHistory();
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <div>
                    <p>
                        Where are you headed?
                    </p>
                </div>
                <div>
                    <Selection history={history}/>
                </div>
            </header>
        </div>
    );
}



export class Selection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {from: '', to: '', date: ''};
<<<<<<< HEAD
    }

    _handleUpdate = (evt) => {
        const { name, value } = evt.target;
    
        //this code is really nifty, it dynamically sets the input field with "name" to the corresponding value,
        //so it can update any of: email, password, confirmedPassword, errored... 
        this.setState({ [name]: value }, () => {
          console.log("this.state", this.state);
        });
    };
=======
        this.handleChange = this.handleChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({from: event.target.value});
    }

    handleToChange(event) {
        this.setState({to: event.target.value});
    }
>>>>>>> a2b9494bcc115e8337713c75fe37dda67f118e4e

    _handleSubmit = (evt) => {
        this.props.history.push('/results?from=' + this.state.from + "&to=" + this.state.to + "&date=" + this.state.date);
        evt.preventDefault();
    };

    render() {
        return (
            <form onSubmit={this._handleSubmit}>
                <div>
                    <label>
                        From: &nbsp;
                        <input name="from" type="text" value={this.state.from} onChange={this._handleUpdate}/>
                        &nbsp;
                    </label>
                    <label>
                        To: &nbsp;
<<<<<<< HEAD
                        <input name="to" type="text" value={this.state.to} onChange={this._handleUpdate} />
=======
                        <input type="text" value={this.state.to} onChange={this.handleToChange} />
>>>>>>> a2b9494bcc115e8337713c75fe37dda67f118e4e
                        &nbsp;
                    </label>
                    <label>
                        Date: &nbsp;
                        <input name="date" type="date" value={this.state.date} onChange={this._handleUpdate} />
                    </label>
                </div>

                <input type="submit" value="Host a Ride" />
                <input type="submit" value="Find a Ride" />
            </form>

        );
    }
}