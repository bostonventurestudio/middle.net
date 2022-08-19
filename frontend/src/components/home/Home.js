/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 + Copyright (c) 2022-2022, Boston Venture Studio, Inc - https://www.bvs.net/
 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

import React, {Component} from 'react';
import {getLocations, withRouter} from "../../utils";
import Middle from "../middle/Middle";
import {ThreeDots} from "react-loader-spinner";
import {NOT_FOUND} from "../../constants";
import {toast} from "react-toastify";


class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            slug: '',
            center: {lat: 0, lng: 0},
            isCustomCenter: false,
            locations: [],
        };
    }

    componentWillMount() {
        var url = window.location.pathname;
        var slug = url.substring(url.lastIndexOf('/') + 1);
        if (slug) {
            getLocations(slug).then((response) => {
                if (response.data.locations.length === 0) {
                    toast.error("Unable to get locations");
                    this.props.router.navigate(NOT_FOUND);
                }
                this.setState({
                    locations: response.data.locations,
                    center: response.data.center ? response.data.center : {lat: 0, lng: 0},
                    isCustomCenter: !!response.data.center,
                    slug: slug,
                    loading: false
                });
            }).catch((error) => {
                toast.error(error.message ? error.message : error);
                this.props.router.navigate(NOT_FOUND);
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
                        {!this.state.loading ? <Middle locations={this.state.locations} center={this.state.center} isCustomCenter={this.state.isCustomCenter} slug={this.state.slug}/> : <ThreeDots color='white'/>}
                    </div>
                </div>
            </main>
        )
    }
}

export default withRouter(Home);