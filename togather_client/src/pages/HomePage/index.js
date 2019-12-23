import React from "react";
import { NavLink } from "react-router-dom";

import styles from "./styles.module.css";

const HomePage = () => {
  return (
    <div>
      <h4>Welcome to Togather App</h4>
      <NavLink exact to="/events">
        <img className="fun" src="assets/have_fun.jpeg" height="500px" />
      </NavLink>
    </div>
  );
};

export default HomePage;
