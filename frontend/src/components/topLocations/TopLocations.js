import React, {Component} from 'react';
import {LinkForm} from "../linkForm/LinkForm";
import NearbyPlace from "../nearbyPlace/NearbyPlace";
import {deleteLocation, getCenterOfPolygonLatLngs, getLocations, getNearbyPlaces, getWelcomeMessage} from "../../utils";
import MapView from "../MapView/MapView";
import Location from "../location/Location";

export class TopLocations extends Component {

    constructor(props) {
        super(props);
        this.state = {
            locations: [],
            nearbyPlaces: [],
            center: null,
            canRender: false,
            canRenderMap: true,
            showMessage: true,
        };
        this.change = this.change.bind(this);
        this.clear = this.clear.bind(this);
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
    }

    async setCenterAndNearbyPlaces(response) {
        var lagLngs = response.data.map(location => [location.latitude, location.longitude]);
        var center = getCenterOfPolygonLatLngs(lagLngs);
        this.setState({center: center});
        try {
            response = await getNearbyPlaces(center.lat + " " + center.lng);
            this.setState({nearbyPlaces: response.data});
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
                    this.setState({canRender: true});
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
                    {this.state.canRender && <div className="container">
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
                    </div>}
                </div>
            </main>
        )
    }
}