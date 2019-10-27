// require("dotenv").load(); //note1
const jwt = require("jsonwebtoken");

//make sure the user is logged - Authentication
exports.loginRequired = function(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1]; //note2
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
      if (decoded) {
        return next();
      } else {
        return next({
          status: 401,
          messages: "Please log in first"
        });
      }
    });
  } catch (e) {
    return next({ status: 401, message: "Please log in first" });
  }
};

//make sure we get the correct user - Authorization
exports.ensureCorectUser = function(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
      if (decoded && decoded.id === req.params.id) {
        //note1
        return next();
      } else {
        return next({
          status: 401,
          messages: "Unauthorized"
        });
      }
    });
  } catch (e) {
    return next({ status: 401, message: "Unauthorized" });
  }
};
