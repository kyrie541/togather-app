const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.Promise = Promise;
// mongoose.connect('mongodb://localhost/togather', {
//   keepAlive: true,
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
//   useFindAndModify: false
// });

mongoose.connect('mongo', {
  user: process.env.MONGODB_USER,
  pass: process.env.MONGODB_PASSWORD,
  keepAlive: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

module.exports.User = require('./user');
module.exports.Event = require('./event');
