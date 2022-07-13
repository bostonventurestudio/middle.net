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
            locations: [],
        };
    }

    componentWillMount() {
        var url = window.location.pathname;
        var slug = url.substring(url.lastIndexOf('/') + 1);
        if (slug) {
            getLocations(slug).then((response) => {
                if (response.data.length === 0) {
                    toast.error("Unable to get locations");
                    this.props.router.navigate(NOT_FOUND);
                }
                this.setState({
                    locations: response.data,
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
                        {!this.state.loading ? <Middle locations={this.state.locations} slug={this.state.slug}/> : <ThreeDots color='grey'/>}
                    </div>
                </div>
            </main>
        )
    }
}

export default withRouter(Home);