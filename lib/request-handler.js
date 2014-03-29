var util = require('../lib/utility');
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

  Link.findAsync({url:uri})
    .then(function(response){
      if(response.length === 0){
        return getUrlTitle(uri)
      } else {
        res.send(200, response[0]);
        return null;
      }
    })
    .then(function(title){
      if(title === null) return null;
      return Link.createAsync({
            url: uri,
            base_url: req.headers.origin,
            title: title
          });
    })
    .then(function(newLink){
      if(newLink === null) return null;
      res.send(newLink);
    })
    .caught(function(err){
      console.log(err);
      res.status(503).send("Internal Server Error");
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