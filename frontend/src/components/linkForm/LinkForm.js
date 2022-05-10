import React from 'react';

export const LinkForm = props => {
    return (
        <form className="form">
            <p>Ok, we have your location!</p>
            <div className="location-url">
                <div className="url-text">
                    <span>middle.net/5j9ioJ</span>
                </div>
                <div className="copy-location">
                    <a href="/">
                        <div className="icon-holder">
                            <i className="icon-copy"/>
                        </div>
                        <span>copy to <br/>clipboard</span>
                    </a>
                </div>
            </div>
            <p>Share this URL with a friend to find places to meet in the middle.</p>
        </form>
    );
};
