const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    description: {
      maxLength: 300,
      type: String
    },
    creator: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId
    },
    location: {
      type: String
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    planStartDate: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
