import React, { Component } from 'react'


const STYLE = {
  width: "20rem",
  height: "15rem"
}

export default class Images extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       index: 0,
    }
  }

  incrementPhotos(){
    const index = (this.state.index +1) % (this.props.place.photos.length);
    this.setState({index: index});
  }

  render() {
    return (
        <img onClick={()=>{this.incrementPhotos()}} src={this.props.place.photos[this.state.index].getUrl()} alt="Resturant Image" style={STYLE} />
    )
  }
}
