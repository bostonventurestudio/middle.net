import React from 'react';

export const Form = props => {
    return (
        <div>
            <form className="form">
                <div className="input-holder">
                    <input type="search" placeholder="Enter your location"/>
                    <span className="search-icon"><i className="icon-search"/></span>
                    <span className="target-location"><a href="#"><i className="icon-target"/></a></span>
                </div>
                <div className="input-holder">
                    <input type="text" placeholder="Enter your nickname or initials"/>
                </div>
                <button type="button" className="btn-primary">Middle <i className="icon-right-2"/></button>
            </form>
        </div>
    );
};
