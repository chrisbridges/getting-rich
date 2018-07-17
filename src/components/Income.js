import React, { Component } from 'react'

export class Income extends Component {
  render() {
    return (
      <div className="Income">
        <h2>{this.props.title}</h2>
      </div>
    )
  }
}

export default Income;
