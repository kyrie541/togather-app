const express = require('express');
const router = express.Router({ mergeParams: true }); //note1

const {
  createEvent,
  getEvent,
  getEvents,
  deleteEvent,
  updateEvent
} = require('../controllers/events');

router
  .route('/')
  .get(getEvents)
  .post(createEvent);

router
  .route('/:event_id')
  .get(getEvent)
  .put(updateEvent)
  .delete(deleteEvent);

module.exports = router;
