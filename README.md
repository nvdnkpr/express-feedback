# express-feedback

simple Express middleware to provide a feedback loop on users activity

## Prerequisite:

* A session middleware which populates `req.user` is configured (eg: passport.js)
* A redis instance running, or you can pass the redis info to the options (see bellow)

## Configuration:

simple

    feedback = require('express-feedback')();

with options

    var options = {};

    // Optional. Redis configuration, if absent express-feedback will create a connection on localhost
    options.redis = {
        host: '127.0.0.1',
        port: 2532,
        password: 'secret',
    };

    // Optional. Unique key of the req.user object, default to '_id'
    options.user_key = 'id';

    feedback = require('express-feedback')(options);

### General middleware:

`app.use(feedback.middleware);`

`app.use('/api', feedback.middleware);`

Note the declaration should be after the session middleware (but before the router middleware if you have one!)

### More specific middleware

This allow you to narrow even more the listening to the route you care.

    app.get('/some-url', feedback.middleware, function(req, res) {
        //do something
    });


## Usage (aka getting the feedback):

All of the following give a direct value as a result. For a more complete report see the experimental section bellow.

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

**feedback.loop.medianUse(action_key, [cb])**

    // median number of time the url is hit by a user
    feedback.loop.medianUse('/url/path', function(err, obj) {
      console(obj);
    });

## Experimental:

You can use prefix option to sequence the audit.

    // Optional.
    options.prefix: '/alpha_week1/';

    // when using prefix request info with:
    feedback.loop.averageUse(<prefix value> + '/url/path', function(err, obj) {
      console(obj);
    });

You can get the full list of stats using `feedback.loop.fullStats(cb)`

    app.get('/feedback', function(req, res) {
      feedback.loop.fullStats(function(err, obj) {
        res.send(obj);
      });
    });

### Extra:

You can manually log actions without the middleware using `feedback.loop.add(user_id, action_key)`
