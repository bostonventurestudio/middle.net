import React, {Component} from 'react';
import {getLocations} from "../../utils";
import Middle from "../middle/Middle";


export class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            locations: [],
        };
    }

    async componentWillMount() {
        var url = window.location.pathname;
        var slug = url.substring(url.lastIndexOf('/') + 1);
        if (slug) {
            getLocations(slug).then((response) => {
                    if (response.data.length === 0) {
                        window.location.href = "/not-found";
                    }
                    this.setState({
                        locations: response.data,
                        loading: false
                    });
                }
            ).catch((error) => {
                    console.log(error);
                    window.location.href = "/not-found";
                }
            );
        } else {
            this.setState({loading: false});
        }
    }

    render() {
        return (
            <main id="main">
                <div className="content-block">
                    <div className="container">
                        {!this.state.loading && <Middle locations={this.state.locations}/>}
                    </div>
                </div>
            </main>
        )
    }
}
