/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 + Copyright (c) 2022-2022, Boston Venture Studio, Inc - https://www.bvs.net/
 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

import React, {Component} from 'react';
import LocationSearch from "../locationSearch/LocationSearch";

class FormInputs extends Component {
    render() {
        return (
            <div>
                <LocationSearch
                                google={this.props.google}
                                currentPosition={this.props.currentPosition}
                                form_key={this.props.form_key}
                                isCorrectLocation={this.props.isCorrectLocation}
                                address={this.props.address} position={this.props.position}
                                setAddress={this.props.setAddress}
                                handleAddressSelect={this.props.handleAddressSelect}
                                setMapCenter={this.props.setMapCenter}
                                canDelete={this.props.canDelete}
                                deleteForm={this.props.deleteForm}
                                canTarget={this.props.canTarget}/>
            </div>
        );
    }
}

export default FormInputs;