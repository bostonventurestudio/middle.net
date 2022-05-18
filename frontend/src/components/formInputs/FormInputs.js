import React, {Component} from 'react';
import LocationSearch from "../locationSearch/LocationSearch";

class FormInputs extends Component {
    render() {
        return (
            <div>
                <div className="input-holder">
                    <input type="text" placeholder="Enter your nickname or initials" value={this.props.name} onChange={(event) => {
                        this.props.setName(event, this.props.form_key)
                    }} maxLength={200} required/>
                </div>
                <LocationSearch form_key={this.props.form_key} isCorrectLocation={this.props.isCorrectLocation} address={this.props.address} position={this.props.position} setAddress={this.props.setAddress} handleAddressSelect={this.props.handleAddressSelect}/>
                {this.props.canDelete &&
                <div className="delete-btn-holder">
                    <button className="btn-danger" onClick={(event) => {
                        this.props.deleteForm(event, this.props.form_key)
                    }}>
                        Delete
                    </button>
                </div>}
            </div>
        );
    }
}

export default FormInputs;