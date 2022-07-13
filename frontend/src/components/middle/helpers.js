/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 + Copyright (c) 2022, Boston Venture Studio, Inc - https://www.bvs.net/
 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

import {geocodeByAddress, getLatLng} from "react-places-autocomplete";
import {delay, getCenterOfPolygonLatLngs, getDistanceToFarthestLocationFromCenter, saveLocation, sortPlacesBasedOnDistanceFromCenter} from "../../utils";
import copy from "copy-to-clipboard";
import {MAX_RADIUS, MIN_RADIUS, TYPE} from "../../constants";
import {toast} from "react-toastify";

export function populateFormsData(locations, extra_form=false) {
    var forms_data = {};
    var forms_count;
    var key;
    if (locations.length > 0) {
        for (var i = 0, l = locations.length; i < l; i++) {
            forms_data[`form_${i + 1}`] = locations[i];
        }
        if (extra_form) {
            forms_data[`form_${locations.length + 1}`] = {
                address: '',
                google_place_id: '',
                latitude: 0,
                longitude: 0,
                isCorrectLocation: true,
            };
            forms_count = locations.length + 1;
        } else {
            forms_count = locations.length;
        }
        key = `form_${forms_count}`;
    } else {
        forms_data[`form_1`] = {
            address: '',
            google_place_id: '',
            latitude: 0,
            longitude: 0,
            isCorrectLocation: true,
        };
        forms_count = 1;
        key = `form_${1}`;
    }
    this.setState({
        forms_count: forms_count,
        forms_data: forms_data
    });
    return key;
}

export function addNewForm(event = null, from_map = false) {
    if (event) {
        event.preventDefault();
    }
    for (var form_key in this.state.forms_data) {
        if (this.state.forms_data[form_key].google_place_id === '') {
            if (!from_map) {
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

export function handleAddressSelect(address, form_key) {
    this.setAddress(address, form_key);
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

export function deleteForm(event, form_key) {
    event.preventDefault();
    const place_id = this.state.forms_data[form_key].google_place_id;
    const forms_count = this.state.forms_count - 1;
    const forms_data = {};
    var index = 1;
    for (const [key, value] of Object.entries(this.state.forms_data)) {
        if (key !== form_key) {
            forms_data[`form_${index}`] = value;
            index = index + 1;
        }
    }
    if (place_id !== '') {
        this.setState(state => {
            state.forms_count = forms_count;
            state.forms_data = forms_data;
            return state;
        }, this.setCenterAndNearbyPlaces);
    } else {
        this.setState(state => {
            state.forms_count = forms_count;
            state.forms_data = forms_data;
            return state;
        });
    }
}

export function handleSubmit(event) {
    event.preventDefault();
    var canSubmit = true;
    for (var form_key in this.state.forms_data) {
        if (this.state.forms_data[form_key].google_place_id === '') {
            this.setIsCorrectLocation(false, form_key);
            canSubmit = false;
        }
    }
    if (!canSubmit) {
        return;
    }

    var data = [];
    const slug = this.state.slug === "no-slug" ? '' : this.state.slug;
    for (form_key in this.state.forms_data) {
        data.push({
            google_place_id: this.state.forms_data[form_key].google_place_id,
            address: this.state.forms_data[form_key].address,
            latitude: parseFloat(this.state.forms_data[form_key].latitude).toFixed(5),
            longitude: parseFloat(this.state.forms_data[form_key].longitude).toFixed(5),
            slug: slug
        });
    }
    saveLocation(data).then((response) => {
        if (response.data.length === 0) {
            toast.error("Unable to save locations");
        } else {
            this.populateFormsData(response.data);
            if (this.state.slug === "") {
                this.setState({slug: response.data[0].slug});
            }
            toast.success("Locations saved successfully");
        }
    }).catch((error) => {
        if (this.state.slug === "") {
            this.setState({slug: "no-slug"});
        }
        toast.error(error.message ? error.message : error);
    });
    this.copyLinkToClipboard();
}

export function copyLinkToClipboard() {
    if (this.state.slug === "") {
        setTimeout(this.copyLinkToClipboard, 100);
    } else if (this.state.slug === "no-slug") {
        clearTimeout(this.copyLinkToClipboard);
    } else {
        if (copy(`${window.location.origin}/${this.state.slug}`)) {
            document.getElementById("copied").style.display = "block";
        }
        clearTimeout(this.copyLinkToClipboard);
    }
}

export function setHeatMapData(results, status, pagination) {
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        this.setState({
            heatMapData: this.state.heatMapData.concat(results),
        });
        if (pagination && pagination.hasNextPage) {
            pagination.nextPage();
        } else {
            this.setState({canRenderMap: true});
        }
    } else {
        this.setState({canRenderMap: true});
    }
}

export function getNearbyPlaceDetail(nearbyPlace, index) {
    this.state.service.getDetails({placeId: nearbyPlace.place_id}, (nearbyPlaceDetail, status) => {
        this.setNearbyPlaceDetail(nearbyPlace, nearbyPlaceDetail, status, index);
    });
}

export function setNearbyPlaceDetail(nearbyPlace, nearbyPlaceDetail, status, index) {
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        var nearbyPlaces = this.state.nearbyPlaces;
        nearbyPlaceDetail.distanceFromCenter = nearbyPlace.distanceFromCenter.toFixed(2);
        nearbyPlaces[index] = nearbyPlaceDetail;
        this.setState({nearbyPlaces: nearbyPlaces});
    } else if (status === window.google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
        delay(1000).then(() => {
            this.getNearbyPlaceDetail(nearbyPlace, index);
        });
    }
}

export function setNearbyPlaces(results, status) {
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        if (results.length < 5) {
            if (this.state.searchRadius === this.state.maxRadius) {
                this.setState({totalNearbyPlaces: results});
                const places = sortPlacesBasedOnDistanceFromCenter(results.slice(0, 5), this.state.center);
                places.forEach(this.getNearbyPlaceDetail);
            } else {
                let radius = this.state.searchRadius * 2 > this.state.maxRadius ? this.state.maxRadius : this.state.searchRadius * 2;
                this.setState({searchRadius: radius}, () => {
                    this.sendNearbyPlacesAPIRequest(this.state.searchRadius, this.setNearbyPlaces);
                });
            }
        } else {
            this.setState({totalNearbyPlaces: results});
            const places = sortPlacesBasedOnDistanceFromCenter(results.slice(0, 5), this.state.center);
            places.forEach(this.getNearbyPlaceDetail);
        }
    } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        if (this.state.searchRadius === this.state.maxRadius) return;
        let radius = this.state.searchRadius * 2 > this.state.maxRadius ? this.state.maxRadius : this.state.searchRadius * 2;
        this.setState({searchRadius: radius}, () => {
            this.sendNearbyPlacesAPIRequest(this.state.searchRadius, this.setNearbyPlaces);
        });
    } else if (status === window.google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
        delay(1000).then(() => {
            this.sendNearbyPlacesAPIRequest(this.state.searchRadius, this.setNearbyPlaces);
        });
    }
}

export function setCenterAndNearbyPlaces() {
    this.setState({
        canRenderMap: false,
        totalNearbyPlaces: [],
        nearbyPlacesIndex: 0,
        nearbyPlaces: new Array(5),
        heatMapData: []
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
    var farthestPoint = getDistanceToFarthestLocationFromCenter(lagLngs, center);
    const maxRadius = farthestPoint > MAX_RADIUS ? MAX_RADIUS : farthestPoint;
    this.setState({
        center: center,
        mapCenter: center,
        searchRadius: MIN_RADIUS,
        maxRadius: maxRadius
    }, () => {
        this.sendNearbyPlacesAPIRequest(this.state.searchRadius, this.setNearbyPlaces);
        this.sendNearbyPlacesAPIRequest(maxRadius, this.setHeatMapData);
    });
}

export function sendNearbyPlacesAPIRequest(radius, callback) {
    var nearbyPlacesRequest = {
        location: this.state.center,
        radius: radius,
        type: TYPE,
    };
    this.state.service.nearbySearch(nearbyPlacesRequest, callback);
}

export function suggestOtherNearbyPlaces(event) {
    event.preventDefault();
    let nearbyPlaces = [];
    const nearbyPlacesIndex = this.state.nearbyPlacesIndex + 5;
    if (this.state.totalNearbyPlaces.length > nearbyPlacesIndex) {
        nearbyPlaces = this.state.totalNearbyPlaces.slice(nearbyPlacesIndex, nearbyPlacesIndex + 5);
        this.setState({nearbyPlacesIndex: nearbyPlacesIndex});
    } else {
        if (this.state.nearbyPlacesIndex !== 0) {
            nearbyPlaces = this.state.totalNearbyPlaces.slice(0, 5);
            this.setState({nearbyPlacesIndex: 0});
        }
    }
    if (nearbyPlaces.length > 0) {
        this.setState({nearbyPlaces: new Array(5)}, () => {
            const places = sortPlacesBasedOnDistanceFromCenter(nearbyPlaces, this.state.center);
            places.forEach(this.getNearbyPlaceDetail);
        });
    }
}