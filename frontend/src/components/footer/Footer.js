import React from 'react';
import {Link} from "react-router-dom";

export const Footer = () => {
    return (
        <footer id="footer">
            <div className="container">
                <div className="links">
                    <Link className="link" to="/">Home</Link>
                    <a className="link" href="https://www.info.middle.net/about">About</a>
                    <a className="link-last" href="https://www.info.middle.net/contact">Contact</a>
                </div>
            </div>
        </footer>
    )
}