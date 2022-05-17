# React Middle
This is the React Middle application.

## Prerequisites

- [Node v16](https://nodejs.org/en/docs/)
- [npm](https://docs.npmjs.com/)

#### Google API Key:
Required google API Key having follwing APIs enabled:

- [Maps Javascript API](https://developers.google.com/maps/documentation/javascript)
- [Geocode API](https://developers.google.com/maps/documentation/geocoding)
- [Places API](https://developers.google.com/maps/documentation/places/web-service)


### 1- Clone Repository:
    git clone https://github.com/arbisoft/middle.git

### 2- Change Directory:
    cd frontend

### 3- Made .env File:
    touch .env

Place your Google API Key in this file.
    
    REACT_APP_GOOGLE_API_KEY = 'your_google_api_key'

### 4- Django App URL:
In config.js change APIBaseURL to django app url like `"http://127.0.0.1:8000"`.

    export const APIBaseURL = "your django app url";
    

### 5- Install Dependencies:
    npm install --legacy-peer-deps

### 6- Give frontend access of backend:
In backend/project/settings/base.py place following

    CORS_ALLOWED_ORIGINS = [
        'your_frontend_url',
        ]

### 7- Start Server:
    npm start
