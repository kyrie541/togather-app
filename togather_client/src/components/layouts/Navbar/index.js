import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { logout } from "../../../actions/auth";
import { message } from "antd";

import styles from "./styles.module.css";

const Navbar = ({ action, currentUser, history }) => {
  const activeStyle = { color: "blue" };

  const logout = e => {
    e.preventDefault();
    action.logout();
    message.success(`Log out successfully!`);
  };

  return (
    <div>
      {currentUser.isAuthenticated ? (
        <>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand">
              <NavLink exact to="/" activeStyle={activeStyle}>
                Home
              </NavLink>
            </a>
            <a className="navbar-brand">
              <NavLink exact to="/events" activeStyle={activeStyle}>
                View Events
              </NavLink>
            </a>
            <a className="navbar-brand" onClick={logout}>
              <NavLink>Log out</NavLink>
            </a>
            <div className="navbar-brand">{currentUser.user.username}</div>
          </nav>
        </>
      ) : (
        <>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand">
              <NavLink exact to="/" activeStyle={activeStyle}>
                Home
              </NavLink>
            </a>
            <a className="navbar-brand">
              <NavLink exact to="/signin" activeStyle={activeStyle}>
                Sign In
              </NavLink>
            </a>
            <a className="navbar-brand">
              <NavLink to="/signup" activeStyle={activeStyle}>
                Sign Up
              </NavLink>
            </a>
          </nav>
        </>
      )}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  };
}

const mapDispatchToProps = dispatch => ({
  action: bindActionCreators(
    {
      logout
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
