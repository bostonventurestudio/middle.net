import React, { Component } from 'react'
import Images from './Images';
import Description from './Description';
import axios from 'axios';
import TitleCard from './TitleCard';
import Info from './Info';
import Reviews from './Reviews';
import './popUpCardStyle.css';

const GoogleAPIKey = process.env.REACT_APP_GOOGLE_API_KEY;

const MODAL_STYLES = {
    position: 'fixed',
    top:'50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    backgroundColor: '#FFF',
    padding: '0px',
    zIndex: 10,
    width: "17rem",
}



export default class PopUpCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked:false,
      place: "initial state"
   }
    // axios.get('http://127.0.0.1:8000/fetch/'+this.props.place.place_id)
    // .then((res) => {
    //   this.setState({place: res.data.result}, ()=>console.log("hi"));
    // })
    // .catch(err => console.log("ERROR"))
  }

  componentDidMount(){
    axios.get('http://127.0.0.1:8000/fetch/'+this.props.place.place_id)
    .then((res) => {
      this.setState({place: res.data.result}, ()=>console.log("hi"));
    })
    .catch(err => console.log("ERROR"))
  }

  render() {
    if(!this.props.clicked){
      return null;
    }
    return (
        <div className='popUpCard'>
            {console.log(this.props.place)}
            <Images place={this.props.place}/>
            <TitleCard place= {this.props.place}/>
            <Description description={this.state.place.editorial_summary.overview}/>
            <Info place= {this.props.place}/>
            <Reviews place={this.props.place}/>
            <button onClick={()=>this.props.close()}>
            Close
            </button>
        </div>
    )
  }
}
