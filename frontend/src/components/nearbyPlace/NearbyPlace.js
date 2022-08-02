/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 + Copyright (c) 2022-2022, Boston Venture Studio, Inc - https://www.bvs.net/
 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

import React, {Component} from 'react';
import {get12HourTime} from "../../utils";
import {CLOSE, OPEN} from "../../constants";
import image from "../../images/img-1.jpg";
import {Rating} from "react-simple-star-rating";
import {GoogleMapDirectionLink} from "../../config";

class NearbyPlace extends Component {

    render() {
        if(!this.props.place){
            return null;
        }
        return (
            <div className={this.props.popUp ? "list-holder pop-up": "list-holder"} key={this.props.index} style={this.props.style}>
                <div className="left-block">
                    <span className="num">{this.props.index}</span>
                    <div className="img-detail-block">
                        <div className="img-holder">
                            {this.props.place.photos?.length > 0 ? <img src={this.props.place.photos[0].getUrl()} alt=""/> :
                                <img src={image} alt=""/>}
                        </div>
                        <div className="detail-block">
                            <span className="title">{this.props.place.name}</span>
                            <span className="detail">{this.props.place.types.includes("bar") ? "Bar" : this.props.place.types.includes("cafe") ? "Coffee Shop" : "Restaurant"}</span>
                            <span className="detail">{this.props.place.formatted_address}</span>
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
                            <span className="distance">{`${this.props.place.distanceFromCenter}km from center`}</span>
                            <span className="open" style={this.props.timeStyle}>{this.props.place.opening_hours?.isOpen() ? "Open" : "Closed"}</span>
                            <span className="time">{this.props.place.opening_hours?.isOpen() ? get12HourTime(this.props.place.opening_hours, CLOSE) : get12HourTime(this.props.place.opening_hours, OPEN)}</span>
                        </div>
                    </div>
                    <div className="directions-block">
                        <a href={GoogleMapDirectionLink + `?api=1&destination=${this.props.place.geometry.location.lat()},${this.props.place.geometry.location.lng()}`}>
                            <div className="icon-holder">
                                <i className="icon-directions"/>
                            </div>
                            <span style={this.props.directionStyle}>get <br/>directions</span>
                        </a>
                    </div>
                </div>
            </div>
        );
    }

}

export default NearbyPlace
