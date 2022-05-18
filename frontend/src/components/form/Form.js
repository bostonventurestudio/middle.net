import React, {Component} from 'react';
import {getAddressFormLatLng, saveLocation} from "../../utils";
import {geocodeByAddress, getLatLng} from "react-places-autocomplete";
import {GoogleApiWrapper} from "google-maps-react";
import Geocode from "react-geocode";
import FormInputs from "../formInputs/FormInputs";
import MapHolder from "../mapHolder/MapHolder";

const GoogleAPIKey = process.env.REACT_APP_GOOGLE_API_KEY;

Geocode.setApiKey(GoogleAPIKey);
Geocode.enableDebug()

class Form extends Component {

    constructor(props) {
        super(props);
        this.state = {
            forms_count: 1,
            forms_data: {
                form_1: {
                    name: '',
                    address: '',
                    place_id: '',
                    position: {lat: 0, lng: 0},
                    isCorrectLocation: true,
                }
            },
        };
        this.setName = this.setName.bind(this);
        this.setAddress = this.setAddress.bind(this);
        this.setPosition = this.setPosition.bind(this);
        this.setIsCorrectLocation = this.setIsCorrectLocation.bind(this);
        this.handleAddressSelect = this.handleAddressSelect.bind(this);
        this.addNewForm = this.addNewForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
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
    }

    setName(event, form_key) {
        this.setState(state => {
            state.forms_data[form_key].name = event.target.value;
            return state;
        });
    }

    setIsCorrectLocation(isCorrectLocation, form_key) {
        this.setState(state => {
            state.forms_data[form_key].isCorrectLocation = isCorrectLocation;
            return state;
        });
    }

    setAddress(address, form_key) {
        this.setState(state => {
            state.forms_data[form_key].address = address;
            state.forms_data[form_key].position = {lat: 0, lng: 0};
            return state;
        });
    }

    setPosition(position, form_key) {
        this.setState(state => {
            state.forms_data[form_key].position = position;
            return state;
        });
    }

    setPlaceId(place_id, form_key) {
        this.setState(state => {
            state.forms_data[form_key].place_id = place_id;
            return state;
        });
    }

    handleAddressSelect(address, form_key) {
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

    addNewForm(event) {
        event.preventDefault();
        const forms_count = this.state.forms_count + 1;
        this.setState(state => {
            state.forms_count = forms_count;
            state.forms_data[`form_${forms_count}`] = {
                name: '',
                address: '',
                place_id: '',
                position: {lat: 0, lng: 0},
                isCorrectLocation: true,
            };
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
        var data = [];
        for (form_key in this.state.forms_data) {
            data.push({
                name: this.state.forms_data[form_key].name,
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
            window.location.href = "/top-locations/" + locations[0].slug;

        } catch (e) {
            console.log(e);
        }
    };


    render() {
        return (
            <div>
                <form className="form" onSubmit={this.handleSubmit}>
                    {
                        Object.keys(this.state.forms_data).map((form_key, index) => (
                            <FormInputs key={index} form_key={form_key}
                                        isCorrectLocation={this.state.forms_data[form_key].isCorrectLocation}
                                        name={this.state.forms_data[form_key].name}
                                        position={this.state.forms_data[form_key].position}
                                        address={this.state.forms_data[form_key].address}
                                        setName={this.setName} setAddress={this.setAddress}
                                        handleAddressSelect={this.handleAddressSelect}/>
                        ))
                    }
                    <div className="add-location">
                        <button onClick={this.addNewForm}>
                            <span className="icon">+</span>
                            <span className="text">Add another location</span>
                        </button>
                    </div>
                    <MapHolder google={this.props.google} forms_count={this.state.forms_count} forms_data={this.state.forms_data} zoom={12}/>
                    <button type="submit" className="btn-primary">Middle <i className="icon-right-2"/></button>
                </form>
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: (GoogleAPIKey)
})(Form)