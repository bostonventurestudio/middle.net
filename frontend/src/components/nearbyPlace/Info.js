import React, { Component } from 'react'
import infoStyles from './infoStyles.css'

export default class Info extends Component {
  render() {
    return (
      <div className='Info'>
        <div>{this.props.place.formatted_address}</div>
        <div>{this.props.place.current_opening_hours.open_now? "Open" : "Closed"}</div>
        <div>{this.props.place.opening_hours.weekday_text[0]}</div>
        <div>{this.props.place.opening_hours.weekday_text[1]}</div>
        <div>{this.props.place.opening_hours.weekday_text[2]}</div>
        <div>{this.props.place.opening_hours.weekday_text[3]}</div>
        <div>{this.props.place.opening_hours.weekday_text[4]}</div>
        <div>{this.props.place.opening_hours.weekday_text[5]}</div>
        <div>{this.props.place.opening_hours.weekday_text[6]}</div>
        <div>
          <a href={this.props.place.website}>
          {this.props.place.website}
          </a>
          </div>
        <div>{this.props.place.formatted_phone_number}</div>

      </div>
    )
  }
}
