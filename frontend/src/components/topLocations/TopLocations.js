import React, {Component} from 'react';
import {LinkForm} from "../linkForm/LinkForm";
import NearbyPlace from "../nearbyPlace/NearbyPlace";
import {getCenterOfPolygonLatLngs, getLocations, getNearbyPlaces} from "../../utils";
import MapView from "../MapView/MapView";

export class TopLocations extends Component {

    constructor(props) {
        super(props);
        this.state = {
            locations: [],
            nearbyPlaces: [],
            center: {
                lat: 0,
                lng: 0
            },
            canRender: false
        };
        this.change = this.change.bind(this);
        this.clear = this.clear.bind(this);
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

    async componentWillMount() {
        var url = window.location.pathname;
        var slug = url.substring(url.lastIndexOf('/') + 1);
        var response = null;
        if (slug) {
            try {
                response = await getLocations(slug);
                this.setState({locations: response.data});
                if (response.data.length === 0) {
                    window.location.href = "/not-found";
                }
            } catch (e) {
                console.log(e);
                window.location.href = "/not-found";
            }
        }
        if (response) {
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
        this.setState({canRender: true});
    }

    render() {
        if(!this.state.canRender) return null;
        return (
            <main id="main">
                <div className="content-block">
                    <div className="container">
                        <LinkForm textToCopy={window.location.origin + window.location.pathname}/>
                        <div className="search-results-block">
                            <p>Top places in the middle:</p>
                            <div className="tabset">
                                <div id="list-view" className="b-tab active">
                                    <div className="list-view-block">
                                        {this.state.nearbyPlaces.length > 0 ? this.state.nearbyPlaces.map((place, index) => {
                                            return <NearbyPlace place={place} index={index + 1} key={index}/>
                                        }) : <h4>No places available</h4>}
                                    </div>
                                </div>
                                <div id="map-view" className="b-tab">
                                    <MapView center={this.state.center} locations={this.state.locations}/>
                                </div>
                            </div>
                            <div className="tab-links">
                                <a href="#list-view" data-tab="list-view" className="b-nav-tab active" onClick={this.change}>List view</a>
                                <a href="#map-view" data-tab="map-view" className="b-nav-tab" onClick={this.change}>Map view</a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }
}