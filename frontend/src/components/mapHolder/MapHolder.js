import React, {Component} from 'react';
import {GoogleApiWrapper, InfoWindow, Map, Marker} from "google-maps-react";
import Geocode from "react-geocode";

class MapHolder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeMarker: {},
            showingInfoWindow: false,
            isFullScreen: false
        };
        this.onMapClicked = this.onMapClicked.bind(this);
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onInfoWindowClose = this.onInfoWindowClose.bind(this);
        this.onFullScreenToggle = this.onFullScreenToggle.bind(this);
        document.addEventListener('fullscreenchange', this.onFullScreenToggle);

    }


    onFullScreenToggle = (event) => {
        this.setState({isFullScreen: !this.state.isFullScreen})
    }

    onMarkerClick = (props, marker) =>
        this.setState({
            activeMarker: marker,
            showingInfoWindow: true
        });

    onInfoWindowClose = () =>
        this.setState({
            activeMarker: null,
            showingInfoWindow: false
        });

    onMapClicked = () => {
        if (this.state.showingInfoWindow)
            this.setState({
                activeMarker: null,
                showingInfoWindow: false
            });
    };

    render() {
        return (
            <div className={this.state.isFullScreen ? "map-holder-full" : "map-holder"}>
                <Map
                    google={this.props.google}
                    onClick={this.onMapClicked}
                    initialCenter={{
                        lat: this.props.position.lat,
                        lng: this.props.position.lng
                    }}
                    center={{
                        lat: this.props.position.lat,
                        lng: this.props.position.lng
                    }}
                    zoom={this.props.zoom} style={{width: "80%", height: "500px"}}>
                    <Marker
                        position={{
                            lat: this.props.position.lat,
                            lng: this.props.position.lng
                        }}
                        name={this.props.address}
                        onClick={this.onMarkerClick}/>
                    <InfoWindow
                        marker={this.state.activeMarker}
                        onClose={this.onInfoWindowClose}
                        visible={this.state.showingInfoWindow}
                    >
                        <div>
                            <h4>{this.props.address}</h4>
                        </div>
                    </InfoWindow>
                </Map>
            </div>
        );
    }
}

export default MapHolder;