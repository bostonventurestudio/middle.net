/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 + Copyright (c) 2022-2022, Boston Venture Studio, Inc - https://www.bvs.net/
 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

import React, {Component} from 'react';
import {getLocationDetailFormLatLng} from "../../utils";
import {GoogleApiWrapper} from "google-maps-react";
import Geocode from "react-geocode";
import FormInputs from "../formInputs/FormInputs";
import MapHolder from "../mapHolder/MapHolder";
import {BAR, COFFEE, MAX_RADIUS, MIN_RADIUS, RESTAURANT} from "../../constants";
import NearbyPlace from "../nearbyPlace/NearbyPlace";
import icon_copy from "../../images/iconCopy.png";
import filter from "../../images/filter.svg";
import {addNewForm, copyLinkToClipboard, deleteForm, findHeatMapDataAndNearbyPlaces, getNearbyPlaceDetail, handleAddressSelect, handleSubmit, moveCenterToCustomLocation, populateFormsData, sendNearbyPlacesAPIRequest, setHeatMapData, setNearbyPlaceDetail, setNearbyPlaces, suggestOtherNearbyPlaces} from "./helpers";
import {ThreeDots} from "react-loader-spinner";
import {toast} from "react-toastify";
import Filters from "../filters/Filters";


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
            copied: false,
            totalNearbyPlaces: [],
            nearbyPlacesIndex: 0,
            totalSortedNearbyPlaces: 0,
            nearbyPlaces: new Array(5),
            center: props.center,
            isCustomCenter: props.isCustomCenter,
            mapCenter: props.center,
            canRender: true,
            heatMapData: [],
            searchRadius: MIN_RADIUS,
            maxRadius: MAX_RADIUS,
            showFilters: false,
            types: [RESTAURANT, COFFEE, BAR],
            typeIndex: 0,
            filters: {
                price: {
                    price_level_1: true,
                    price_level_2: true,
                    price_level_3: true,
                    price_level_4: true,
                },
                hours: {
                    all: true,
                    open_now: false,
                },
                type: {
                    restaurant: true,
                    coffee: true,
                    bar: true,
                }
            }
        };
        this.change = this.change.bind(this);
        this.clear = this.clear.bind(this);
        this.setMapCenter = this.setMapCenter.bind(this);
        this.setAddress = this.setAddress.bind(this);
        this.setPosition = this.setPosition.bind(this);
        this.setPlaceId = this.setPlaceId.bind(this);
        this.setIsCorrectLocation = this.setIsCorrectLocation.bind(this);
        this.setFilters = this.setFilters.bind(this);
        this.handleShowFilters = this.handleShowFilters.bind(this);
        this.handleAddressSelect = handleAddressSelect.bind(this);
        this.copyLinkToClipboard = copyLinkToClipboard.bind(this);
        this.addNewForm = addNewForm.bind(this);
        this.deleteForm = deleteForm.bind(this);
        this.findHeatMapDataAndNearbyPlaces = findHeatMapDataAndNearbyPlaces.bind(this);
        this.getNearbyPlaceDetail = getNearbyPlaceDetail.bind(this);
        this.setNearbyPlaceDetail = setNearbyPlaceDetail.bind(this);
        this.setNearbyPlaces = setNearbyPlaces.bind(this);
        this.setHeatMapData = setHeatMapData.bind(this);
        this.sendNearbyPlacesAPIRequest = sendNearbyPlacesAPIRequest.bind(this);
        this.handleSubmit = handleSubmit.bind(this);
        this.populateFormsData = populateFormsData.bind(this);
        this.suggestOtherNearbyPlaces = suggestOtherNearbyPlaces.bind(this);
        this.moveCenterToCustomLocation = moveCenterToCustomLocation.bind(this);
    }

    componentWillMount() {
        const form_key = this.populateFormsData(this.props.locations, true);
        navigator.geolocation.getCurrentPosition((position) => {
            this.setPosition(position.coords.latitude, position.coords.longitude, form_key);
            getLocationDetailFormLatLng(position.coords.latitude, position.coords.longitude)
                .then((response) => {
                    this.setState(state => {
                        state.forms_data[form_key].address = response.results[0].formatted_address;
                        state.forms_data[form_key].google_place_id = response.results[0].place_id;
                        state.isCustomCenter = false;
                        return state;
                    }, this.findHeatMapDataAndNearbyPlaces);
                })
                .catch((error) => {
                    toast.error(error.message ? error.message : error);
                    this.findHeatMapDataAndNearbyPlaces();
                });
        }, (error) => {
            toast.error(error.message ? error.message : error);
            this.findHeatMapDataAndNearbyPlaces();
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
        console.log(event.target);
        event.target.classList.add('active');
        var id = event.currentTarget.getAttribute('data-tab');
        console.log(id);
        console.log(document.getElementById(id));
        document.getElementById(id).classList.add('active');
    }

    setMapCenter(event, form_key) {
        document.getElementById("map-link").click();
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
            state.isCustomCenter = false;
            return state;
        }, this.findHeatMapDataAndNearbyPlaces);
    }

    handleShowFilters() {
        this.setState({showFilters: !this.state.showFilters});
    }

    setFilters(filters) {
        let types = [];
        if (filters.type.restaurant) {
            types.push(RESTAURANT);
        }
        if (filters.type.coffee) {
            types.push(COFFEE);
        }
        if (filters.type.bar) {
            types.push(BAR);
        }
        this.setState({
            filters: filters,
            types: types,
            totalNearbyPlaces: [],
            nearbyPlacesIndex: 0,
            nearbyPlaces: new Array(5),
            searchRadius: MIN_RADIUS,
            canRender: false,
        }, () => {
            this.sendNearbyPlacesAPIRequest(MIN_RADIUS, this.setNearbyPlaces);
        });
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
                                        canDelete={this.state.forms_count > 1 && this.state.canRender}
                                        canTarget={this.state.canRender && this.state.forms_data[form_key].google_place_id}
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
                        <button type="submit" title="save locations and copy link" className={this.state.forms_data["form_1"].google_place_id !== '' ? "btn-primary" : "btn-primary disabled"}><span>Share</span> link <img src={icon_copy} alt=""/></button>
                        {this.state.copied && <div className="copied">
                            link has been copied to clipboard!
                        </div>}
                    </div>
                </form>
                <div className="search-results-block">
                    <div className="tab">
                        <div className="tab-title">
                            <span>Top places in the middle:</span>
                        </div>
                        <div className="filter">
                            <button title="toggle filter" className={this.state.canRender ? "btn-primary" : "btn-primary disabled"} onClick={this.handleShowFilters}><span>Filter</span> <img src={filter} alt=""/></button>
                            {this.state.showFilters && <Filters filters={this.state.filters} closeFilters={this.handleShowFilters} setFilters={this.setFilters}/>}
                        </div>
                        <div className="tab-links">
                            <a href="#list-view" data-tab="places" className="b-nav-tab active" onClick={this.change}>List View</a>
                            <a id="map-link" href="#map-view" data-tab="map" className="b-nav-tab" onClick={this.change}>Map View</a>
                        </div>
                    </div>
                    <div className="tabset">
                        <div id="places" className="b-tab active">
                            <div className="list-view-block">
                                {this.state.canRender ? this.state.forms_data["form_1"].google_place_id !== '' && this.state.forms_data["form_2"] && this.state.forms_data["form_2"].google_place_id !== '' ? this.state.nearbyPlaces[0] ? this.state.nearbyPlaces.map((place, index) => {
                                    return <NearbyPlace place={place} index={index + 1} key={index} popUp={false} filters={this.state.filters.type}/>
                                }) : <div className="instruction-places">
                                    No place available to meet in the middle.
                                </div> : <div className="instruction-places">
                                    No places yet! Enter another location to generate places to meet in the middle.
                                </div> : <div className="list-loading"><ThreeDots color='white'/></div>}
                            </div>
                        </div>
                        <div id="map" className="b-tab">
                            {this.state.canRender ? <MapHolder google={this.props.google} forms_count={this.state.forms_count}
                                                                  center={this.state.center} forms_data={this.state.forms_data} nearbyPlaces={this.state.nearbyPlaces}
                                                                  setAddress={this.setAddress} setPosition={this.setPosition} mapCenter={this.state.mapCenter}
                                                                  setPlaceId={this.setPlaceId} addNewForm={this.addNewForm} heatMapData={this.state.heatMapData}
                                                                  moveCenterToNewLocation={this.moveCenterToCustomLocation} filters={this.state.filters.type}
                            /> : <div className="map-loading"><ThreeDots color='white'/></div>}
                        </div>
                    </div>
                    <div className="other">
                        <button title="suggest other top location" className={this.state.nearbyPlaces[0] ? "btn-primary" : "btn-primary disabled"} onClick={this.suggestOtherNearbyPlaces}>Other top Places</button>
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
