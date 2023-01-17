import React, { Component } from 'react'

const STYLES = {
  padding: "0.5rem",
}

export default class Description extends Component {
  render() {
    return (
      <div style={STYLES}>
        {this.props.description}
      </div>
    )
  }
}
