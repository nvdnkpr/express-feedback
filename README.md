# express-feedback

simple Express middleware using Redis to provide feedback on user actions.

## prerequisite:

A session middleware which populates `req.user` is configured (eg: passport.js)

## configuration:

**app.use([path], require('express-feedback')([options]).middleware)**

    var feedback = require('express-feedback')();
    app.use(feedback.middleware); // Note this should be declared after the session middleware


## getting the feedback:

**feedback.loop.percUsing(action_key, [cb])**

    // percentage of user hiting this url
    feedback.loop.percUsing('/url/path', function(err, obj) {
      console(obj);
    });

**feedback.loop.averageUse(action_key, [cb])**

    // average number of time the url is hit by a user
    feedback.loop.averageUse('/url/path', function(err, obj) {
      console(obj);
    });

## options:

Pass options using:

    var feedback = require('express-feedback')(options);

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

## Experimental:

You can use prefix option to sequence the audit.

    // Optional.
    options.prefix: '/alpha_week1/';

    // when using prefix request info with:
    feedback.loop.averageUse(<prefix value> + '/url/path', function(err, obj) {
      console(obj);
    });

### Note:

You can skip using the middleware and register user actions manually using `feedback.loop.add(user_id, action_key)`
