/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 + Copyright (c) 2022-2022, Boston Venture Studio, Inc - https://www.bvs.net/
 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

import logo from "../../images/logo.svg";
import React from 'react';
import "./header.css";

export const Header = () => {
    return (
        <header id="header">
            <div className="container">
                <div className="logo">
                    <a href="/"><img src={logo} alt="Middle"/></a>
                    <span className="sub-text"> meet your friends</span>
                    <div>
                        <span className="site-link">by <a href='https://www.bvs.net/'> Boston Venture Studio</a></span>
                    </div>
                </div>
            </div>
        </header>
    )
}