import React, { Component } from 'react';
import './App.css';
import Intro from './components/Intro';
import userInfoForm from './components/UserInfoForm';

// const UserIncomeForm = userInfoForm('income');
// const UserExpenseForm = userInfoForm('expense');
// const UserDebtForm = userInfoForm('debt');


class App extends Component {

  render() {
    return (
      <div className="App">
        <Intro />
        
      </div>
    );
  }
}

export default App;
