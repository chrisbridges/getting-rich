import React, { Component } from 'react';
import './App.css';
import Intro from './components/Intro';
import UserInfoForm from './components/UserInfoForm';
import Income from './components/Income';

const IncomeHOC = UserInfoForm(Income, 'income');


class App extends Component {

  render() {
    return (
      <div className="App">
        <Intro />
        {IncomeHOC}
      </div>
    );
  }
}

export default App;
