var loop = require('./loop');

var _ex = module.exports = constructor;

function constructor(options) {

  _ex.options = options || {};

  _ex.loop = loop.createClient(_ex.options.redis);

  return _ex;
}

_ex.middleware = function(req, res, next) {
  if (req.user) {

    var user_id = req.user[(_ex.options.user_key || '_id')];

    var action_type = (_ex.options.prepend || '') + req.url;

    _ex.loop.add(user_id, action_type);
  }

  next();
};
