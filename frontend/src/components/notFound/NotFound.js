import React, {Component} from 'react';
import Form from "../form/Form";


export class NotFound extends Component {
    render() {
        return (
            <main id="main">
                <div className="content-block">
                    <div className="container">
                        <h2 className="not-found">Requested URL not found.</h2>
                    </div>
                </div>
            </main>
        )
    }
}
