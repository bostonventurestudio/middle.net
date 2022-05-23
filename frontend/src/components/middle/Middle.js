import React, {Component} from 'react';
import {deleteLocation, getCenterOfPolygonLatLngs, getLocationDetailFormLatLng, getLocations, saveLocation} from "../../utils";
import {geocodeByAddress, getLatLng} from "react-places-autocomplete";
import {GoogleApiWrapper} from "google-maps-react";
import Geocode from "react-geocode";
import FormInputs from "../formInputs/FormInputs";
import MapHolder from "../mapHolder/MapHolder";
import {RADIUS, TYPE} from "../../constants";
import NearbyPlace from "../nearbyPlace/NearbyPlace";

const GoogleAPIKey = process.env.REACT_APP_GOOGLE_API_KEY;

Geocode.setApiKey(GoogleAPIKey);
Geocode.enableDebug();

class Middle extends Component {

    constructor(props) {
        super(props);
        this.state = {
            service: new window.google.maps.places.PlacesService(document.createElement('div')),
            forms_count: 1,
            forms_data: {},
            locations: [],
            nearbyPlaces: [],
            center: {lat: 0, lng: 0},
            mapCenter: {lat: 0, lng: 0},
            canRender: false,
            canRenderMap: true,
            showMessage: true,
        };
        this.change = this.change.bind(this);
        this.clear = this.clear.bind(this);
        this.setCenter = this.setCenter.bind(this);
        this.setAddress = this.setAddress.bind(this);
        this.setPosition = this.setPosition.bind(this);
        this.setPlaceId = this.setPlaceId.bind(this);
        this.setIsCorrectLocation = this.setIsCorrectLocation.bind(this);
        this.handleAddressSelect = this.handleAddressSelect.bind(this);
        this.addNewForm = this.addNewForm.bind(this);
        this.deleteForm = this.deleteForm.bind(this);
        this.setCenterAndNearbyPlaces = this.setCenterAndNearbyPlaces.bind(this);
        this.getNearbyPlaceDetail = this.getNearbyPlaceDetail.bind(this);
        this.setNearbyPlaceDetail = this.setNearbyPlaceDetail.bind(this);
        this.setNearbyPlaces = this.setNearbyPlaces.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.deleteLocationHandler = this.deleteLocationHandler.bind(this);
    }

    async componentWillMount() {
        var forms_data = {};
        var forms_count;
        if (this.props.locations.length > 0) {
            for (var i = 0, l = this.props.locations.length; i < l; i++) {
                forms_data[`form_${i + 1}`] = this.props.locations[i];
            }
            forms_data[`form_${this.props.locations.length + 1}`] = {
                address: '',
                google_place_id: '',
                latitude: 0,
                longitude: 0,
                isCorrectLocation: true,
            };
            forms_count = this.props.locations.length + 1;

        } else {
            forms_data[`form_1`] = {
                address: '',
                google_place_id: '',
                latitude: 0,
                longitude: 0,
                isCorrectLocation: true,
            };
            forms_data[`form_2`] = {
                address: '',
                google_place_id: '',
                latitude: 0,
                longitude: 0,
                isCorrectLocation: true,
            };
            forms_count = 2;
        }
        this.setState({
            forms_count: forms_count,
            forms_data: forms_data
        });
        await navigator.geolocation.getCurrentPosition(async (position) => {
            this.setPosition(position.coords.latitude, position.coords.longitude, `form_${this.props.locations.length + 1}`);
            try {
                const response = await getLocationDetailFormLatLng(position.coords.latitude, position.coords.longitude);
                this.setState(state => {
                    state.forms_data[`form_${this.props.locations.length + 1}`].address = response.results[0].formatted_address;
                    state.forms_data[`form_${this.props.locations.length + 1}`].google_place_id = response.results[0].place_id;
                    return state;
                }, await this.setCenterAndNearbyPlaces);
            } catch (e) {
                console.log(e);
            }
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

    setCenter(center) {
        this.setState({center: center});
    }

    setIsCorrectLocation(isCorrectLocation, form_key) {
        this.setState(state => {
            state.forms_data[form_key].isCorrectLocation = isCorrectLocation;
            return state;
        });
    }

    setAddress(address, form_key, isInvalid = true) {
        this.setState(state => {
            state.forms_data[form_key].address = address;
            if (isInvalid) {
                state.forms_data[form_key].latitude = 0;
                state.forms_data[form_key].longitude = 0;
            }
            return state;
        });
        this.setPlaceId('', form_key);
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
            state.forms_data[form_key].google_place_id = place_id;
            return state;
        }, this.setCenterAndNearbyPlaces);
    }

    addNewForm(event = null, data = null) {
        if (event) {
            event.preventDefault();
        }
        const forms_count = this.state.forms_count + 1;
        this.setState(state => {
            state.forms_count = forms_count;
            state.forms_data[`form_${forms_count}`] = {
                address: '',
                google_place_id: '',
                latitude: 0,
                longitude: 0,
                isCorrectLocation: true,
            };
            return state;
        });
    }

    async handleAddressSelect(address, form_key) {
        this.setAddress(address, form_key);
        this.setIsCorrectLocation(true, form_key);
        geocodeByAddress(address)
            .then(results => {
                this.setPlaceId(results[0].google_place_id, form_key);
                return getLatLng(results[0]);
            })
            .then(position => {
                this.setPosition(position.lat, position.lng, form_key);
            })
            .catch(error => console.error('Error', error));

    }

    deleteForm(event, form_key) {
        event.preventDefault();
        const forms_count = this.state.forms_count - 1;
        const form_data_list = Object.values(this.state.forms_data);
        const forms_data = {};
        for (var i = 0, l = form_data_list.length; i < l; i++) {
            if (form_data_list[i].latitude === 0 && form_data_list[i].longitude === 0) {
                forms_data[`form_${i + 1}`] = form_data_list[i];
            }
        }
        this.setState(state => {
            state.forms_count = forms_count;
            state.forms_data = forms_data;
            return state;
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        var canSubmit = true;
        for (var form_key in this.state.forms_data) {
            if (this.state.forms_data[form_key].latitude === 0 && this.state.forms_data[form_key].longitude === 0) {
                this.setIsCorrectLocation(false, form_key);
                canSubmit = false;
            }
        }
        if (!canSubmit) {
            return;
        }

        var url = window.location.pathname;
        var slug = url.substring(url.lastIndexOf('/') + 1);
        if (slug === "add-location") {
            slug = "";
        }
        var data = [];
        for (form_key in this.state.forms_data) {
            data.push({
                google_place_id: this.state.forms_data[form_key].place_id,
                address: this.state.forms_data[form_key].address,
                latitude: this.state.forms_data[form_key].position.lat.toFixed(5),
                longitude: this.state.forms_data[form_key].position.lng.toFixed(5),
                slug: slug
            });
        }
        try {
            const response = await saveLocation(data);
            this.setState({
                locations: response.data,
                forms_count: 1
            });
        } catch (e) {
            console.log(e);
        }
    };

    async deleteLocationHandler(id) {
        this.setState({canRenderMap: false});
        var url = window.location.pathname;
        var slug = url.substring(url.lastIndexOf('/') + 1);
        var response = null;
        if (slug) {
            try {
                await deleteLocation(slug, id);
                response = await getLocations(slug);
                this.setState({locations: response.data});
                if (response.data.length === 0) {
                    window.location.href = "/not-found";
                } else if (response.data.length === 1) {
                    this.setState({
                        center: null,
                        nearbyPlaces: []
                    });
                    this.setState({canRenderMap: true});
                    return;
                }
            } catch (e) {
                console.log(e);
                window.location.href = "/not-found";
            }
        }
        this.setState({canRenderMap: true});
    }

    async getNearbyPlaceDetail(nearbyPlace, index) {
        this.state.service.getDetails({placeId: nearbyPlace.place_id}, await this.setNearbyPlaceDetail);
    }

    async setNearbyPlaceDetail(nearbyPlace, status) {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            var nearbyPlaces = this.state.nearbyPlaces;
            var found = false;
            for (var i = 0; i < nearbyPlaces.length; i++) {
                if (nearbyPlaces[i].place_id === nearbyPlace.place_id) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                nearbyPlaces.push(nearbyPlace);
                this.setState({nearbyPlaces: nearbyPlaces});
            }
        } else {
            console.log(nearbyPlace);
        }
    }

    async setNearbyPlaces(result, status) {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            result = result.slice(0, 5);
            result.forEach(await this.getNearbyPlaceDetail);
        } else {
            console.log("e:", result);
        }
    }

    async setCenterAndNearbyPlaces() {
        this.setState({
            canRenderMap: false,
            nearbyPlaces: [],
        });
        var lagLngs = [];
        var locations = Object.values(this.state.forms_data);
        for (var i = 0, l = locations.length; i < l; i++) {
            if (locations[i].latitude !== 0 && locations[i].longitude !== 0) {
                lagLngs.push([locations[i].latitude, locations[i].longitude]);
            }
        }
        if (lagLngs.length < 2) {
            this.setState({
                canRenderMap: true,
                center: {lat: 0, lng: 0},
                mapCenter: lagLngs.length === 1 ? {lat: lagLngs[0][0], lng: lagLngs[0][1]} : {lat: 0, lng: 0}
            });
            return;
        }
        var center = getCenterOfPolygonLatLngs(lagLngs);
        try {
            var request = {
                location: center,
                radius: RADIUS,
                type: TYPE,
            };
            this.state.service.nearbySearch(request, await this.setNearbyPlaces);
        } catch (e) {
            console.log(e);
        }
        this.setState({
            center: center,
            mapCenter: center,
            canRenderMap: true
        });
    }

    render() {
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
                                        canDelete={this.state.forms_count > 2 && index === this.state.forms_count - 1}
                                        deleteForm={this.deleteForm}/>
                        ))
                    }
                    <div className="add-location">
                        <button onClick={this.addNewForm}>
                            <span className="icon">+</span>
                            <span className="text">Add another location</span>
                        </button>
                    </div>
                    <button type="submit" className="btn-primary">Share link <i className="icon-copy"/></button>
                </form>
                <div className="search-results-block">
                    <div className="tab">
                        <div className="tab-title">
                            <div>{this.state.locations.length >= 2 ? "Top places in the middle" : "Enter two or more locations to find places to meet in the middle."}</div>
                        </div>
                        <div className="tab-links">
                            <a href="#list-view" data-tab="places" className="b-nav-tab active" onClick={this.change}>List View</a>
                            <a href="#map-view" data-tab="map" className="b-nav-tab" onClick={this.change}>Map View</a>
                        </div>
                    </div>
                    <div className="tabset">
                        <div id="places" className="b-tab active">
                            <div className="list-view-block">
                                {this.state.nearbyPlaces.length > 1 ? this.state.nearbyPlaces.map((place, index) => {
                                    return <NearbyPlace place={place} index={index + 1} key={index}/>
                                }) : <div className="instruction-places">
                                    No places yet! Enter another location to generate places to meet in the middle.
                                </div>}
                            </div>
                        </div>
                        <div id="map" className="b-tab">
                            {this.state.canRenderMap && <MapHolder google={this.props.google} forms_count={this.state.forms_count}
                                                                   center={this.state.center} forms_data={this.state.forms_data} nearbyPlaces={this.state.nearbyPlaces}
                                                                   setAddress={this.setAddress} setPosition={this.setPosition} mapCenter={this.state.mapCenter}
                                                                   setPlaceId={this.setPlaceId} addNewForm={this.addNewForm} setCenterAndNearbyPlaces={this.setCenterAndNearbyPlaces}
                            />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: (GoogleAPIKey),
    libraries: ["places"],
})(Middle)