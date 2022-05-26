import logo from "../../images/logo.svg";
import React from 'react';

export const Header = () => {
    return (
        <header id="header">
            <div className="container">
                <div className="logo">
                    <a href="/"><img src={logo} alt="Middle"/></a>
                </div>
                <span className="sub-text">meet your friends</span>
            </div>
        </header>
    )
}