import React, {Component} from 'react';
import LocationSearch from "../locationSearch/LocationSearch";

class FormInputs extends Component {
    render() {
        return (
            <div>
                <LocationSearch form_key={this.props.form_key}
                                isCorrectLocation={this.props.isCorrectLocation}
                                address={this.props.address} position={this.props.position}
                                setAddress={this.props.setAddress}
                                handleAddressSelect={this.props.handleAddressSelect}
                                setMapCenter={this.props.setMapCenter}
                                canDelete={this.props.canDelete}
                                deleteForm={this.props.deleteForm}/>
            </div>
        );
    }
}

export default FormInputs;