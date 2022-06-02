import axios from "axios";
import {LocationAPIURL} from "./config";
import {CLOSED, OPEN, OPEN_24_HOURS} from "./constants";
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

export function getCenterOfPolygonLatLngs(arr) {
    var x = arr.map(xy => xy[0]);
    var y = arr.map(xy => xy[1]);
    var cx = (Math.min(...x) + Math.max(...x)) / 2;
    var cy = (Math.min(...y) + Math.max(...y)) / 2;
    return {lat: Number((cx).toFixed(5)), lng: Number((cy).toFixed(5))};
}

export function get12HourTime(opening_hours, open_or_close) {
    var day = ((new Date()).getDay() + 6) % 7;
    if (opening_hours && opening_hours.weekday_text && opening_hours.weekday_text.length >= day && opening_hours.weekday_text[day]) {
        var time_str = opening_hours.weekday_text[day].split(": ");
        if (time_str.length >= 1) {
            if (time_str[1] === OPEN_24_HOURS || time_str[1] === CLOSED) {
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

export function sortPlacesBasedOnDistanceFromCenter(places, center) {
    const distance = (place, center) => {
        const x = center.lat - place.geometry.location.lat();
        const y = center.lng - place.geometry.location.lng();
        return Math.sqrt((x * x) + (y * y));
    };
    const sorter = (placeA, placeB) => distance(placeA, center) - distance(placeB, center);
    places.sort(sorter);
    return places;
}

export function distanceBetweenTwoLocations(loc1, loc2) {
    if (loc1.lat === loc2.lat && loc1.lng === loc2.lng) {
        return 0;
    } else {
        var radlat1 = Math.PI * loc1.lat / 180;
        var radlat2 = Math.PI * loc2.lat / 180;
        var theta = loc1.lng - loc2.lng;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        return dist * 1609.34;
    }
}

export function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}