import React from "react";
import { NavLink } from "react-router-dom";
import have_funImageURL from "../../assets/have_fun.jpeg";

import styles from "./styles.module.css";

const HomePage = () => {
  return (
    <div>
      <h4>Welcome to Togather App</h4>
      <NavLink exact to="/events">
        <img className="fun" src={have_funImageURL} height="500px" />
      </NavLink>
    </div>
  );
};

export default HomePage;
