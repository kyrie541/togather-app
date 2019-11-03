import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { logout } from "../../../actions/auth";

const Navbar = ({ action, currentUser, history }) => {
  const activeStyle = { color: "blue" };

  const logout = e => {
    e.preventDefault();
    action.logout();
  };

  return (
    <div>
      {currentUser.isAuthenticated ? (
        <>
          <NavLink exact to="/events" activeStyle={activeStyle}>
            View Events
          </NavLink>
          {" | "}
          <a onClick={logout}>Log out</a>
        </>
      ) : (
        <>
          <NavLink exact to="/signin" activeStyle={activeStyle}>
            Sign In
          </NavLink>
          {" | "}
          <NavLink to="/signup" activeStyle={activeStyle}>
            Sign Up
          </NavLink>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
