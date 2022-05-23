import React, {Component} from 'react';
import {deleteLocation, getAddressFormLatLng, getLocations, saveLocation} from "../../utils";
import {geocodeByAddress, getLatLng} from "react-places-autocomplete";
import {GoogleApiWrapper} from "google-maps-react";
import Geocode from "react-geocode";
import FormInputs from "../formInputs/FormInputs";
import MapHolder from "../mapHolder/MapHolder";
import Location from "../location/Location";
import NearbyPlace from "../nearbyPlace/NearbyPlace";

const GoogleAPIKey = process.env.REACT_APP_GOOGLE_API_KEY;

Geocode.setApiKey(GoogleAPIKey);
Geocode.enableDebug();

class Middle extends Component {

    constructor(props) {
        super(props);
        this.state = {
            forms_count: 1,
            forms_data: {
                form_1: {
                    address: '',
                    place_id: '',
                    position: {lat: 0, lng: 0},
                    isCorrectLocation: true,
                },
            },
            locations: [],
            nearbyPlaces: [],
            center: null,
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
        this.handleSubmit = this.handleSubmit.bind(this);
        this.deleteLocationHandler = this.deleteLocationHandler.bind(this);
    }

    async componentDidMount() {
        this.setState({canRender: false});
        await navigator.geolocation.getCurrentPosition(async (position) => {
            this.setPosition({lat: position.coords.latitude, lng: position.coords.longitude}, "form_1");
            try {
                const response = await getAddressFormLatLng(position.coords.latitude, position.coords.longitude);
                this.setState(state => {
                    state.forms_data["form_1"].address = response.results[0].formatted_address;
                    state.forms_data["form_1"].place_id = response.results[0].place_id;
                    return state;
                });
            } catch (e) {
                console.log(e);
            }
        });

        this.setState({canRender: true});
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
                state.forms_data[form_key].position = {lat: 0, lng: 0};
                state.forms_data[form_key].place_id = '';
            }
            return state;
        });
    }

    setPosition(position, form_key) {
        this.setState(state => {
            state.forms_data[form_key].position = position;
            return state;
        });
    }

    setCenter(center) {
        this.setState({center: center});
    }

    setPlaceId(place_id, form_key) {
        this.setState(state => {
            state.forms_data[form_key].place_id = place_id;
            return state;
        });
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
                this.setPosition(position, form_key);
            })
            .catch(error => console.error('Error', error));

    }

    addNewForm(event = null) {
        if (event) {
            event.preventDefault();
        }
        const forms_count = this.state.forms_count + 1;
        this.setState(state => {
            state.forms_count = forms_count;
            state.forms_data[`form_${forms_count}`] = {
                address: '',
                place_id: '',
                position: {lat: 0, lng: 0},
                isCorrectLocation: true,
            };
            return state;
        });
    }

    deleteForm(event, form_key) {
        event.preventDefault();
        const forms_count = this.state.forms_count - 1;
        const forms_data = this.state.forms_data;
        delete forms_data[form_key];
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
            if (this.state.forms_data[form_key].position.lat === 0 && this.state.forms_data[form_key].position.lng === 0) {
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
            const locations = response.data;
            this.setState({locations: response.data,
            forms_count: 1})
            // window.location.href = `/${locations[0].slug}?redirected=True`;
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


    render() {
        if (!this.state.canRender) {
            return null;
        }
        return (
            <div>
                <form className="form" onSubmit={this.handleSubmit}>
                    {
                        Object.keys(this.state.forms_data).map((form_key, index) => (
                            <FormInputs key={index} form_key={form_key}
                                        isCorrectLocation={this.state.forms_data[form_key].isCorrectLocation}
                                        position={this.state.forms_data[form_key].position}
                                        address={this.state.forms_data[form_key].address}
                                        setAddress={this.setAddress}
                                        handleAddressSelect={this.handleAddressSelect}
                                        canDelete={this.state.forms_count > 1 && index === this.state.forms_count - 1}
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
                            <a href="#places-view" data-tab="places" className="b-nav-tab active" onClick={this.change}>Places</a>
                            <a href="#locations-view" data-tab="locations" className="b-nav-tab" onClick={this.change}>Locations</a>
                            <a href="#map-view" data-tab="map" className="b-nav-tab" onClick={this.change}>Map</a>
                        </div>
                    </div>
                    <div className="tabset">
                        <div id="places" className="b-tab active">
                            <div className="list-view-block">
                                <NearbyPlace locations={this.state.locations} forms_count={this.state.forms_count} forms_data={this.state.forms_data} setCenter={this.setCenter}/>
                                {/*{this.state.canRender && this.state.nearbyPlaces.length > 0 ? this.state.nearbyPlaces.map((place, index) => {*/}
                                {/*    return <NearbyPlace place={place} index={index + 1} key={index}/>*/}
                                {/*}) : <div className="instruction-places">*/}
                                {/*    No places yet! Enter another location to generate places to meet in the middle.*/}
                                {/*</div>}*/}
                            </div>
                        </div>
                        <div id="locations" className="b-tab">
                            <div className="list-view-block">
                                {this.state.locations.length > 0 && this.state.locations.map((location, index) => {
                                    return <Location canDelete={true} location={location} index={index + 1} key={index} deleteLocation={this.deleteLocationHandler}/>
                                })}

                                {this.state.forms_data['form_1'].place_id !== '' && Object.keys(this.state.forms_data).map((form_key, index) => (
                                    <Location canDelete={false} location={this.state.forms_data[form_key]} index={this.state.locations.length + index + 1} key={index} deleteLocation={this.deleteLocationHandler}/>
                                ))}
                                {!(this.state.locations.length > 0 || this.state.forms_data['form_1'].place_id !== '') &&
                                <div className="instruction-locations">
                                    No Locations Available.
                                </div>}
                            </div>
                        </div>
                        <div id="map" className="b-tab">
                            <MapHolder google={this.props.google} locations={this.state.locations}
                                       forms_count={this.state.forms_count} center={this.state.center}
                                       forms_data={this.state.forms_data}
                                       setAddress={this.setAddress}
                                       setPosition={this.setPosition}
                                       setPlaceId={this.setPlaceId}
                                       addNewForm={this.addNewForm}
                            />
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