
var mongoose = require('./mongo_config').mongoose;
var Promise = require('bluebird');
var crypto = require('crypto');

var linkSchema = mongoose.Schema({
  url: { type: String, index: true , unique: true},
  base_url: String,
  code: { type: String, index: true , unique: true},
  title: String,
  visits: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
},{ autoIndex: false });

// linkSchema.pre('save', function(done){
//   this.updatedAt = Date.now();
//   var shasum = crypto.createHash('sha1');
//   var url = (Array.isArray(this.url))? this.url[0] : this.url;
//   shasum.update(url);
//   this.code = shasum.digest('hex').slice(0,5);
//   done();
// });

exports.Link = mongoose.model('Urls', linkSchema);