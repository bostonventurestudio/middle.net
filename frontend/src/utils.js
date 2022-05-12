import axios from "axios";
import {APIBaseURL} from "./config";

export function getLocations(slug) {
    return axios.get(APIBaseURL + slug)
        .then(response => response.data)
        .catch(error => console.log('ERROR: ', error));
}

export function saveLocation(data) {
    return axios.post(APIBaseURL, {data})
}

export function copyToClipboard(event, textToCopy) {
    event.preventDefault();
    navigator.clipboard.writeText(textToCopy);
}