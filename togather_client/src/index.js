// Set up your application entry point here...
/* eslint-disable import/default */

import React from "react";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
import configureStore, { history } from "./store/configureStore";
import Root from "./Root";
// import './styles/styles.scss';
require("./favicon.ico"); // Tell webpack to load favicon.ico
const store = configureStore();

import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById("app")
);

if (module.hot) {
  module.hot.accept("./Root", () => {
    const NewRoot = require("./Root").default;
    render(
      <AppContainer>
        <NewRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById("app")
    );
  });
}
