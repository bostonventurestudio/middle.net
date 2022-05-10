import React, {Component} from 'react';
import Map from "../locationSearch/LocationSearch";

class Form extends Component {
    render() {
        return (
            <div>
                <form className="form">
                    <div className="input-holder">
                        <input type="text" placeholder="Enter your nickname or initials"/>
                    </div>
                    <Map center={{lat: 31.587026, lng: 74.336891}} zoom={15}/>
                    <button type="button" className="btn-primary">Middle <i className="icon-right-2"/></button>
                </form>
            </div>
        );
    }
}

export default Form;