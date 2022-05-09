import logo from "../../images/logo.svg";
import React from 'react';

export const Header = (props) => {
    return (
        <header id="header">
            <div className="container">
                <div className="logo">
                    <a href="#"><img src={logo} alt="Middle"/></a>
                </div>
                <span className="sub-text">Meet in the Middle is the easiest way to find where to meet friends.</span>
            </div>
        </header>
    )
}