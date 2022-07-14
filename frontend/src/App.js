/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 + Copyright (c) 2022-2022, Boston Venture Studio, Inc - https://www.bvs.net/
 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

import React from "react";
import {BrowserRouter as Router, Route, Routes as Switch} from "react-router-dom";
import {Footer, Header, NotFound} from './components';
import {Home2} from "./components/home2/Home2";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";
import Home from "./components/home/Home";
import {HOME, HOME_WITH_ID, NOT_FOUND} from "./constants";

export default function App() {
    return (
        <Router>
            <ToastContainer autoClose={3000} pauseOnFocusLoss={false} pauseOnHover={false}/>
            <Header/>
            <Switch>
                <Route path={HOME} element={<Home/>}/>
                <Route path={HOME_WITH_ID} element={<Home/>}/>
                <Route path="/solution-2" element={<Home2/>}/>
                <Route path="/solution-2/:url" element={<Home2/>}/>
                <Route path={NOT_FOUND} element={<NotFound/>}/>
            </Switch>
            <Footer/>
        </Router>
    );
}
