import React, {Component} from 'react';
import {InfoWindow, Map, Marker} from "google-maps-react";
import {getLocationDetailFormLatLng} from "../../utils";

class MapHolder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isBigScreen: window.matchMedia("(min-width: 768px)").matches,
            activeMarker: {},
            selectedPlace: {},
            showingInfoWindow: false,
            centerAddress: "",
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
            const form_key = this.props.addNewForm(null, true);
            await this.populateLocationData(coord, form_key);
        }
    };

    async onMarkerDragEnd(coord, form_key) {
        await this.populateLocationData(coord, form_key);
    };

    async populateLocationData(coord, form_key) {
        const lat = coord.latLng.lat();
        const lng = coord.latLng.lng();
        try {
            const response = await getLocationDetailFormLatLng(lat, lng);
            this.props.setAddress(response.results[0].formatted_address, form_key, false);
            this.props.setPlaceId(response.results[0].place_id, form_key);
            this.props.setPosition(lat, lng, form_key);
        } catch (e) {
            console.log(e);
        }
    }

    async componentDidMount() {
        console.log(window.matchMedia("(min-width: 768px)").matches);
        if (this.props.center.lat !== 0 && this.props.center.lng !== 0) {
            try {
                const response = await getLocationDetailFormLatLng(this.props.center.lat, this.props.center.lng);
                this.setState({
                    centerAddress: response.results[0].formatted_address
                });
            } catch (e) {
                console.log(e);
            }
        }
        window.matchMedia("(min-width: 768px)").addEventListener('change', (event) => this.setState({isBigScreen: event.matches}));
    }


    render() {
        const style = {
            height: "500px",
            width: this.state.isBigScreen ? "572px": "85%",
        };
        return (
            <div className={this.state.isFullScreen ? "map-holder-full" : "map-holder"}>
                <Map
                    google={this.props.google}
                    onClick={(event, map, coord) => this.onMapClicked(coord)}
                    initialCenter={this.props.mapCenter}
                    center={this.props.mapCenter}
                    zoom={12} style={style}>
                    {this.props.center.lat !== 0 && this.props.center.lng !== 0 &&
                    <Marker position={this.props.center} name={`Center: ${this.state.centerAddress}`} onClick={this.onMarkerClick}
                            icon={{
                                url: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
                                anchor: new this.props.google.maps.Point(16, 16),
                                scaledSize: new this.props.google.maps.Size(32, 32)
                            }}/>}
                    {Object.keys(this.props.forms_data).map((form_key, index) => (
                        <Marker
                            position={{
                                lat: this.props.forms_data[form_key].latitude,
                                lng: this.props.forms_data[form_key].longitude
                            }}
                            draggable={true}
                            name={this.props.forms_data[form_key].address}
                            onClick={this.onMarkerClick}
                            onDragend={(event, map, coord) => this.onMarkerDragEnd(coord, form_key)}/>
                    ))}

                    {this.props.nearbyPlaces.map((place, index) => {
                        return (
                            <Marker icon={{url: "https://cdn-icons-png.flaticon.com/512/45/45332.png", anchor: new this.props.google.maps.Point(16, 16), scaledSize: new this.props.google.maps.Size(32, 32)}}
                                    key={index} position={{lat: place.geometry.location.lat(), lng: place.geometry.location.lng()}} name={`${place.name}: ${place.vicinity}`} onClick={this.onMarkerClick}/>)
                    })}

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