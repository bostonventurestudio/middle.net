/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 + Copyright (c) 2022-2022, Boston Venture Studio, Inc - https://www.bvs.net/
 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

import axios from "axios";
import {LocationAPIURL} from "./config";
import {CLOSED, DEGREE_IN_RADIAN, OPEN, OPEN_24_HOURS} from "./constants";
import Geocode from "react-geocode";
import {useNavigate, useParams} from "react-router-dom";

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
    var x = arr.map(xy => xy.lat);
    var y = arr.map(xy => xy.lng);
    var cx = (Math.min(...x) + Math.max(...x)) / 2;
    var cy = (Math.min(...y) + Math.max(...y)) / 2;
    return {lat: Number((cx).toFixed(5)), lng: Number((cy).toFixed(5))};
}


export function getCenterOfGravityOfLatLngs(latLngs) {
    let lat_sum = 0;
    let lng_sum = 0;
    for (let i = 0; i < latLngs.length; i++) {
        lat_sum += latLngs[i].lat;
        lng_sum += latLngs[i].lng;
    }
    return {lat: lat_sum / latLngs.length, lng: lng_sum / latLngs.length};
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
    places.forEach(place => {
        place.distanceFromCenter = distanceBetweenTwoLocations({lat: place.geometry.location.lat(), lng: place.geometry.location.lng()}, center);
    });
    const sorter = (placeA, placeB) => placeA.distanceFromCenter - placeB.distanceFromCenter;
    places.sort(sorter);
    return places;
}

export function distanceBetweenTwoLocations(location, center) {
    var a = 0.5 - Math.cos((center.lat - location.lat) * DEGREE_IN_RADIAN) / 2 +
        Math.cos(location.lat * DEGREE_IN_RADIAN) * Math.cos(center.lat * DEGREE_IN_RADIAN) *
        (1 - Math.cos((center.lng - location.lng) * DEGREE_IN_RADIAN)) / 2;
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

export function getDistanceToFarthestLocationFromCenter(locations, center) {
    var farthest = 0;
    locations.forEach(location => {
        var distance = distanceBetweenTwoLocations(location, center);
        if (distance > farthest) {
            farthest = distance;
        }
    });
    return Number((farthest * 1000).toFixed(0));
}

export function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

export function getIcon(types) {
    return types.includes("bar") ? require("./images/bar.png") : types.includes("cafe") ? require("./images/coffee.png") : require("./images/restaurant.png");
}

export function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        let navigate = useNavigate();
        let params = useParams();
        return (
            <Component
                {...props}
                router={{navigate, params}}
            />
        );
    }

    return ComponentWithRouterProp;
}
