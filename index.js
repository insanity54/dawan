// This file handles includes, setup, and initialization


// modules
var express = require('express'),
    http = require('http'),
    app = express(),
    server = http.createServer(app),
    path = require('path'),
    nunjucks = require('nunjucks'),
    nconf = require('nconf'),
    redis = require('redis'),
    //jsonify = require('redis-jsonify'),
    passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy;

    var middleware = require('./source/middleware');


// api endpoints
//require('./source/api/auth')(app);

// connect to redis
var client = redis.createClient(null, null, {"retry_max_delay": "180000"});

// log errors


// allow use of these specified environment variables (whitelist)
// read the configuration file
nconf.env(['PORT', 'SESSON_SECRET', 'TWITTER_CONSUMER_KEY', 'TWITTER_CONSUMER_SECRET'])
    .file({ file: 'config.json' });

// default configurations if config file does not set them
nconf.defaults({
    'PORT': '8080',
});

// configure the app
app.set('PORT', nconf.get('PORT'));
app.set('SESSION_SECRET', nconf.get('SESSION_SECRET'));
app.set('TWITTER_CONSUMER_KEY', nconf.get('TWITTER_CONSUMER_KEY'));
app.set('TWITTER_CONSUMER_SECRET', nconf.get('TWITTER_CONSUMER_SECRET'));

app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: app.get('SESSION_SECRET') }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.logger('dev')); // @todo for production,  change this
        client.on("error", function(err) {
        console.log("Error " + err);
});
app.use(app.router);




// configure passport
passport.use(new TwitterStrategy({
        consumerKey: app.get('TWITTER_CONSUMER_KEY'),
        consumerSecret: app.get('TWITTER_CONSUMER_SECRET'),
        callbackURL: "http://dwane.co:9090/api/auth/twitter/callback"
    },

    // when user successfully authenticates with twitter, do this:
    function(token, tokenSecret, profile, done) {
//        User.findOrCreate(profile.id, function(err, user) {
//        if (err) { return done(err); }
//              console.log('ima done');
              done(null, profile);
//        });
    })
)

// serialize user object to the session
// this means the 
passport.serializeUser(function(user, done) {
    console.log('ima serializeing');
    done(null, user);
});

// pull the cookie from the user's browser
// using the cookie, find who it is that is visiting
// pull that user's info from the db
passport.deserializeUser(function(user, done) {
    console.log('ima deserializin');
    done(null, user);
});

app.get('/', function(req, res) {
    if(req.user) {
        res.render('index.html');
//        res.send(req.user);
    } else {
        res.send('<a href="/api/auth/twitter">Sign in with Twitter</a>');
    }
});


app.get('/api/auth/twitter', passport.authenticate('twitter'));
app.get('/api/auth/twitter/callback',
	passport.authenticate('twitter', { successRedirect: '/',
                                           failureRedirect: '/login' }));




// set up nunjucks
nunjucksEnv = new nunjucks.Environment( new nunjucks.FileSystemLoader(__dirname + '/public/tpl'),{ autoescape: true });
nunjucksEnv.express(app);

//app.set('views', __dirname + '/tpl');
//app.set('view engine', 'nunjucks');

// pass the secret for signed cookies 
// @todo test: change this once client stores cookie, see if client can still login


// client.set("users", users, function(err, result) {
//     client.get("users", function(err, result) {
//         console.dir(result);
//     });
// });

// serve these static directories
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/public/css')));
app.use(express.static(path.join(__dirname, '/public/js')));
app.use(express.static(path.join(__dirname, '/public/tpl')));
app.use(express.static(path.join(__dirname, '/public/vendor')));
app.use(express.static(path.join(__dirname, '/public/vendor/bootstrap')));
app.use(express.static(path.join(__dirname, '/public/vendor/bootstrap/css')));
app.use(express.static(path.join(__dirname, '/public/vendor/bootstrap/fonts')));
app.use(express.static(path.join(__dirname, '/public/vendor/bootstrap/js')));
app.use(express.static(path.join(__dirname, '/public/vendor/x-editable/bootstrap3-editable/css')));
app.use(express.static(path.join(__dirname, '/public/vendor/x-editable/bootstrap3-editable/img')));
app.use(express.static(path.join(__dirname, '/public/vendor/x-editable/bootstrap3-editable/js')));

console.log('App runnin');
server.listen(app.get('PORT'));
