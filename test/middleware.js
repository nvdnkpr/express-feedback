var should = require('should');
var http = require('http');
var app = require('express')();

var feedback = require('./../lib/feedback'),
  loop = feedback();


describe('feedback.js', function() {

  before(function(done) {

    var client = require('redis').createClient();
    client.flushall(function(err, obj) {
      client.quit();

      app.use(function(req, res, next) {
        req.user = { _id: 'foo' };
        next();
      });

      app.use(feedback.middleware);

      app.get('/stand-to-pee', function(req, res) { res.send(200); });

      app.listen(3333);

      http.get({hostname:'localhost', port:3333, path:'/stand-to-pee', agent:false}, function(res) {
        done();
      });

    });
  });

  describe('#middleware', function() {

    it('should register the action', function(done) {
      loop.list(function(err, obj) {
        obj.should.contain('/stand-to-pee');
        done();
      });
    });
  });

});
