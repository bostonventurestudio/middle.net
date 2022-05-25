import React, {Component} from 'react';
import {copyToClipboard, getCenterOfPolygonLatLngs, getLocationDetailFormLatLng, saveLocation} from "../../utils";
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
            slug: '',
            forms_count: 1,
            forms_data: {},
            nearbyPlaces: [],
            center: {lat: 0, lng: 0},
            mapCenter: {lat: 0, lng: 0},
            canRender: false,
            canRenderMap: true,
            showMessage: true,
        };
        this.change = this.change.bind(this);
        this.clear = this.clear.bind(this);
        this.setMapCenter = this.setMapCenter.bind(this);
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
        this.populateFormsData = this.populateFormsData.bind(this);
    }

    populateFormsData(locations, extra_form=false) {
        var forms_data = {};
        var forms_count;
        var key;
        if (locations.length > 0) {
            for (var i = 0, l = locations.length; i < l; i++) {
                forms_data[`form_${i + 1}`] = locations[i];
            }
            if(extra_form) {
                forms_data[`form_${locations.length + 1}`] = {
                    address: '',
                    google_place_id: '',
                    latitude: 0,
                    longitude: 0,
                    isCorrectLocation: true,
                };
                forms_count = locations.length + 1;
            }else {
                forms_count = locations.length;
            }
            this.setState({slug: locations[0].slug});
            key = `form_${forms_count}`;
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
            key =`form_${1}`;
        }
        this.setState({
            forms_count: forms_count,
            forms_data: forms_data
        });
        return key;
    }

    async componentWillMount() {
        const form_key = this.populateFormsData(this.props.locations, true);
        await navigator.geolocation.getCurrentPosition(async (position) => {
            this.setPosition(position.coords.latitude, position.coords.longitude, form_key);
            try {
                const response = await getLocationDetailFormLatLng(position.coords.latitude, position.coords.longitude);
                this.setState(state => {
                    state.forms_data[form_key].address = response.results[0].formatted_address;
                    state.forms_data[form_key].google_place_id = response.results[0].place_id;
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
        console.log(this.state);
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

    setAddress(address, form_key, isInvalid = true) {
        this.setState(state => {
            state.forms_data[form_key].address = address;
            if (isInvalid) {
                state.forms_data[form_key].latitude = 0;
                state.forms_data[form_key].longitude = 0;
            }
            return state;
        });
        if (this.state.forms_data[form_key].google_place_id !== '') {
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
            state.forms_data[form_key].google_place_id = place_id;
            return state;
        }, this.setCenterAndNearbyPlaces);
    }

    addNewForm(event = null, form_map = false) {
        if (event) {
            event.preventDefault();
        }
        for (var form_key in this.state.forms_data) {
            if (this.state.forms_data[form_key].google_place_id === '') {
                if (!form_map) {
                    this.setIsCorrectLocation(false, form_key);
                }
                return form_key;
            }
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
        return `form_${forms_count}`;
    }

    async handleAddressSelect(address, form_key) {
        this.setAddress(address, form_key);
        this.setIsCorrectLocation(true, form_key);
        geocodeByAddress(address)
            .then(results => {
                this.setPlaceId(results[0].place_id, form_key);
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
        const forms_data = {};
        var index = 1;
        for (const [key, value] of Object.entries(this.state.forms_data)) {
            if (key !== form_key) {
                forms_data[`form_${index}`] = value;
                index = index + 1;
            }
        }
        this.setState(state => {
            state.forms_count = forms_count;
            state.forms_data = forms_data;
            return state;
        }, this.setCenterAndNearbyPlaces);
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

        var data = [];
        for (form_key in this.state.forms_data) {
            data.push({
                google_place_id: this.state.forms_data[form_key].google_place_id,
                address: this.state.forms_data[form_key].address,
                latitude: parseFloat(this.state.forms_data[form_key].latitude).toFixed(5),
                longitude: parseFloat(this.state.forms_data[form_key].longitude).toFixed(5),
                slug: this.state.slug
            });
        }
        try {
            const response = await saveLocation(data);
            this.populateFormsData(response.data);
            copyToClipboard(`${window.location.origin}/${response.data[0].slug}`, "copied");
        } catch (e) {
            console.log(e);
        }
    };

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
        }
    }

    async setNearbyPlaces(result, status) {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            result = result.slice(0, 5);
            result.forEach(await this.getNearbyPlaceDetail);
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
                                        canDelete={this.state.forms_count > 2}
                                        deleteForm={this.deleteForm}
                                        setMapCenter={this.setMapCenter}/>
                        ))
                    }
                    {this.state.forms_data["form_1"].google_place_id !== '' && this.state.forms_data["form_2"].google_place_id !== '' && <div className="add-location">
                        <button onClick={this.addNewForm}>
                            <span className="icon">+</span>
                            <span className="text">Add another location</span>
                        </button>
                    </div>}
                    <div className="share-btn-row">
                        <button type="submit" className={this.state.forms_data["form_1"].google_place_id !== '' && this.state.forms_data["form_2"].google_place_id !== '' ? "btn-primary" : "btn-primary disabled"}>Share link <i className="icon-copy"/></button>
                        <div className="copied" id="copied">
                            link has been copied to clipboard!
                        </div>
                    </div>
                </form>
                <div className="search-results-block">
                    <div className="tab">
                        <div className="tab-title">
                            <span>{this.state.center.lat !== 0 && this.state.center.lng !== 0 ? "Places in the middle:" : "Enter two or more locations to find places to meet in the middle."}</span>
                        </div>
                        <div className="tab-links">
                            <a href="#list-view" data-tab="places" className="b-nav-tab active" onClick={this.change}>List View</a>
                            <a href="#map-view" data-tab="map" className="b-nav-tab" onClick={this.change}>Map View</a>
                        </div>
                    </div>
                    <div className="tabset">
                        <div id="places" className="b-tab active">
                            <div className="list-view-block">
                                {this.state.nearbyPlaces.length > 0 ? this.state.nearbyPlaces.map((place, index) => {
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