const db = require("../models"); //note1
const jwt = require("jsonwebtoken");

exports.signin = async function(req, res, next) {
  try {
    let user = await db.User.findOne({
      username: req.body.username
    });
    let { id, username } = user;

    let isMatch = await user.comparePassword(req.body.password);

    if (isMatch) {
      //note3
      let token = jwt.sign(
        {
          id,
          username
        },
        process.env.SECRET_KEY
      );

      return res.status(200).json({
        id,
        username,
        token
      });
    } else {
      return next({
        status: 400,
        message: "Invalid Email/Password"
      });
    }
  } catch (e) {
    return next({ status: 400, message: "Invalid Email/Password" });
  }
};

exports.signup = async function(req, res, next) {
  try {
    let user = await db.User.create(req.body); //note2
    let { id, username } = user;
    let token = jwt.sign(
      {
        //note3
        id,
        username
      },
      process.env.SECRET_KEY //note4
    );

    return res.status(200).json({
      id,
      username,
      token
    });
  } catch (err) {
    if (err.code === 11000) {
      //note5
      err.message = "Sorry, that username and/or email is taken"; //note6
    }
    return next({
      //note7
      status: 400,
      message: err.message
    });
  }
};
