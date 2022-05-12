import React, {Component} from 'react';
import {GoogleApiWrapper, Map, Marker} from 'google-maps-react';
import Geocode from "react-geocode";
import PlacesAutocomplete from 'react-places-autocomplete';
import {GoogleMapsAPI} from '../../config';

Geocode.setApiKey(GoogleMapsAPI);
Geocode.enableDebug();

class LocationSearch extends Component {

    render() {
        return (
            <div id='googleMaps'>
                <PlacesAutocomplete value={this.props.address} onChange={this.props.setAddress} onSelect={this.props.handleAddressSelect}>
                    {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                        <div>
                            <div className="input-holder">
                                <input{...getInputProps({placeholder: "Enter your location", className: "location-search-input",})} required/>
                            </div>
                            <div className="autocomplete-dropdown-container">
                                {loading && <div>Loading...</div>}
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
                    )}
                </PlacesAutocomplete>
                <div className="location-map">
                    <Map
                        google={this.props.google}
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
                            name={"Selected Location"}/>
                    </Map>
                </div>
            </div>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: (GoogleMapsAPI)
})(LocationSearch)