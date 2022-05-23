import logo from "../../images/logo.svg";
import React from 'react';
import {Link} from "react-router-dom";

export const Header = () => {
    return (
        <header id="header">
            <div className="container">
                <div className="logo">
                    <Link to="/"><img src={logo} alt="Middle"/></Link>
                </div>
                <span className="sub-text">meet in the middle</span>
            </div>
        </header>
    )
}