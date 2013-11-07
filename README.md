simple Express middleware using Redis to provide feedback on user actions.

### prerequisite:

You configured a session middleware which populates `req.user`

### configuration:

    var express = require('express'),
      app = express();

    var feedback = require('express-feedback'),
      loop = feedback();

    // this should be after using your session middleware
    app.use(feedback.middleware);

### getting the feedback:

  // percentage of user hiting this url
  loop.percUsing('/url/path', function(err, obj) {
    console(obj);
  });

  // average number of time the url is hit by a user
  loop.averageUse('/url/path', function(err, obj) {
    console(obj);
  });

### options:

Pass options using:

    var feedback = require('express-feedback'),
      loop = feedback(options);

where

    var options = {};

    // Optional. Redis configuration, if absent express-feedback will create a connection on localhost
    options.redis = {
        host: '127.0.0.1',
        port: 2532,
        password: 'secret',
    };

    // Optional. Unique key of the req.user object, default to '_id'
    options.user_key = 'id';

### Experimental:

    // Optional. allow you to sequence the audit by updating its value
    options.prepend: 'alpha_';

    // when using prepend request info with:
    loop.averageUse(<prepend value> + '/url/path', function(err, obj) {
      console(obj);
    });

