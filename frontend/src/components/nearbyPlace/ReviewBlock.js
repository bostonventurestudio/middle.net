import React, { Component } from 'react'
import axios from 'axios'
import reviewBlockStyle from './reviewBlockStyle.css'

export default class ReviewBlock extends Component {
    constructor(props) {
    super(props)

    this.state = {
        imgStr:null,
    }
  }
  componentDidMount(){
    axios.get('http://127.0.0.1:8000/getImg/' + this.props.place.reviews[this.props.index].profile_photo_url, {responseType: 'blob'})
    .then((res) => {
      console.log(URL.createObjectURL(res.data))
      this.setState({imgStr: URL.createObjectURL(res.data)})
    })
    .catch(err => console.log("ERROR"))
  }
  render() {
    return (
      <>
      <div className='block'>
        <img className='profilePic' src={this.state.imgStr}/>   
        <div className='rightSide'>
          <div className='reviewInfo'>
            <div>{this.props.place.reviews[this.props.index].author_name}</div>
            <div className='ratingReview'>{this.props.place.reviews[this.props.index].rating}
            <img className='Image' src='https://img.icons8.com/color/48/null/filled-star--v1.png' alt="" />
            </div>
            <div>{this.props.place.reviews[this.props.index].relative_time_description}</div>
          </div>
          <div className='reviewText'>{this.props.place.reviews[this.props.index].text}</div>
        </div>    
      </div>
      </>
    )
  }
}
