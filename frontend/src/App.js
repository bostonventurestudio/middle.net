/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 + Copyright (c) 2022-2022, Boston Venture Studio, Inc - https://www.bvs.net/
 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

import React from "react";
import {BrowserRouter as Router, Navigate, Route, Routes as Switch} from "react-router-dom";
import {Footer, Header, NotFound} from './components';
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
                <Route path={NOT_FOUND} element={<NotFound/>}/>
                <Route path="*" element={<Navigate to={NOT_FOUND}/>}/>
            </Switch>
            <Footer/>
        </Router>
    );
}
