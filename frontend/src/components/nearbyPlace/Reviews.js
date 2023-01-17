import React, { Component } from 'react'
import ReviewBlock from './ReviewBlock'

export default class Reviews extends Component {
  render() {
    return (
      <div>
        <h1>Reviews</h1>
        <ReviewBlock place={this.props.place} index={0} />
        <ReviewBlock place={this.props.place} index={1} />
        <ReviewBlock place={this.props.place} index={2} />
        <ReviewBlock place={this.props.place} index={3} />
        <ReviewBlock place={this.props.place} index={4} />
      </div>
    )
  }
}
