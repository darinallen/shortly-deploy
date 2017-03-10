var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/shortlydb');
var db = mongoose.connection;

db.on('error', function() {
  console.error.bind(console, 'cannot access database:');
});

db.once('open', function() {
  console.log('success');
});

module.exports = db;
