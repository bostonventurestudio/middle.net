import React, {Component} from 'react';
import {LinkForm} from "../linkForm/LinkForm";
import NearbyPlace from "../nearbyPlace/NearbyPlace";
import {deleteLocation, getCenterOfPolygonLatLngs, getLocations, getWelcomeMessage} from "../../utils";
import MapView from "../MapView/MapView";
import Location from "../location/Location";
import {GoogleApiWrapper} from "google-maps-react";
import {RADIUS, TYPE} from "../../constants";

const GoogleAPIKey = process.env.REACT_APP_GOOGLE_API_KEY;

class TopLocations extends Component {

    constructor(props) {
        super(props);
        this.state = {
            service: new window.google.maps.places.PlacesService(document.createElement('div')),
            locations: [],
            nearbyPlaces: [],
            center: null,
            canRender: false,
            canRenderMap: true,
            showMessage: true,
        };
        this.change = this.change.bind(this);
        this.clear = this.clear.bind(this);
        this.setCenterAndNearbyPlaces = this.setCenterAndNearbyPlaces.bind(this);
        this.getNearbyPlaceDetail = this.getNearbyPlaceDetail.bind(this);
        this.setNearbyPlaceDetail = this.setNearbyPlaceDetail.bind(this);
        this.setNearbyPlaces = this.setNearbyPlaces.bind(this);
        this.deleteLocationHandler = this.deleteLocationHandler.bind(this);
    }

    clear() {
        var menuElements = document.querySelectorAll('[data-tab]');
        for (var i = 0; i < menuElements.length; i++) {
            menuElements[i].classList.remove('active');
            var id = menuElements[i].getAttribute('data-tab');
            document.getElementById(id).classList.remove('active');
        }
    }

    change(event) {
        this.clear();
        event.target.classList.add('active');
        var id = event.currentTarget.getAttribute('data-tab');
        document.getElementById(id).classList.add('active');
        console.log(this.state);
    }

    async getNearbyPlaceDetail(nearbyPlace, index) {
        this.state.service.getDetails({placeId: nearbyPlace.place_id}, await this.setNearbyPlaceDetail);
    }

    async setNearbyPlaceDetail(nearbyPlace, status) {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            var nearbyPlaces = this.state.nearbyPlaces;
            nearbyPlaces.push(nearbyPlace);
            this.setState({nearbyPlaces: nearbyPlaces});
        }else {
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

    async setCenterAndNearbyPlaces(response) {
        var lagLngs = response.data.map(location => [location.latitude, location.longitude]);
        var center = getCenterOfPolygonLatLngs(lagLngs);
        this.setState({center: center});
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
    }

    async deleteLocationHandler(id) {
        this.setState({canRenderMap: false});
        var url = window.location.pathname;
        var slug = url.substring(url.lastIndexOf('/') + 1);
        var response = null;
        if (slug) {
            try {
                await deleteLocation(slug, id);
                response = await getLocations(slug);
                this.setState({locations: response.data});
                if (response.data.length === 0) {
                    window.location.href = "/not-found";
                } else if (response.data.length === 1) {
                    this.setState({
                        center: null,
                        nearbyPlaces: []
                    });
                    this.setState({canRenderMap: true});
                    return;
                }
            } catch (e) {
                console.log(e);
                window.location.href = "/not-found";
            }
        }
        if (response) {
            await this.setCenterAndNearbyPlaces(response);
        }
        this.setState({canRenderMap: true});
    }

    async componentWillMount() {
        const redirected = new URLSearchParams(window.location.search).get('redirected');
        if (redirected) {
            this.setState({showMessage: false});
        }
        var url = window.location.pathname;
        var slug = url.substring(url.lastIndexOf('/') + 1);
        var response = null;
        if (slug) {
            try {
                response = await getLocations(slug);
                this.setState({locations: response.data});
                if (response.data.length === 0) {
                    window.location.href = "/not-found";
                } else if (response.data.length === 1) {
                    this.setState({
                        center: null,
                        canRender: true
                    });
                    return;
                }
            } catch (e) {
                console.log(e);
                window.location.href = "/not-found";
            }
        }
        if (response) {
            await this.setCenterAndNearbyPlaces(response);
        }
        this.setState({canRender: true});
    }

    render() {
        return (
            <main id="main">
                <div className="content-block">
                    {this.state.canRender ? <div className="container">
                        <LinkForm message={this.state.showMessage ? getWelcomeMessage(this.state.locations) : "Ok, we have your location!"} textToCopy={window.location.origin + window.location.pathname}/>
                        <div className="search-results-block">
                            <p>Top places in the middle:</p>
                            <div className="tabset">
                                <div id="top-places" className="b-tab active">
                                    <div className="list-view-block">
                                        {this.state.nearbyPlaces.length > 0 ? this.state.nearbyPlaces.map((place, index) => {
                                            return <NearbyPlace place={place} index={index + 1} key={index}/>
                                        }) : <h4>No places available in the middle.</h4>}
                                    </div>
                                </div>
                                <div id="locations" className="b-tab">
                                    <div className="list-view-block">
                                        {this.state.locations.length > 0 ? this.state.locations.map((location, index) => {
                                            return <Location location={location} index={index + 1} key={index} deleteLocation={this.deleteLocationHandler}/>
                                        }) : <h4>No places available</h4>}
                                    </div>
                                </div>
                                <div id="map" className="b-tab">
                                    {this.state.canRenderMap && <MapView center={this.state.center} locations={this.state.locations} nearbyPlaces={this.state.nearbyPlaces}/>}
                                </div>
                            </div>
                            <div className="tab-links">
                                <a href="#top-places" data-tab="top-places" className="b-nav-tab active" onClick={this.change}>Top Places View</a>
                                <a href="#locations" data-tab="locations" className="b-nav-tab" onClick={this.change}>Locations View</a>
                                <a href="#map" data-tab="map" className="b-nav-tab" onClick={this.change}>Map View</a>
                            </div>
                        </div>
                    </div> : <div className="container"><p>Loading...</p></div>}
                </div>
            </main>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: GoogleAPIKey,
    libraries: ["places"],
})(TopLocations);