/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 + Copyright (c) 2022-2022, Boston Venture Studio, Inc - https://www.bvs.net/
 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

import React from "react";
import {BrowserRouter as Router, Route, Routes as Switch} from "react-router-dom";
import {Footer, Header, Home, NotFound} from './components';
import {Home1} from "./components/home1/Home1";

export default function Routes() {
    return (
        <Router>
            <Header/>
            <Switch>
                <Route path="/" element={<Home/>}/>
                <Route path="/:url" element={<Home/>}/>
                <Route path="/solution-1" element={<Home1/>}/>
                <Route path="/solution-1/:url" element={<Home1/>}/>
                <Route path="/not-found" element={<NotFound/>}/>
            </Switch>
            <Footer/>
        </Router>
    );
}
