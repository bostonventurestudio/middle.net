import React, {Component} from 'react';
import {InfoWindow, Map, Marker} from "google-maps-react";
import {getAddressFormLatLng} from "../../utils";

class MapHolder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeMarker: {},
            selectedPlace: {},
            showingInfoWindow: false,
            isFullScreen: false
        };
        this.onMapClicked = this.onMapClicked.bind(this);
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onInfoWindowClose = this.onInfoWindowClose.bind(this);
        this.onFullScreenToggle = this.onFullScreenToggle.bind(this);
        this.onMarkerDragEnd = this.onMarkerDragEnd.bind(this);
        document.addEventListener('fullscreenchange', this.onFullScreenToggle);

    }


    onFullScreenToggle = (event) => {
        this.setState({isFullScreen: !this.state.isFullScreen})
    }

    onMarkerClick = (props, marker) =>
        this.setState({
            activeMarker: marker,
            selectedPlace: props,
            showingInfoWindow: true
        });

    onInfoWindowClose = () =>
        this.setState({
            activeMarker: null,
            showingInfoWindow: false
        });

    async onMapClicked(coord) {
        if (this.state.showingInfoWindow) {
            this.setState({
                activeMarker: null,
                showingInfoWindow: false
            });
        } else {
            const forms_count = this.props.forms_count + 1;
            this.props.addNewForm();
            await this.populateLocationData(coord, `form_${forms_count}`);
        }
    };

    async onMarkerDragEnd(coord, form_key) {
        await this.populateLocationData(coord, form_key);
    };

    async populateLocationData(coord, form_key) {
        const lat = coord.latLng.lat();
        const lng = coord.latLng.lng();
        try {
            const response = await getAddressFormLatLng(lat, lng);
            this.props.setAddress(response.results[0].formatted_address, form_key, false);
            this.props.setPlaceId(response.results[0].place_id, form_key);
            this.props.setPosition({lat: lat, lng: lng}, form_key);
        } catch (e) {
            console.log(e);
        }
    }


    render() {
        return (
            <div className={this.state.isFullScreen ? "map-holder-full" : "map-holder"}>
                <Map
                    google={this.props.google}
                    onClick={(event, map, coord) => this.onMapClicked(coord)}
                    initialCenter={{
                        lat: this.props.forms_data[`form_${this.props.forms_count}`].position.lat,
                        lng: this.props.forms_data[`form_${this.props.forms_count}`].position.lng
                    }}
                    center={{
                        lat: this.props.forms_data[`form_${this.props.forms_count}`].position.lat,
                        lng: this.props.forms_data[`form_${this.props.forms_count}`].position.lng
                    }}
                    zoom={12} style={{width: "80%", height: "500px"}}>
                    {
                        Object.keys(this.props.forms_data).map((form_key, index) => (
                            <Marker
                                position={{
                                    lat: this.props.forms_data[form_key].position.lat,
                                    lng: this.props.forms_data[form_key].position.lng
                                }}
                                draggable={true}
                                name={this.props.forms_data[form_key].address}
                                onClick={this.onMarkerClick}
                                onDragend={(event, map, coord) => this.onMarkerDragEnd(coord, form_key)}/>
                        ))
                    }

                    <InfoWindow
                        marker={this.state.activeMarker}
                        onClose={this.onInfoWindowClose}
                        visible={this.state.showingInfoWindow}
                    >
                        <div>
                            <h4>{this.state.selectedPlace.name}</h4>
                        </div>
                    </InfoWindow>
                </Map>
            </div>
        );
    }
}

export default MapHolder;