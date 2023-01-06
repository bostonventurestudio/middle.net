import React, { Component } from 'react'
import './titlecardstyles.css'


export default class TitleCard extends Component {

  render() {
    return (
      <div>
        <div className='title'>{this.props.place.name}</div>
        <div className='description'>
          <div className='rating'>
            {this.props.place.rating}
            <img className='Image' src='https://img.icons8.com/color/48/null/filled-star--v1.png' alt="" />
          </div>
          <div className='description1'>{this.props.place.user_ratings_total} reviews</div>
          <div className='price'>
            {this.props.place.price_level}
            <img className='Image' src="https://img.icons8.com/color/48/null/price-tag-usd--v1.png" alt="" />
            </div>
        </div>
      </div>
    )
  }
}
