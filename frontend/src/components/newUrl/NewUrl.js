import React, {Component} from 'react';
import {LinkForm} from "../linkForm/LinkForm";
import {Location} from "../location/Location";
import {Map} from "../map/Map";

export class NewUrl extends Component {

    constructor(props) {
        super(props);
        this.change = this.change.bind(this);
        this.clear = this.clear.bind(this);
      }

    clear() {
        var menuElements = document.querySelectorAll('[data-tab]');
        for (var i = 0; i < menuElements.length; i++) {
            menuElements[i].classList.remove('active');
            var id = menuElements[i].getAttribute('data-tab');
            document.getElementById(id).classList.remove('active');
        }
    }

    change(e) {
        this.clear();
        e.target.classList.add('active');
        var id = e.currentTarget.getAttribute('data-tab');
        document.getElementById(id).classList.add('active');
    }

    render() {
        return (
            <main id="main">
                <div className="content-block">
                    <div className="container">
                        <LinkForm/>
                        <div className="search-results-block">
                            <p>Top places in the middle:</p>
                            <div className="tabset">
                                <div id="list-view" className="b-tab active">
                                    <div className="list-view-block">
                                        <Location/>
                                        <Location/>
                                        <Location/>
                                        <Location/>
                                        <Location/>
                                    </div>
                                </div>
                                <div id="map-view" className="b-tab">
                                    <Map/>
                                </div>
                            </div>
                            <div className="tab-links">
                                <a href="#list-view" data-tab="list-view" className="b-nav-tab active" onClick={this.change}>List view</a>
                                <a href="#map-view" data-tab="map-view" className="b-nav-tab" onClick={this.change}>Map view</a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }
}