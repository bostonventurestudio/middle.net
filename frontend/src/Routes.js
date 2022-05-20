import React from "react";
import {BrowserRouter as Router, Navigate, Route, Routes as Switch} from "react-router-dom";
import {About, Contact, Footer, Header, Home, NotFound, Privacy, Team, Term, TopLocations} from './components';

export default function Routes() {
    return (
        <Router>
            <Header/>
            <Switch>
                <Route path="/" element={<Navigate replace to="/add-location" />}/>
                <Route path="/add-location" element={<Home/>}/>
                <Route path="/add-location/:url" element={<Home/>}/>
                <Route path="/:url" element={<TopLocations/>}/>
                <Route path="/not-found" element={<NotFound/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/team" element={<Team/>}/>
                <Route path="/term" element={<Term/>}/>
                <Route path="/privacy" element={<Privacy/>}/>
                <Route path="/contact" element={<Contact/>}/>
            </Switch>
            <Footer/>
        </Router>
    );
}
