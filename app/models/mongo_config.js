var mongoose = require('mongoose');
var Promise = require('bluebird');

mongoose.connect('mongodb://127.0.0.1:27017/shortly', function(err, res){
  console.log(err, res);
});

exports.mongoose = mongoose;
