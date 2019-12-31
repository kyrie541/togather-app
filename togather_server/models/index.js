const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.Promise = Promise;
// localhost database URL 'mongodb://localhost/togather'
mongoose
  .connect(process.env.MONGODB_URL, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('success', process.env.MONGODB_URL);
    console.log('Database connect sucessfully');
  })
  .catch(() => {
    console.log('fail', process.env.MONGODB_URL);
    console.log('Database connection Failed');
  });

module.exports.User = require('./user');
module.exports.Event = require('./event');
