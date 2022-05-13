import React, {Component} from "react";
import {GoogleApiWrapper, InfoWindow, Map, Marker} from "google-maps-react";
import {getAddressFormLatLng} from "../../utils";

const GoogleAPIKey = process.env.REACT_APP_GOOGLE_API_KEY;

export class MapView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeMarker: {},
            selectedPlace: {},
            showingInfoWindow: false,
            centerAddress: "Center of locations",
            isFullScreen: false
        };
        this.onMapClicked = this.onMapClicked.bind(this);
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onInfoWindowClose = this.onInfoWindowClose.bind(this);
        this.onFullScreenToggle = this.onFullScreenToggle.bind(this);
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

    onMapClicked = () => {
        if (this.state.showingInfoWindow)
            this.setState({
                activeMarker: null,
                showingInfoWindow: false
            });
    };

    async componentDidMount() {
        try {
            const response = await getAddressFormLatLng(this.props.center.lat, this.props.center.lng);
            this.setState({
                centerAddress: response.results[0].formatted_address
            });
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        if (!this.props.loaded) return <div>Loading...</div>;

        return (
            <div className={this.state.isFullScreen ? "map-holder-full" : "map-holder"}>
                <Map google={this.props.google} onClick={this.onMapClicked} zoom={12} style={{width: "80%", height: "500px", position: "relative"}} initialCenter={this.props.center}>
                    <Marker position={this.props.center} name={this.state.centerAddress} onClick={this.onMarkerClick}
                            icon={{
                                url: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
                                anchor: new this.props.google.maps.Point(16, 16),
                                scaledSize: new this.props.google.maps.Size(32, 32)
                            }}/>

                    {this.props.locations.map((location, index) => {
                        return (
                            <Marker position={{lat: location.latitude, lng: location.longitude}} name={`${location.name}: ${location.address}`} onClick={this.onMarkerClick}/>
                        )
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

export default GoogleApiWrapper({
    apiKey: GoogleAPIKey,
})(MapView);

