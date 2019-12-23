import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import currentUser from "./currentUser";
import errors from "./errors";

const rootReducer = history =>
  combineReducers({
    currentUser,
    errors,
    router: connectRouter(history)
  });

export default rootReducer;
