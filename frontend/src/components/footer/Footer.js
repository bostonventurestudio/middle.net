import React from 'react';
import {Link} from "react-router-dom";

export const Footer = (props) => {
    return (
        <footer id="footer">
            <div className="container">
                <span>Meet in the Middle</span>
                <div className="links">
                    <Link className="link" to="/">Home</Link>
                    <Link className="link" to="/about">About</Link>
                    <Link className="link" to="/team">Team</Link>
                    <Link className="link" to="/term" >Term</Link>
                    <Link className="link" to="/privacy">Privacy</Link>
                    <Link className="link-last" to="/contact">Contact</Link>
                </div>
                <span><a href='https://www.bvs.net/'> Boston Venture Studio project</a></span>
            </div>
        </footer>
    )
}