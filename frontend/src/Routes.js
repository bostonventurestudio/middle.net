import React from "react";
import {BrowserRouter as Router, Navigate, Route, Routes as Switch} from "react-router-dom";
import {Footer, Header, Home, NotFound} from './components';
import TopLocations from "./components/topLocations/TopLocations";

export default function Routes() {
    return (
        <Router>
            <Header/>
            <Switch>
                <Route path="/" element={<Home/>}/>
                <Route path="/:url" element={<Home/>}/>
                <Route path="/not-found" element={<NotFound/>}/>
            </Switch>
            <Footer/>
        </Router>
    );
}
