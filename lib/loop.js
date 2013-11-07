var redis = require('redis');
var async = require('async');

var _ex = module.exports;

_ex.createClient = function(conf) {
  if (!_ex.client) {
    if (conf) {
      _ex.conf = conf;
      _ex.client = redis.createClient(conf.port, conf.host);
      if (conf.password) {
        _ex.client.auth(conf.password);
      }
    } else {
      _ex.client = redis.createClient();
    }
  }
  return _ex;
};

_ex.add = function(user_id, action_type, cb) {
  _ex.client.multi([
    ['sadd', 'express-feedback-loop:users', user_id],
    ['zincrby', 'express-feedback-loop:action', 1, action_type],
    ['zincrby', 'express-feedback-loop:action:' + action_type, 1, user_id]
  ]).exec(function(err, replies) {
    if (cb) cb(err, replies);
  });
};

_ex.percUsing = function(action_type, cb) {
  _ex.client.multi([
    ['zcard', 'express-feedback-loop:action:' + action_type],
    ['scard', 'express-feedback-loop:users']
  ]).exec(function(err, replies) {
    cb(null, (100 * replies[0] / replies[1]).toFixed(2));
  });
};

_ex.averageUse = function(action_type, cb) {
  _ex.client.multi([
    ['zscore', 'express-feedback-loop:action', action_type],
    ['zcard', 'express-feedback-loop:action:' + action_type]
  ]).exec(function(err, replies) {
    cb(null, (replies[0] / replies[1]).toFixed(2));
  });
};

_ex.list = function(cb) {
  var args = ['express-feedback-loop:action', 0, -1];
  _ex.client.zrevrange(args, cb);
};

_ex.fullStats = function(cb) {

  _ex.list(function(err, obj) {

    var result = [];

    async.parallel([
      function(cb) {
        async.map(obj, _ex.percUsing, cb);
      },
      function(cb) {
        async.map(obj, _ex.averageUse, cb);
      }
    ], function(err, stats) {

      for (var i in obj) {
        result.push({
          action: obj[i],
          percUsing: stats[0][i],
          averageUse: stats[1][i]
        });
      }
      cb(err, result);
    });

  });
};
