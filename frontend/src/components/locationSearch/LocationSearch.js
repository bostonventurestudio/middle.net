import React, {Component} from 'react';
import {GoogleApiWrapper, Map, Marker} from 'google-maps-react';
import Geocode from "react-geocode";
import PlacesAutocomplete, {geocodeByAddress, getLatLng,} from 'react-places-autocomplete';
import {GoogleMapsAPI} from '../../config';

Geocode.setApiKey(GoogleMapsAPI);
Geocode.enableDebug();

export class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.state;
    }

    handleChange = address => {
        this.setState({address: address});
    };


    handleSelect = address => {
        this.setState({address: address});
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => this.setState({ position: latLng}))
            .catch(error => console.error('Error', error));
    };


    render() {
        return (
            <div id='googleMaps'>
                <PlacesAutocomplete
                    value={this.state.address}
                    onChange={this.handleChange}
                    onSelect={this.handleSelect}
                >
                    {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                        <div>
                            <div className="input-holder">
                                <input{...getInputProps({placeholder: "Enter your location", className: "location-search-input",})}/>
                            </div>
                            <div className="autocomplete-dropdown-container">
                                {loading && <div>Loading...</div>}
                                {suggestions.map(suggestion => {
                                    const className = suggestion.active ? "suggestion-item--active" : "suggestion-item";
                                    // inline style for demonstration purpose
                                    const style = suggestion.active ? {backgroundColor: "#fafafa", cursor: "pointer"} : {backgroundColor: '#ffffff', cursor: 'pointer'};
                                    return (
                                        <div {...getSuggestionItemProps(suggestion, {className,style,})}>
                                            <span>{suggestion.description}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </PlacesAutocomplete>
                <div className="location-map">
                    <Map
                        google={this.props.google}
                        initialCenter={{
                            lat: this.state.position.lat,
                            lng: this.state.position.lng
                        }}
                        center={{
                            lat: this.state.position.lat,
                            lng: this.state.position.lng
                        }}
                        zoom={this.props.zoom} style={{ width: "80%", height: "500px"}}>
                        <Marker
                            position={{
                                lat: this.state.position.lat,
                                lng: this.state.position.lng
                            }}
                            name={"Selected Location"}/>
                    </Map>
                </div>
            </div>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: (GoogleMapsAPI)
})(MapContainer)