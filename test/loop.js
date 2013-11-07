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
        ['he', 'stand-to-pee'],
        ['he', 'sit-to-pee'],
        ['he', 'stand-to-pee'],
        ['she', 'sit-to-pee'],
        ['she', 'sit-to-pee'],
        ['roger', 'doesnt-pee'],
        ['a', 'do-something'],
        ['a', 'do-something'],
        ['a', 'do-something'],
        ['a', 'do-something'],
        ['a', 'do-something'],
        ['a', 'do-something'],
        ['a', 'do-something'],
        ['a', 'do-something'],
        ['a', 'do-something'],
        ['a', 'do-something'],
        ['b', 'do-something'],
        ['b', 'do-something'],
        ['c', 'do-something'],

      ];

      async.map(events, function(event, cb) {
        loop.add(event[0], event[1], cb);
      }, function(err, results) {
        done();
      });

    });
  });

  describe('#loop_percUsing', function() {
    it('2 out of 6 users sit-to-pee', function(done) {
      loop.percUsing('sit-to-pee', function(err, obj) {
        obj.should.eql(33.33);
        done();
      });
    });
  });

  describe('#loop_averageUse', function() {
    it('among ppl who sit-to-pee, they do it 1.5 time in average', function(done) {
      loop.averageUse('sit-to-pee', function(err, obj) {
        obj.should.eql(1.5);
        done();
      });
    });
  });

  describe('#loop_medianUse', function() {
    it('the median for do-something is user b which does it 2 times', function(done) {
      loop.medianUse('do-something', function(err, obj) {
        obj.should.eql(2);
        done();
      });
    });
  });

  describe('#fullStats', function() {
    it('should return an array with all actions and stats', function(done) {
      loop.fullStats(function(err, obj) {
        obj.should.eql([{
          action: 'do-something',
          percUsing: '50.00',
          averageUse: '4.33',
          medianUse: '2'
        }, {
          action: 'stand-to-pee',
          percUsing: '16.67',
          averageUse: '4.00',
          medianUse: '4'
        }, {
          action: 'sit-to-pee',
          percUsing: '33.33',
          averageUse: '1.50',
          medianUse: '1'
        }, {
          action: 'doesnt-pee',
          percUsing: '16.67',
          averageUse: '1.00',
          medianUse: '1'
        }]);
        done();
      });
    });
  });

});
