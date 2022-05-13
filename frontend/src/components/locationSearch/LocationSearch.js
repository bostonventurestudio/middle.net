import React, {Component} from 'react';
import {GoogleApiWrapper, InfoWindow, Map, Marker} from 'google-maps-react';
import Geocode from "react-geocode";
import PlacesAutocomplete from 'react-places-autocomplete';
import {GoogleAPIKey} from '../../config';

Geocode.setApiKey(GoogleAPIKey);
Geocode.enableDebug();

class LocationSearch extends Component {

    state = {
        activeMarker: {},
        showingInfoWindow: false,
    };

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
            <div id='googleMaps'>
                <PlacesAutocomplete value={this.props.address} onChange={this.props.setAddress} onSelect={this.props.handleAddressSelect}>
                    {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                        <div>
                            <div className="input-holder">
                                <input{...getInputProps({placeholder: "Enter your location", className: "location-search-input",})} required/>
                            </div>
                            <div style={{position: "relative"}}>
                                <div className="autocomplete-dropdown-container">
                                    {loading && <div class="suggestion-item">Loading...</div>}
                                    {suggestions.map(suggestion => {
                                        const className = suggestion.active ? "suggestion-item--active" : "suggestion-item";
                                        // inline style for demonstration purpose
                                        const style = suggestion.active ? {backgroundColor: "#fafafa", cursor: "pointer"} : {backgroundColor: '#ffffff', cursor: 'pointer'};
                                        return (
                                            <div {...getSuggestionItemProps(suggestion, {className, style,})}>
                                                <span>{suggestion.description}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </PlacesAutocomplete>
                <div className="location-map">
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
            </div>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: (GoogleAPIKey)
})(LocationSearch)