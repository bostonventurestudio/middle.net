import React from 'react';
import image from "../../images/img-1.jpg";

export const Location = props => {
    return (
        <div className="list-holder">
            <div className="left-block">
                <span className="num">1</span>
                <div className="img-detail-block">
                    <div className="img-holder">
                        <img src={image} alt=""/>
                    </div>
                    <div className="detail-block">
                        <span className="title">Bertucci’s Italian Restaurant</span>
                        <span className="detail">Pasta and more in a cozy, warm setting 950 Massachusetts Ave</span>
                    </div>
                </div>
            </div>
            <div className="right-block">
                <div className="rating-time-block">
                    <ul className="rating-list">
                        <li>4.4</li>
                        <li><i className="icon-star"/></li>
                        <li><i className="icon-star"/></li>
                        <li><i className="icon-star"/></li>
                        <li><i className="icon-star"/></li>
                        <li><i className="icon-star"/></li>
                    </ul>
                    <div className="timing-info">
                        <span className="open">Open</span>
                        <span>Closes 10 PM</span>
                    </div>
                </div>
                <div className="directions-block">
                    <a href="/">
                        <div className="icon-holder">
                            <i className="icon-directions"/>
                        </div>
                        <span>get <br/>directions</span>
                    </a>
                </div>
            </div>
        </div>
    );
};
