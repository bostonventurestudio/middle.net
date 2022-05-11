import React, {Component} from 'react';
import axios from 'axios';
import Map from "../locationSearch/LocationSearch";
import {APIBaseURL} from "../../config";

class Form extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            position: {
                lat: 0,
                lng: 0
            },
        };
        this.setName = this.setName.bind(this);
        this.setCurrentPosition = this.setCurrentPosition.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    setName(event) {
        this.setState({name: event.target.value});
    }

    setCurrentPosition(position) {
        this.setState({position: {lat: position.coords.latitude, lng: position.coords.longitude}});
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(this.setCurrentPosition);
    }

    handleSubmit = event => {
        event.preventDefault();
        const data = JSON.stringify({
            name: this.state.name,
            latitude: this.state.position.lat,
            longitude: this.state.position.lng,
            address: this.state.address
        })
        axios.post(APIBaseURL, {data})
            .then(res => {
                console.log(res);
                console.log(res.data);
            })
    };


    render() {
        return (
            <div>
                <form className="form" onSubmit={this.handleSubmit}>
                    <div className="input-holder">
                        <input type="text" placeholder="Enter your nickname or initials" value={this.state.name} onChange={this.setName} required/>
                    </div>
                    <Map state={this.state} zoom={16}/>
                    <button type="submit" className="btn-primary">Middle <i className="icon-right-2"/></button>
                </form>
            </div>
        );
    }
}

export default Form;