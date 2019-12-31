require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./handlers/error');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');

const { loginRequired } = require('./middleware/auth');

const PORT = 8081;

app.use(cors());
app.use(bodyParser.json());

// UnProtected Route
app.use('/api/auth', authRoutes);

// Protected Route
app.use('/api/events', loginRequired, eventRoutes);
app.use('/api/users', loginRequired, userRoutes);

app.use(function(req, res, next) {
  let err = new Error('Special Not Found');
  err.status = 404;
  next(err);
});

app.use(errorHandler);

app.listen(PORT, function() {
  console.log(`Server is starting on port ${PORT}`);
});
