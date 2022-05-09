import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes as Switch,
  Link
} from "react-router-dom";
import {Home,LocationList,Header,Footer} from './components';
export default function Routes() {
  return (
    <Router>
      <Header/>



        <Switch>
          <Route path="/:url" element={<LocationList />}/>
          <Route path="/" element={<Home />} />
        </Switch>


    <Footer/>

    </Router>
  );
}
