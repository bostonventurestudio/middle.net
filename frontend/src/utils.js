import axios from "axios";
import {GoogleAPIKey, GooglePlacesAPIBaseURL, LocationAPIURL, NearbyPlacesAPIURL} from "./config";
import {RADIUS, TYPE} from "./constants";

export function getLocations(slug) {
    return axios.get(LocationAPIURL + slug);
}

export function saveLocation(data) {
    return axios.post(LocationAPIURL, data);
}

export function copyToClipboard(event, textToCopy) {
    event.preventDefault();
    navigator.clipboard.writeText(textToCopy);
}

export function getCenterOfPolygonLatLngs(arr) {
    var x = arr.map(xy => xy[0]);
    var y = arr.map(xy => xy[1]);
    var cx = (Math.min(...x) + Math.max(...x)) / 2;
    var cy = (Math.min(...y) + Math.max(...y)) / 2;
    return {lat: cx, lng: cy};
}

export function getNearbyPlaces(location) {
    const data = {
        url: `${GooglePlacesAPIBaseURL}?location=${location}&radius=${RADIUS}&type=${TYPE}&rank_by=${RADIUS}&key=${GoogleAPIKey}`,
    }
    return axios.post(NearbyPlacesAPIURL, data);
}

export function goToAddLocationPage(event) {
    event.preventDefault();
    window.location.href = `/${window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1)}`;
}