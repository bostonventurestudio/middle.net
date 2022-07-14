/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 + Copyright (c) 2022-2022, Boston Venture Studio, Inc - https://www.bvs.net/
 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

import React, {Component} from 'react';
import {getLocationDetailFormLatLng} from "../../utils";
import {GoogleApiWrapper} from "google-maps-react";
import Geocode from "react-geocode";
import FormInputs from "../formInputs/FormInputs";
import MapHolder from "../mapHolder/MapHolder";
import {MAX_RADIUS, MIN_RADIUS} from "../../constants";
import NearbyPlace from "../nearbyPlace/NearbyPlace";
import icon_copy from "../../images/iconCopy.png";
import filter from "../../images/filter.svg";
import {addNewForm, copyLinkToClipboard, deleteForm, getNearbyPlaceDetail, handleAddressSelect, handleSubmit, populateFormsData, sendNearbyPlacesAPIRequest, setHeatMapDataAndNearbyPlaces, setHeatMapData, setNearbyPlaceDetail, setNearbyPlaces, suggestOtherNearbyPlaces} from "./helpers";
import {ThreeDots} from "react-loader-spinner";
import {toast} from "react-toastify";


const GoogleAPIKey = process.env.REACT_APP_GOOGLE_API_KEY;

Geocode.setApiKey(GoogleAPIKey);
Geocode.enableDebug();

class Middle extends Component {

    constructor(props) {
        super(props);
        this.state = {
            service: new window.google.maps.places.PlacesService(document.createElement('div')),
            slug: this.props.slug,
            forms_count: 1,
            forms_data: {},
            totalNearbyPlaces: [],
            nearbyPlacesIndex: 0,
            totalSortedNearbyPlaces: 0,
            nearbyPlaces: new Array(5),
            center: {lat: 0, lng: 0},
            mapCenter: {lat: 0, lng: 0},
            canRenderMap: true,
            canRenderPlaces: true,
            heatMapData: [],
            searchRadius: MIN_RADIUS,
            maxRadius: MAX_RADIUS,
        };
        this.change = this.change.bind(this);
        this.clear = this.clear.bind(this);
        this.setMapCenter = this.setMapCenter.bind(this);
        this.setAddress = this.setAddress.bind(this);
        this.setPosition = this.setPosition.bind(this);
        this.setPlaceId = this.setPlaceId.bind(this);
        this.setIsCorrectLocation = this.setIsCorrectLocation.bind(this);
        this.handleAddressSelect = handleAddressSelect.bind(this);
        this.copyLinkToClipboard = copyLinkToClipboard.bind(this);
        this.addNewForm = addNewForm.bind(this);
        this.deleteForm = deleteForm.bind(this);
        this.setHeatMapDataAndNearbyPlaces = setHeatMapDataAndNearbyPlaces.bind(this);
        this.getNearbyPlaceDetail = getNearbyPlaceDetail.bind(this);
        this.setNearbyPlaceDetail = setNearbyPlaceDetail.bind(this);
        this.setNearbyPlaces = setNearbyPlaces.bind(this);
        this.setHeatMapData = setHeatMapData.bind(this);
        this.sendNearbyPlacesAPIRequest = sendNearbyPlacesAPIRequest.bind(this);
        this.handleSubmit = handleSubmit.bind(this);
        this.populateFormsData = populateFormsData.bind(this);
        this.suggestOtherNearbyPlaces = suggestOtherNearbyPlaces.bind(this);
    }

    componentWillMount() {
        const form_key = this.populateFormsData(this.props.locations, true);
        navigator.geolocation.getCurrentPosition((position) => {
            this.setPosition(position.coords.latitude, position.coords.longitude, form_key);
            getLocationDetailFormLatLng(position.coords.latitude, position.coords.longitude).then((response) => {
                this.setState(state => {
                    state.forms_data[form_key].address = response.results[0].formatted_address;
                    state.forms_data[form_key].google_place_id = response.results[0].place_id;
                    return state;
                }, this.setHeatMapDataAndNearbyPlaces);
            }).catch((error) => {
                toast.error(error.message ? error.message : error);
                this.setHeatMapDataAndNearbyPlaces();
            });
        }, (error) => {
            toast.error(error.message ? error.message : error);
            this.setHeatMapDataAndNearbyPlaces();
        });
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

    setMapCenter(event, form_key) {
        if (event) {
            event.preventDefault();
        }
        this.setState({mapCenter: {lat: this.state.forms_data[form_key].latitude, lng: this.state.forms_data[form_key].longitude}});
    }

    setIsCorrectLocation(isCorrectLocation, form_key) {
        this.setState(state => {
            state.forms_data[form_key].isCorrectLocation = isCorrectLocation;
            return state;
        });
    }

    setAddress(address, form_key, isInvalidAddress = false) {
        this.setState(state => {
            state.forms_data[form_key].address = address;
            if (isInvalidAddress) {
                state.forms_data[form_key].latitude = 0;
                state.forms_data[form_key].longitude = 0;
            }
            return state;
        });
        if (isInvalidAddress && this.state.forms_data[form_key].google_place_id !== '') {
            this.setPlaceId('', form_key);
        }
        document.getElementById("copied").style.display = "none";
    }

    setPosition(lat, lng, form_key) {
        this.setState(state => {
            state.forms_data[form_key].latitude = lat;
            state.forms_data[form_key].longitude = lng;
            return state;
        });
    }

    setPlaceId(place_id, form_key) {
        this.setState(state => {
            state.forms_data[form_key].isCorrectLocation = true;
            state.forms_data[form_key].google_place_id = place_id;
            return state;
        }, this.setHeatMapDataAndNearbyPlaces);
    }

    render() {
        let canAddLocation = true;
        for (var form_key in this.state.forms_data) {
            if (this.state.forms_data[form_key].google_place_id === '') {
                canAddLocation = false;
                break;
            }
        }
        return (
            <div>
                <form className="form" onSubmit={this.handleSubmit}>
                    {
                        Object.keys(this.state.forms_data).map((form_key, index) => (
                            <FormInputs key={index} form_key={form_key}
                                        isCorrectLocation={this.state.forms_data[form_key].isCorrectLocation}
                                        position={{lat: this.state.forms_data[form_key].latitude, lng: this.state.forms_data[form_key].longitude}}
                                        address={this.state.forms_data[form_key].address}
                                        setAddress={this.setAddress}
                                        handleAddressSelect={this.handleAddressSelect}
                                        canDelete={this.state.forms_count > 1 && this.state.canRenderMap}
                                        deleteForm={this.deleteForm}
                                        setMapCenter={this.setMapCenter}/>
                        ))
                    }
                    {canAddLocation && <div className="add-location">
                        <button onClick={this.addNewForm}>
                            <span className="icon">+</span>
                            <span className="text">Add another location</span>
                        </button>
                    </div>}
                    <div className="share-btn-row">
                        <button type="submit" className={this.state.forms_data["form_1"].google_place_id !== '' ? "btn-primary" : "btn-primary disabled"}><span>Share</span> link <img src={icon_copy} alt=""/></button>
                        <div className="copied" id="copied">
                            link has been copied to clipboard!
                        </div>
                    </div>
                </form>
                <div className="search-results-block">
                    <div className="tab">
                        <div className="filter">
                            <button className={"btn-primary"} onClick={this.suggestOtherNearbyPlaces}><span>Filter</span> <img src={filter} alt=""/></button>
                        </div>
                        <div className="tab-links">
                            <a href="#list-view" data-tab="places" className="b-nav-tab active" onClick={this.change}>List View</a>
                            <a href="#map-view" data-tab="map" className="b-nav-tab" onClick={this.change}>Map View</a>
                        </div>
                    </div>
                    <div className="tab">
                        <div className="tab-title">
                            <span>Top places in the middle:</span>
                        </div>
                        <div className="other">
                            <button className={this.state.nearbyPlaces[0] ? "btn-primary" : "btn-primary disabled"} onClick={this.suggestOtherNearbyPlaces}>Other top Places</button>
                        </div>
                    </div>
                    <div className="tabset">
                        <div id="places" className="b-tab active">
                            <div className="list-view-block">
                                {this.state.canRenderPlaces ? this.state.forms_data["form_1"].google_place_id !== '' && this.state.forms_data["form_2"] && this.state.forms_data["form_2"].google_place_id !== '' ? this.state.nearbyPlaces[0] ? this.state.nearbyPlaces.map((place, index) => {
                                    return <NearbyPlace place={place} index={index + 1} key={index} popUp={false}/>
                                }) : <div className="instruction-places">
                                    No place available to meet in the middle.
                                </div> : <div className="instruction-places">
                                    No places yet! Enter another location to generate places to meet in the middle.
                                </div> : <ThreeDots color='grey'/>}
                            </div>
                        </div>
                        <div id="map" className="b-tab">
                            {this.state.canRenderMap ? <MapHolder google={this.props.google} forms_count={this.state.forms_count}
                                                                  center={this.state.center} forms_data={this.state.forms_data} nearbyPlaces={this.state.nearbyPlaces}
                                                                  setAddress={this.setAddress} setPosition={this.setPosition} mapCenter={this.state.mapCenter}
                                                                  setPlaceId={this.setPlaceId} addNewForm={this.addNewForm} heatMapData={this.state.heatMapData}
                            /> : <ThreeDots color='grey'/>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: (GoogleAPIKey),
    libraries: ["places", "visualization"],
})(Middle)
