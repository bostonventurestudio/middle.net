import axios from "axios";
import {GooglePlacesAPIBaseURL, LocationAPIURL, NearbyPlacesAPIURL} from "./config";
import {RADIUS, TYPE} from "./constants";
import Geocode from "react-geocode";

const GoogleAPIKey = process.env.REACT_APP_GOOGLE_API_KEY;

Geocode.setApiKey(GoogleAPIKey);
Geocode.enableDebug();

export function getLocations(slug) {
    return axios.get(LocationAPIURL + slug);
}

export function saveLocation(data) {
    return axios.post(LocationAPIURL, data);
}

export function deleteLocation(slug, id) {
    return axios.delete(`${LocationAPIURL}${slug}?id=${id}`);
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

export function getAddressFormLatLng(lat, lng) {
    return Geocode.fromLatLng(lat, lng);
}