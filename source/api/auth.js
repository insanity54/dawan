var middleware = require('./../middleware'),
    passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy,
    user = require('./user');


var auth = function(app) {


    middleware.serveMaster(app.get('TITLE'), 'index', './@todo put js path here', './@todo put css path here');

    // serialize user object to the session
    // this is called on every authenticated request
    // and stores the identifying information in the sesion data
    passport.serializeUser(function(usr, done) {
	console.log('ima serializeing');
	done(null, usr.id);
    });


    // pull the cookie from the user's browser
    // using the cookie, find who it is that is visiting
    // pull that user's info from the db
    passport.deserializeUser(function(id, done) {
	console.log('ima deserializin and the user id is ' + id );
//	findById(id, function (err, usr) {
//            done(err, usr);
//	});
        done(err, usr);
    });

    
    passport.use(new TwitterStrategy({
        consumerKey: app.get('TWITTER_CONSUMER_KEY'),
        consumerSecret: app.get('TWITTER_CONSUMER_SECRET'),
        callbackURL: "http://dwane.co:9090/api/auth/twitter/callback"
    },

    // when user successfully authenticates with twitter, do this:
        function(token, tokenSecret, profile, done) {
            user.findOrCreate(profile.id, function(err, usr) {

                // done is a passport.js 'verify callback.'
                // in a server exeption, set err to non-null value.
                // in an auth failure, err remains null, and use final arg to pass additional details.
                // more info: http://passportjs.org/guide/configure/
                // error finding or creating user

		if (err) { 
                    console.log('auth mod here. i tried to findorcreate but failed.');
                    return done(err);

		} else {
		    // found or created the user                                       
		    console.log('found: ' + usr);
                    done(null, profile);
		}
            });
	}))







    // testing @todo deleteme
    // route to test if user is logged in or not
    app.get('/api/auth/loggedin', function(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    });

    // route to log in
//    app.post('/api/auth/login', middleware.passport.authenticate('local'), function(req, res) {
//        res.send(req.user);
//    });

    // route to log out
    app.post('/api/auth/logout', function(req, res) {
	req.logOut();
	res.send(200);
    });



    // when user wants to sign in using twitter
    //   - the user's browser posts /api/auth/twitter
    //   - user's browser redirects to twitter
    //   - twitter does it's sign-in/auth thing
    //   - twitter calls back /api/auth/twitter/callback with success or fail
    app.get('/api/auth/twitter',
	    tester,
	    passport.authenticate('twitter'));



    function tester(req, res, next) {
        console.log('tester has run, we had a test');
        next();
    };

    function toaster(req, res, next) {
        console.log('callback has run, lets have a toast');
        next();
    };

    function taster(req, res, next) {
        console.log('we are authenticated, lets have a taste');
        next();
    };
 
    app.get('/api/auth/twitter/callback',
            toaster,
	    passport.authenticate('twitter'),
	    taster,
	    function(req, res) {
		// if this func gets called, auth was successful.
		// req.user contains the authenticated user.
		res.send(req.user.username);		
	    });

    app.get("/secret", function(req, res) {
	//    res.send(nconf.get('secret') + ' <a href="/logout">log</a>');
    });

};

module.exports = auth;




