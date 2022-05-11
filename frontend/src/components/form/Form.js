import React, {Component} from 'react';
import Map from "../locationSearch/LocationSearch";

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            position: {
                lat: 0,
                lng: 0
            },
        };
        this.setCurrentPosition = this.setCurrentPosition.bind(this);
    }

    setCurrentPosition(position) {
        this.setState({position: {lat: position.coords.latitude, lng: position.coords.longitude}});
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(this.setCurrentPosition);
    }

    render() {
        return (
            <div>
                <form className="form">
                    <div className="input-holder">
                        <input type="text" placeholder="Enter your nickname or initials"/>
                    </div>
                    <Map state={this.state} zoom={16}/>
                    <button type="button" className="btn-primary">Middle <i className="icon-right-2"/></button>
                </form>
            </div>
        );
    }
}

export default Form;