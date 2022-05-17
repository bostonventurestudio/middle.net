import React, {Component} from 'react';

class Location extends Component {
    render() {
        return (
            <div className="list-holder">
                <div className="left-block">
                    <span className="num">{this.props.index}</span>
                    <div className="img-detail-block">
                        <div className="detail-block">
                            <span className="title"><b>{this.props.location.name}</b></span>
                            <span className="detail">{this.props.location.address}</span>
                        </div>
                    </div>
                </div>
                <div className="right-block">
                    <div className="rating-time-block">
                    </div>
                    <div>
                        <button className="btn-primary" onClick={(event) => {
                            event.preventDefault();
                            this.props.deleteLocation(this.props.location.id);
                        }}>Delete</button>
                    </div>
                </div>
            </div>
        );
    }

}

export default Location
