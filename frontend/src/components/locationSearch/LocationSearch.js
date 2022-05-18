import React, {Component} from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';

class LocationSearch extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

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
            </div>
        )
    }
}

export default LocationSearch;