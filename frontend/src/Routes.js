import React from "react";
import {BrowserRouter as Router, Route, Routes as Switch} from "react-router-dom";
import {Footer, Header, Home, NewUrl} from './components';

export default function Routes() {
    return (
        <Router>
            <Header/>
            <Switch>
                <Route path="/:url" element={<NewUrl/>}/>
                <Route path="/" element={<Home/>}/>
            </Switch>
            <Footer/>
        </Router>
    );
}
