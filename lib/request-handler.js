var util = require('../lib/utility');
var crypto = require('crypto');
var Promise = require('bluebird');

var Link = require('../app/models/link').Link;

Link = Promise.promisifyAll(Link);

getUrlTitle = Promise.promisify(util.getUrlTitle);

var isProduction = process.env.NODE_ENV === 'production';

exports.renderIndex = function(req, res) {
  res.render('index', {
    production: isProduction
  });
};

exports.fetchLinks = function(req, res) {
  Link.findAsync({})
  .then(function(links){
    res.send(200, links);
  }).caught(function(err){
    console.log(err);
    res.status(503).send("Internal server error");
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;
  var output;
  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }
  Link.findAsync({url:uri})
    .then(function(input){
      if(input.length > 0){
        output = {url:input[0].url, base_url:input[0].base_url, code:input[0].code, title:input[0].title, visits:input[0].visits};
      } else {
        output = {url:uri, base_url:req.headers.origin} ;
      }
      if(input.length === 0 || input[0].visits !== req.body.visits){
        output.code = output.code || crypto.createHash('sha1').update(output.url).digest('hex').slice(0,5);
        output.visits = req.body.visits || 0;
      }
      return (output.title)?output.title:util.getUrlTitle(uri) ; 
      })
    .then(function(title){
      output.title = title;
      Link.update({url: output.url, code: output.code}, output, {upsert: true}, function(err){
        console.log(err);
      });
    });
};

exports.navToLink = function(req, res) {
  console.log(new Date(),"@navToLink");

  Link.findAsync( { code: req.params[0] })
    .then(function(link){
      if (!link[0]){
        res.redirect('/');
      } else {
        return res.redirect(link[0].url);
      }
    }).caught(function(err){
      res.status(503).send("Internal server error "+err);
    });
};