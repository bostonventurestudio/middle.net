/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 + Copyright (c) 2022-2022, Boston Venture Studio, Inc - https://www.bvs.net/
 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

import React, {Component} from 'react';
import {getLocations} from "../../utils";
import Middle1 from "../middle1/Middle1";


export class Home1 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            slug: '',
            locations: [],
        };
    }

    componentWillMount() {
        var url = window.location.pathname;
        var slug = url.substring(url.lastIndexOf('/') + 1);
        if (slug) {
            getLocations(slug).then((response) => {
                if (response.data.length === 0) {
                    window.location.href = "/not-found";
                }
                this.setState({
                    locations: response.data,
                    slug: slug,
                    loading: false
                });
            }).catch((error) => {
                console.log(error);
                window.location.href = "/not-found";
            });
        } else {
            this.setState({loading: false});
        }
    }

    render() {
        return (
            <main id="main">
                <div className="content-block">
                    <div className="container">
                        {!this.state.loading && <Middle1 locations={this.state.locations} slug={this.state.slug}/>}
                    </div>
                </div>
            </main>
        )
    }
}
