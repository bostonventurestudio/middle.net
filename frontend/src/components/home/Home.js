import React, {Component} from 'react';
import Form from "../form/Form";
import {getLocations} from "../../utils";


export class Home extends Component {

    async UNSAFE_componentWillMount() {
        var url = window.location.pathname;
        var slug = url.substring(url.lastIndexOf('/') + 1);
        if (slug && slug !== "add-location") {
            try {
                const response = await getLocations(slug);
                if (response.data.length === 0) {
                    window.location.href = "/not-found";
                }
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
                        <Form/>
                    </div>
                </div>
            </main>
        )
    }
}
