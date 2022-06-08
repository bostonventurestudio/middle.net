/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 + Copyright (c) 2022-2022, Boston Venture Studio, Inc - https://www.bvs.net/
 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

import React, {Component} from 'react';


export class NotFound extends Component {
    render() {
        return (
            <main id="main">
                <div className="content-block">
                    <div className="container">
                        <h2 className="not-found">No Location Available for Requested URL</h2>
                    </div>
                </div>
            </main>
        )
    }
}
