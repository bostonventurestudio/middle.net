import React, {Component} from 'react';
import {getLocations} from "../../utils";
import Middle from "../middle/Middle";


export class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            locations: [],
        };
    }

    async componentDidMount() {
        var url = window.location.pathname;
        var slug = url.substring(url.lastIndexOf('/') + 1);
        if (slug) {
            try {
                const response = await getLocations(slug);
                if (response.data.length === 0) {
                    window.location.href = "/not-found";
                }
                this.setState({locations: response.data});
            } catch (e) {
                console.log(e);
                window.location.href = "/not-found";
            }
        }
    }

    render() {
        return (
            <main id="main">
                <div className="content-block">
                    <div className="container">
                        <Middle locations={this.state.locations}/>
                    </div>
                </div>
            </main>
        )
    }
}
