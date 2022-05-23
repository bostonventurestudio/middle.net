import axios from "axios";
import {LocationAPIURL} from "./config";
import {OPEN, OPEN_24_HOURS} from "./constants";
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

export function copyToClipboard(event, textToCopy, element_id) {
    document.getElementById(element_id).style.display = "inline";
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

export function get12HourTime(opening_hours, open_or_close) {
    var day = ((new Date()).getDay() + 6) % 7;
    if (opening_hours && opening_hours.weekday_text && opening_hours.weekday_text.length >= day && opening_hours.weekday_text[day]) {
        var time_str = opening_hours.weekday_text[day].split(": ");
        if (time_str.length >= 1) {
            if (time_str[1] === OPEN_24_HOURS) {
                return time_str[1];
            } else {
                time_str = time_str[1].split(" – ");
                return open_or_close === OPEN ? `Opens ${time_str[0]}` : `Closes ${time_str[time_str.length - 1]}`;
            }
        }
    }
    return '';
}

export function getLocationDetailFormLatLng(lat, lng) {
    return Geocode.fromLatLng(lat, lng);
}

export function getWelcomeMessage(locations) {
    var str = " entered their location, enter your name and location to find a place to meet in the middle!";
    var prefix = "";
    if (locations.length >= 4) {
        prefix = `${locations[0].name}, ${locations[1].name} and ${locations.length - 2} others`;
    } else if (locations.length === 3) {
        prefix = `${locations[0].name}, ${locations[1].name} and ${locations[2].name}`;
    } else if (locations.length === 2) {
        prefix = `${locations[0].name} and ${locations[1].name}`;
    } else {
        prefix = `${locations[0].name}`;
    }
    return prefix + str;
}
