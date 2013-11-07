var should = require('should');
var async = require('async');

var loop = require('./../lib/loop').createClient();

describe('loop.js', function() {

  before(function(done) {

    var client = require('redis').createClient();

    client.flushall(function(err, obj) {
      client.quit();

      var events = [
        ['he', 'stand-to-pee'],
        ['he', 'stand-to-pee'],
        ['he', 'sit-to-pee'],
        ['he', 'stand-to-pee'],
        ['she', 'sit-to-pee'],
        ['she', 'sit-to-pee'],
        ['roger', 'doesnt-pee']
      ];

      async.map(events, function(event, cb) {
        loop.add(event[0], event[1], cb);
      }, function(err, results) {
        done();
      });

    });
  });

  describe('#loop_percUsing', function() {
    it('should tell 66% of the users sit to pee', function(done) {
      loop.percUsing('sit-to-pee', function(err, obj) {
        obj.should.eql(66.67);
        done();
      });
    });

    it('should tell 33% of the users dont pee', function(done) {
      loop.percUsing('doesnt-pee', function(err, obj) {
        obj.should.eql(33.33);
        done();
      });
    });
  });

  describe('#loop_averageUse', function() {
    it('should tell the users who stand to pee do it 3 times in average', function(done) {
      loop.averageUse('stand-to-pee', function(err, obj) {
        obj.should.eql(3);
        done();
      });
    });

    it('should tell the users who sit to pee do it 1.5 times in average', function(done) {
      loop.averageUse('sit-to-pee', function(err, obj) {
        obj.should.eql(1.5);
        done();
      });
    });
  });

  describe('#fullStats', function() {
    it('should return an array with all actions and stats', function(done) {
      loop.fullStats(function(err, obj) {
        obj.should.eql([{
          action: 'stand-to-pee',
          percUsing: '33.33',
          averageUse: '3.00'
        }, {
          action: 'sit-to-pee',
          percUsing: '66.67',
          averageUse: '1.50'
        }, {
          action: 'doesnt-pee',
          percUsing: '33.33',
          averageUse: '1.00'
        }]);
        done();
      });
    });
  });

});
