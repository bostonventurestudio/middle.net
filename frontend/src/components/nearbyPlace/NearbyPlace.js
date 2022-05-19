import React, {Component} from 'react';
import image from "../../images/img-1.jpg";
import {Rating} from "react-simple-star-rating";
import {GoogleMapDirectionLink, GooglePlaceImageURL} from "../../config";

const GoogleAPIKey = process.env.REACT_APP_GOOGLE_API_KEY;

class NearbyPlace extends Component {
    render() {
        return (
            <div className="list-holder">
                <div className="left-block">
                    <span className="num">{this.props.index}</span>
                    <div className="img-detail-block">
                        <div className="img-holder">
                            {this.props.place.photos && this.props.place.photos.length > 0 ? <img src={`${GooglePlaceImageURL}?photoreference=${this.props.place.photos[0].photo_reference}&sensor=false&maxheight=80&maxwidth=70&key=${GoogleAPIKey}`} alt=""/> :
                            <img src={image} alt=""/>}
                        </div>
                        <div className="detail-block">
                            <span className="title">{this.props.place.name}</span>
                            <span className="detail">{this.props.place.types.includes("bar") ? "Bar" : this.props.place.types.includes("cafe") ? "Coffee Shop" : "Restaurant"}</span>
                            <span className="detail">{this.props.place.vicinity}</span>
                            <span className="phone_number">{this.props.place.international_phone_number}</span>
                        </div>
                    </div>
                </div>
                <div className="right-block">
                    <div className="rating-time-block">
                        <ul className="rating-list">
                            <li>{this.props.place.rating ? this.props.place.rating : 0}</li>
                            <Rating ratingValue={this.props.place.rating ? this.props.place.rating * 20 : 0} readonly={true} size={15}/>
                        </ul>
                        <div className="timing-info">
                            <span className="open">{this.props.place.opening_hours && this.props.place.opening_hours.open_now ? "Open" : "Closed"}</span>
                            <span className="time">{this.props.place.opening_hours && this.props.place.opening_hours.open_now ? this.props.place.close_at : this.props.place.open_at}</span>
                        </div>
                    </div>
                    <div className="directions-block">
                        <a href={GoogleMapDirectionLink + `?api=1&destination=${this.props.place.geometry.location.lat},${this.props.place.geometry.location.lng}`}>
                            <div className="icon-holder">
                                <i className="icon-directions"/>
                            </div>
                            <span>get <br/>directions</span>
                        </a>
                    </div>
                </div>
            </div>
        );
    }

}

export default NearbyPlace
