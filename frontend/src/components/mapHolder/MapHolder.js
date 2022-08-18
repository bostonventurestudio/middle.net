/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 + Copyright (c) 2022-2022, Boston Venture Studio, Inc - https://www.bvs.net/
 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

import React, {Component} from 'react';
import {HeatMap, InfoWindow, Map, Marker} from "google-maps-react";
import {getIcon, getLocationDetailFormLatLng} from "../../utils";
import {gradient} from "../../constants";
import NearbyPlace from "../nearbyPlace/NearbyPlace";
import {toast} from "react-toastify";

class MapHolder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeMarker: {},
            showInfoWindow: false,
            centerAddress: "",
            isFullScreen: false,
            showHeatMap: false,
            dragging: false,
        };
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMapClicked = this.onMapClicked.bind(this);
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onInfoWindowClose = this.onInfoWindowClose.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onFullScreenToggle = this.onFullScreenToggle.bind(this);
        this.onMarkerDragEnd = this.onMarkerDragEnd.bind(this);
        this.onCenterMarkerDragEnd = this.onCenterMarkerDragEnd.bind(this);
        this.toggleHeatMap = this.toggleHeatMap.bind(this);
        this.populateLocationData = this.populateLocationData.bind(this);
        document.addEventListener('fullscreenchange', this.onFullScreenToggle);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.state.dragging === nextState.dragging;
    }


    onFullScreenToggle(event) {
        this.setState({isFullScreen: !this.state.isFullScreen});
    }

    onMarkerClick(props, marker) {
        if (this.state.showInfoWindow) {
            this.setState({
                activeMarker: null,
                showInfoWindow: false
            });
        } else {
            this.setState({
                activeMarker: marker,
                showInfoWindow: true
            });
        }
    }

    onInfoWindowClose() {
        this.setState({
            activeMarker: null,
            showInfoWindow: false
        });
    }

    onMouseOver(props, marker) {
        if (!this.state.dragging && (!this.state.showInfoWindow || (this.state.showInfoWindow && !this.state.activeMarker.center))) {
            this.setState({
                activeMarker: marker,
                showInfoWindow: true
            });
        }
    }

    onMouseOut() {
        if (!this.state.dragging && this.state.showInfoWindow) {
            this.setState({
                activeMarker: null,
                showInfoWindow: false
            });
        }
    }

    onMapClicked(coord) {
        if (this.state.showInfoWindow) {
            this.setState({
                activeMarker: null,
                showInfoWindow: false
            });
        } else {
            const form_key = this.props.addNewForm(null, true);
            this.populateLocationData(coord, form_key);
        }
    }

    onMarkerDragEnd(coord, form_key) {
        this.populateLocationData(coord, form_key);
    }

    onCenterMarkerDragEnd(coord) {
        this.props.moveCenterToNewLocation({lat: coord.latLng.lat(), lng: coord.latLng.lng()});
    }

    populateLocationData(coord, form_key) {
        const lat = coord.latLng.lat();
        const lng = coord.latLng.lng();
        getLocationDetailFormLatLng(lat, lng).then((response) => {
            this.props.setAddress(response.results[0].formatted_address, form_key);
            this.props.setPlaceId(response.results[0].place_id, form_key);
            this.props.setPosition(lat, lng, form_key);
        }).catch((error) => {
            toast.error(error.message ? error.message : error);
        });
    }

    onMouseDown() {
        this.setState({dragging: true});

    }

    onMouseUp() {
        this.setState({dragging: false});
    }

    componentWillMount() {
        document.onmousedown = this.onMouseDown;
        document.onmouseup = this.onMouseUp;
        if (this.props.center.lat !== 0 && this.props.center.lng !== 0) {
            getLocationDetailFormLatLng(this.props.center.lat, this.props.center.lng).then((response) => {
                this.setState({centerAddress: response.results[0].formatted_address});
            }).catch((error) => {
                toast.error(error.message ? error.message : error);
            });
        }
    }

    toggleHeatMap() {
        this.setState({showHeatMap: !this.state.showHeatMap});
    }

    render() {
        return (
            <div className={this.state.isFullScreen ? "map-holder-full" : "map-holder"}>
                {!this.state.loading && <Map
                    google={this.props.google}
                    onClick={(event, map, coord) => this.onMapClicked(coord)}
                    initialCenter={this.props.mapCenter}
                    center={this.props.mapCenter}
                    zoom={12} style={{height: "600px"}}>
                    <button className="heatmap-toggle-btn" title="Toggle HeatMap"
                            onClick={this.toggleHeatMap}>{this.state.showHeatMap ? "Hide HeatMap" : "Show HeatMap"}</button>
                    {this.props.heatMapData.length > 0 && this.state.showHeatMap &&
                    <HeatMap gradient={gradient} positions={this.props.heatMapData} opacity={0.8} radius={20}/>}
                    {Object.keys(this.props.forms_data).map((form_key, index) => {
                        return this.props.forms_data[form_key].latitude && this.props.forms_data[form_key].longitude &&
                            <Marker draggable={true} onClick={this.onMarkerClick}
                                    name={this.props.forms_data[form_key].address}
                                    position={{
                                        lat: this.props.forms_data[form_key].latitude,
                                        lng: this.props.forms_data[form_key].longitude
                                    }}
                                    onDragend={(event, map, coord) => this.onMarkerDragEnd(coord, form_key)}/>
                    })}
                    {this.props.nearbyPlaces.map((place, index) => {
                        return (<Marker location={place} icon={{
                            url: getIcon(place.types),
                            anchor: new this.props.google.maps.Point(16, 16),
                            scaledSize: new this.props.google.maps.Size(32, 32)
                        }}
                                        key={index} position={{
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng()
                        }} name={`${place.name}: ${place.vicinity}`} onClick={this.onMarkerClick}/>)

                    })}
                    {this.props.center.lat !== 0 && this.props.center.lng !== 0 &&
                    <Marker center={true} draggable={true} onClick={this.onMarkerClick} position={this.props.center}
                            onMouseover={this.onMouseOver}
                            onMouseout={this.onMouseOut}
                            name={`Center: ${this.state.centerAddress}`}
                            icon={{
                                url: require("../../images/star.png"),
                                anchor: new this.props.google.maps.Point(16, 16),
                                scaledSize: new this.props.google.maps.Size(32, 32)
                            }}
                            onDragend={(event, map, coord) => this.onCenterMarkerDragEnd(coord)} zIndex={999}/>
                    }
                    <InfoWindow marker={this.state.activeMarker} onClose={this.onInfoWindowClose}
                                visible={this.state.showInfoWindow} style={{background: "aqua"}}>
                        {this.state.activeMarker && (this.state.activeMarker.location ?
                                <div className="search-results-block">
                                    <NearbyPlace place={this.state.activeMarker.location} popUp={true}
                                                 style={{background: "#5A9AE4", color: "white", fontWeight: "500"}}
                                                 filters={this.props.filters} directionStyle={{color: "white"}}
                                                 timeStyle={{color: "#034da3"}}/>
                                </div> :
                                (this.state.activeMarker.center ?
                                        <div className="center-info">
                                            <span>drag to move search area</span>
                                        </div> :
                                        <div className="location-info">
                                            <span>{this.state.activeMarker.name}</span>
                                        </div>
                                )
                        )}
                    </InfoWindow>
                </Map>}
            </div>
        );
    }
}

export default MapHolder;