import { SET_CURRENT_USER } from "../constants/actionTypes";

const DEFAULT_STATE = {
  isAuthenticated: false, //after log in, be true
  user: {} //all the user info when logged in
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        isAuthenticated: !!Object.keys(action.user).length, //note1
        user: action.user
      };
    default:
      return state;
  }
};

//note1: if empty object, return false, if there are keys, return true

//note1: same with Object.keys(action.user).length > 0
