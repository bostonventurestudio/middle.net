/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 + Copyright (c) 2022-2022, Boston Venture Studio, Inc - https://www.bvs.net/
 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

import React from 'react';
import "./footer.css";

export const Footer = () => {
    return (
        <footer id="footer">
            <div className="container">
                <div className="links">
                    <a className="link" href="/">home</a>
                    <a className="link" href="https://www.info.middle.net/about">about</a>
                    <a className="link-last" href="https://www.info.middle.net/contact">contact</a>
                </div>
            </div>
        </footer>
    )
}