// require("dotenv").load();
const db = require("../models");
var _ = require("lodash");

exports.getUser = async function(req, res, next) {
  try {
    let user = await db.User.findById(req.params.user_id);

    // to protect user, just return username and _id
    user = _.pick(user, ["_id", "username"]);

    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
};
