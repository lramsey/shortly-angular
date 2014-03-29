
var mongoose = require('./mongo_config').mongoose;//require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird');
var bcrypt = require('bcrypt-nodejs');

bcrypt = Promise.promisifyAll(bcrypt);

var userSchema = new Schema({
  username: { type: String, index: true },
  password: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function (done) {
  this.updatedAt = Date.now();
  bcrypt.hashAsync(this.password, null, null).bind(this)
    .then(function(hash){
      this.password = hash;
      console.log(this);
    })
    .then(done);
}, { autoIndex: false });

userSchema.statics.findByUsernamePassword = function (obj, cb) {
  this.findOne({ username: obj.username }, function(err, user){
    if(!!err){
      cb(err);
    } else if(!user) {
      cb('no users found');
    } else {
      bcrypt.compareAsync(obj.password, user.password)
        .then(function(match){
          if(match){
            cb(null, {
              _id: user._id,
              username: (Array.isArray(user.username)) ? user.username[0] : user.username
            });
          } else {
            cb(null, null);
          }
        }).caught(cb);
    }
  });
};

exports.User = mongoose.model('Users', userSchema);