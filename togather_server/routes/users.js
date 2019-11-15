const express = require("express");
const router = express.Router({ mergeParams: true });

const { getUser } = require("../handlers/users");

// router
//   .route("/")
//   .get(getEvents)
//   .post(createEvent);

router.route("/:user_id").get(getUser);
// .put(updateEvent)
// .delete(deleteEvent);

module.exports = router;
