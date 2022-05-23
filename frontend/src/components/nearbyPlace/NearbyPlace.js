import React, {Component} from 'react';
import {get12HourTime, getCenterOfPolygonLatLngs} from "../../utils";
import {CLOSE, OPEN, RADIUS, TYPE} from "../../constants";
import image from "../../images/img-1.jpg";
import {Rating} from "react-simple-star-rating";
import {GoogleMapDirectionLink} from "../../config";

class NearbyPlace extends Component {

    constructor(props) {
        super(props);
        this.state = {
            service: new window.google.maps.places.PlacesService(document.createElement('div')),
            nearbyPlaces: [],
            locations: this.props.locations,
            forms_data: this.props.forms_data,
            canRender: false,
        };
        this.setCenterAndNearbyPlaces = this.setCenterAndNearbyPlaces.bind(this);
        this.getNearbyPlaceDetail = this.getNearbyPlaceDetail.bind(this);
        this.setNearbyPlaceDetail = this.setNearbyPlaceDetail.bind(this);
        this.setNearbyPlaces = this.setNearbyPlaces.bind(this);
    }

    async componentWillMount() {
        var lagLngs = this.props.locations.map(location => [location.latitude, location.longitude]);
        var locations = Object.values(this.props.forms_data);
        for (var i = 0, l = locations.length; i < l; i++) {
            if (locations[i].position.lat !== 0 && locations[i].position.lng !== 0) {
                lagLngs.push([locations[i].position.lat, locations[i].position.lng]);
            }
        }
        await this.setCenterAndNearbyPlaces(lagLngs);
    }

    async componentDidUpdate(prevProps) {
        if (this.props.forms_count !== prevProps.forms_count) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
        {
            var lagLngs = this.state.locations.map(location => [location.latitude, location.longitude]);
            var locations = Object.values(this.state.forms_data);
            for (var i = 0, l = locations.length; i < l; i++) {
                if (locations[i].position.lat !== 0 && locations[i].position.lng !== 0) {
                    lagLngs.push([locations[i].position.lat, locations[i].position.lng]);
                }
            }
            await this.setCenterAndNearbyPlaces(lagLngs);
        }
    }

    async getNearbyPlaceDetail(nearbyPlace, index) {
        this.state.service.getDetails({placeId: nearbyPlace.place_id}, await this.setNearbyPlaceDetail);
    }

    async setNearbyPlaceDetail(nearbyPlace, status) {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            var nearbyPlaces = this.state.nearbyPlaces;
            nearbyPlaces.push(nearbyPlace);
            this.setState({nearbyPlaces: nearbyPlaces});
        } else {
            console.log(nearbyPlace);
        }
    }

    async setNearbyPlaces(result, status) {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            result = result.slice(0, 5);
            result.forEach(await this.getNearbyPlaceDetail);
        } else {
            console.log("e:", result);
        }
    }

    async setCenterAndNearbyPlaces(lagLngs) {
        this.setState({
            canRender: false,
            nearbyPlaces: [],
        });

        console.log("Lat: ", lagLngs);
        console.log("Lat: ", lagLngs.length);
        if (lagLngs.length < 2) {
            this.setState({canRender: true});
            return;
        }
        var center = getCenterOfPolygonLatLngs(lagLngs);
        this.props.setCenter(center);
        try {
            var request = {
                location: center,
                radius: RADIUS,
                type: TYPE,
            };
            this.state.service.nearbySearch(request, await this.setNearbyPlaces);
        } catch (e) {
            console.log(e);
        }
        this.setState({canRender: true});
    }

    render() {
        if (!this.state.canRender) {
            return null;
        }
        return (
            <>
                {this.state.nearbyPlaces.length > 0 ? this.state.nearbyPlaces.map((place, index) => {
                    return <div className="list-holder" key={index}>
                        <div className="left-block">
                            <span className="num">{index + 1}</span>
                            <div className="img-detail-block">
                                <div className="img-holder">
                                    {place.photos?.length > 0 ? <img src={place.photos[0].getUrl()} alt=""/> :
                                        <img src={image} alt=""/>}
                                </div>
                                <div className="detail-block">
                                    <span className="title">{place.name}</span>
                                    <span className="detail">{place.types.includes("bar") ? "Bar" : place.types.includes("cafe") ? "Coffee Shop" : "Restaurant"}</span>
                                    <span className="detail">{place.formatted_address}</span>
                                    <span className="phone_number">{place.international_phone_number}</span>
                                </div>
                            </div>
                        </div>
                        <div className="right-block">
                            <div className="rating-time-block">
                                <ul className="rating-list">
                                    <li>{place.rating ? place.rating : 0}</li>
                                    <Rating ratingValue={place.rating ? place.rating * 20 : 0} readonly={true} size={15}/>
                                </ul>
                                <div className="timing-info">
                                    <span className="open">{place.opening_hours?.isOpen() ? "Open" : "Closed"}</span>
                                    <span className="time">{place.opening_hours?.isOpen() ? get12HourTime(place.opening_hours, CLOSE) : get12HourTime(place.opening_hours, OPEN)}</span>
                                </div>
                            </div>
                            <div className="directions-block">
                                <a href={GoogleMapDirectionLink + `?api=1&destination=${place.geometry.location.lat},${place.geometry.location.lng}`}>
                                    <div className="icon-holder">
                                        <i className="icon-directions"/>
                                    </div>
                                    <span>get <br/>directions</span>
                                </a>
                            </div>
                        </div>
                    </div>
                }) : <div className="instruction-places">
                    No places yet! Enter another location to generate places to meet in the middle.
                </div>}
            </>
        );
    }

}

export default NearbyPlace
