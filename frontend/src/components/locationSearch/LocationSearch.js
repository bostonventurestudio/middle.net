/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 + Copyright (c) 2022-2022, Boston Venture Studio, Inc - https://www.bvs.net/
 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

import React, {Component} from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import {ThreeDots} from "react-loader-spinner";
import "./locationSearch.css";

class LocationSearch extends Component {

    render() {
        return (
            <div id='googleMaps'>
                <PlacesAutocomplete value={this.props.address} onChange={(address) => {
                    this.props.setAddress(address, this.props.form_key, true)
                }} onSelect={(address) => {
                    this.props.handleAddressSelect(address, this.props.form_key)
                }}>
                    {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                        <div>
                            <div className="input-holder">
                                <input{...getInputProps({
                                    placeholder: "Enter your location",
                                    className: "location-search-input",
                                })} required/>
                                <span className="location-delete"><button
                                    className={this.props.canDelete ? "btn" : "btn disabled"}
                                    onClick={(event) => this.props.deleteForm(event, this.props.form_key)}
                                    title="remove location"><i className="fa fa-close"/></button></span>
                                <span className="target-location"><button
                                    className={this.props.canTarget ? "btn" : "btn disabled"}
                                    onClick={(event) => this.props.setMapCenter(event, this.props.form_key)}
                                    title="target location"><i className="icon-target"/></button></span>
                                {this.props.isCorrectLocation !== undefined && this.props.isCorrectLocation === false &&
                                <span className="error">ERROR: Invalid Location</span>}
                            </div>
                            <div style={{position: "relative"}}>
                                <div className="autocomplete-dropdown-container">
                                    {loading &&
                                    <div className="suggestion-item"><ThreeDots color='grey' height={50} width={50}/>
                                    </div>}
                                    {suggestions.map(suggestion => {
                                        const className = suggestion.active ? "suggestion-item--active" : "suggestion-item";
                                        // inline style for demonstration purpose
                                        const style = suggestion.active ? {
                                            backgroundColor: "#fafafa",
                                            cursor: "pointer"
                                        } : {backgroundColor: '#ffffff', cursor: 'pointer'};
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