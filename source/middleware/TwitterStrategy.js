var nconf = require('nconf');
var redis = require('redis');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('./user.js').User;

//nconf.file({ file: '../../config.json' });

//console.log('here tweetkey: ' + key);



passport.use(new TwitterStrategy({
        // @todo these values need to be passed to this middleware instead of 
        //       calling nconf
        consumerKey: nconf.get('twitter_consumer_key'),
        consumerSecret: nconf.get('twitter_consumer_secret'),
        callbackURL: "http://www.example.com/auth/twitter/callback"
    },

    function(token, tokenSecret, profile, done) {
        User.findOrCreate(profile.id, function(err, user) {
        if (err) { return done(err); }
            done(null, user);
        });
    })
)
