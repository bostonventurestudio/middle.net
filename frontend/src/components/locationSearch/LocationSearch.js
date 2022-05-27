import React, {Component} from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';

class LocationSearch extends Component {

    render() {
        return (
            <div id='googleMaps'>
                <PlacesAutocomplete value={this.props.address} onChange={(address) => {
                    this.props.setAddress(address, this.props.form_key)
                }} onSelect={(address) => {
                    this.props.handleAddressSelect(address, this.props.form_key)
                }}>
                    {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                        <div>
                            <div className="input-holder">
                                <input{...getInputProps({placeholder: "Enter your location", className: "location-search-input",})} required/>
                                {this.props.canDelete && <span className="location-delete"><button onClick={(event) => this.props.deleteForm(event, this.props.form_key)} title="Remove Location">-</button></span>}
                                <span className="target-location"><button onClick={(event) => this.props.setMapCenter(event, this.props.form_key)} title="Target Location"><i className="icon-target"/></button></span>
                                {this.props.isCorrectLocation !== undefined && this.props.isCorrectLocation === false && <span className="error">ERROR: Invalid Location</span>}
                            </div>
                            <div style={{position: "relative"}}>
                                <div className="autocomplete-dropdown-container">
                                    {loading && <div className="suggestion-item">Loading...</div>}
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