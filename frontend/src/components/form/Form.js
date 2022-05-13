import React, {Component} from 'react';
import {getAddressFormLatLng, saveLocation} from "../../utils";
import {geocodeByAddress, getLatLng} from "react-places-autocomplete";
import LocationSearch from "../locationSearch/LocationSearch";

class Form extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            position: {
                lat: 0,
                lng: 0
            },
        };
        this.setName = this.setName.bind(this);
        this.setAddress = this.setAddress.bind(this);
        this.setPosition = this.setPosition.bind(this);
        this.handleAddressSelect = this.handleAddressSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        await navigator.geolocation.getCurrentPosition(async (position) => {
            this.setPosition(position);
            try {
                const response = await getAddressFormLatLng(position.coords.latitude, position.coords.longitude);
                this.setState({
                    address: response.results[0].formatted_address
                });
            } catch (e) {
                console.log(e);
            }
        });
    }

    setName(name) {
        this.setState({name: name});
    }

    setAddress(address) {
        this.setState({
            address: address,
            position: {
                lat: 0,
                lng: 0
            },
        });
    }

    setPosition(position) {
        this.setState({position: {lat: position.coords.latitude, lng: position.coords.longitude}});
    }

    handleAddressSelect(address) {
        this.setState({address: address});
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => this.setState({position: latLng}))
            .catch(error => console.error('Error', error));
    }

    async handleSubmit(event) {
        event.preventDefault();
        if (this.state.position.lat === 0 && this.state.position.lng === 0) {
             alert('Invalid Location: Please enter correct location.');
             return;
        }

        var url = window.location.pathname;
        var slug = url.substring(url.lastIndexOf('/') + 1);
        const data = {
            name: this.state.name,
            address: this.state.address,
            latitude: this.state.position.lat.toFixed(5),
            longitude: this.state.position.lng.toFixed(5),
            slug: slug
        };
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
                    <div className="input-holder">
                        <input type="text" placeholder="Enter your nickname or initials" value={this.state.name} onChange={event => {
                            this.setName(event.target.value)
                        }} required/>
                    </div>
                    <LocationSearch address={this.state.address} position={this.state.position} setAddress={this.setAddress} handleAddressSelect={this.handleAddressSelect} zoom={16}/>
                    <button type="submit" className="btn-primary">Middle <i className="icon-right-2"/></button>
                </form>
            </div>
        );
    }
}

export default Form;