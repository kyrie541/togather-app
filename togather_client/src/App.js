/* eslint-disable import/no-named-as-default */
import { Route, Switch } from "react-router-dom";

import { Navbar } from "./components";
import EventListPage from "./pages/EventListPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";
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
          <Route exact path="/" component={HomePage} />
          <Route path="/signin" component={SignInPage} />
          <Route path="/signup" component={SignUpPage} />

          <Route exact path="/events" component={withAuth(EventListPage)} />
          <Route
            exact
            path="/events/create"
            component={withAuth(EventDetailsPage)}
          />
          <Route
            exact
            path="/events/:id"
            component={withAuth(EventDetailsPage)}
          />

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
