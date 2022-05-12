import React from "react";
import {BrowserRouter as Router, Route, Routes as Switch} from "react-router-dom";
import {Footer, Header, Home, TopLocations} from './components';

export default function Routes() {
    return (
        <Router>
            <Header/>
            <Switch>
                <Route path="/" element={<Home/>}/>
                <Route path="/:url" element={<Home/>}/>
                <Route path="/top-locations/:url" element={<TopLocations/>}/>
            </Switch>
            <Footer/>
        </Router>
    );
}
