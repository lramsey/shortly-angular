var util = require('../lib/utility');
var crypto = require('crypto');
var Promise = require('bluebird');

var Link = require('../app/models/link').Link;

Link = Promise.promisifyAll(Link);
getUrlTitle = Promise.promisify(util.getUrlTitle);

var isProduction = process.env.NODE_ENV === 'production';

exports.renderIndex = function(req, res) {
  console.log(new Date(),"@renderIndex");
  res.render('index', {
    production: isProduction
  });
};

exports.fetchLinks = function(req, res) {
  console.log(new Date(),"@fetchLnks");
  Link.findAsync({})
  .then(function(links){
    res.send(200, links);
  }).caught(function(err){
    console.log(err);
    res.status(503).send("Internal server error");
  });
};

exports.saveLink = function(req, res) {
  console.log(new Date(),"@saveLink");
  var uri = req.body.url;
  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }
  Link.find({url:uri}, function(err, array){
    if(err){
      throw err;
    }
    var json = (array.length>0) ? array[0] : {url:uri, base_url:req.headers.origin} ;
    json.title = json.title || util.getUrlTitle(uri) ;
    if(array.length === 0 || array[0].visits !== req.body.visits){
      json.code = json.code || crypto.createHash('sha1').update(json.url).digest('hex').slice(0,5);
      json.updatedAt = Date.now();
    }
    Link.update({url: json.uri, code: json.code}, json, {upsert: true}, function(){});
  });
};

exports.navToLink = function(req, res) {
  console.log(new Date(),"@navToLink");

  Link.findAsync( { code: req.params[0] })
    .then(function(err, link){
      if(!!err){
        console.log(err);
        res.status(503).send("Internal server error");
      } else if (!link[0]){
        res.redirect('/');
      } else {
        return res.redirect(link[0].url);
      }
    });
};