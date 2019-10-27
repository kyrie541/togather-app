// require("dotenv").load();
const db = require("../models");
const jwt = require("jsonwebtoken");

exports.createEvent = async function(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    let userId;

    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
      userId = decoded.id;
    });

    const { description, location, planStartDate, title } = req.body;

    let event = await db.Event.create({
      description,
      location,
      planStartDate,
      title,
      creator: userId
    });

    let foundEvent = await db.Event.findById(event._id).populate("creator", {
      username: true
    });

    return res.status(200).json(foundEvent);
  } catch (err) {
    return next(err);
  }
};

exports.getEvents = async function(req, res, next) {
  try {
    let events = await db.Event.find()
      .sort({ createdAt: "desc" })
      .populate("user", {
        username: true
      });

    return res.status(200).json(events);
  } catch (err) {
    return next(err);
  }
};

exports.getEvent = async function(req, res, next) {
  try {
    let event = await db.Event.findById(req.params.event_id);
    return res.status(200).json(event);
  } catch (err) {
    return next(err);
  }
};

exports.updateEvent = async function(req, res, next) {
  try {
    let event = await db.Event.findOneAndUpdate(
      { _id: req.params.event_id },
      req.body,
      {
        new: true
      }
    );

    return res.status(200).json(event);
  } catch (err) {
    return next(err);
  }
};

exports.deleteEvent = async function(req, res, next) {
  try {
    let foundEvent = await db.Event.findById(req.params.event_id);
    await foundEvent.remove();
    return res.status(200).json(foundEvent);
  } catch (err) {
    return next(err);
  }
};
