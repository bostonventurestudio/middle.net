import React, {Component} from 'react';
import {Form} from "../form/Form";


export class Home extends Component {
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
