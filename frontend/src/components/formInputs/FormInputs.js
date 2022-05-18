import React, {Component} from 'react';
import LocationSearch from "../locationSearch/LocationSearch";

class FormInputs extends Component {
    render() {
        return (
            <>
                <div className="input-holder">
                    <input type="text" placeholder="Enter your nickname or initials" value={this.props.name} onChange={this.props.setName} required/>
                </div>
                <LocationSearch address={this.props.address} position={this.props.position} setAddress={this.props.setAddress} handleAddressSelect={this.props.handleAddressSelect} zoom={16}/>
                <div className="add-location">
                    <a href="#">
                        <span className="icon">+</span>
                        <span className="text">Add another location</span>
                    </a>
                </div>
            </>
        );
    }
}

export default FormInputs;