import React from 'react';
export const Home = (props)=>{
    return(
        <main id="main">
            <div className="content-block">
                <div className="container">
                    <form className="form">
                        <div className="input-holder">
                            <input type="search" placeholder="Enter your location"/>
                                <span className="search-icon"><i className="icon-search"></i></span>
                                <span className="target-location"><a href="#"><i className="icon-target"></i></a></span>
                        </div>
                        <div className="input-holder">
                            <input type="text" placeholder="Enter your nickname or initials"/>
                        </div>
                        <button type="button" className="btn-primary">Middle <i className="icon-right-2"></i></button>
                    </form>
                </div>
            </div>
        </main>
    )
}