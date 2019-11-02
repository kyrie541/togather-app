/* eslint-disable import/no-named-as-default */
import { Route, Switch } from "react-router-dom";

import { Navbar } from "./components";
import EventsListPage from "./pages/EventsListpage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import NotFoundPage from "./pages/NotFoundPage";
import PropTypes from "prop-types";
import React from "react";
import { hot } from "react-hot-loader";
import withAuth from "./hocs/withAuth";

// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.

class App extends React.Component {
  render() {
    return (
      <div>
        <Navbar />

        <Switch>
          <Route exact path="/" component={SignInPage} />
          <Route path="/signup" component={SignUpPage} />
          <Route path="/events" component={withAuth(EventsListPage)} />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element
};

export default hot(module)(App);
