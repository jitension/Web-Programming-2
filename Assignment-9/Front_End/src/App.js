import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import UserLists from "./UserLists";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

class App extends Component {
  constructor() {
    super();
    this.state = {
      userLists: undefined
    };
  }

  componentDidMount() {
    let self = this;

    fetch('http://localhost:3001')
      .then(function (response) {
        return response.json();
      })
      .then(function (userLists) {
        self.setState({ userLists: userLists })

      })
      .catch(function (error) {
        console.log('Request failed', error)
      });
  }



  render() {
    if (this.state.userLists === undefined) return <div>Loading...</div>;

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          <UserLists lists={this.state.userLists} />
        </p>
      </div>
    );
  }
}

export default App;
